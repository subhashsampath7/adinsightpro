import Browser from "webextension-polyfill";

type Request = {
    event: string;
    data: any;
};

export async function sendMessage<T = any>(request: Request) {
    const response = await Browser.runtime.sendMessage(request);
    return response as T;
}

export async function sendMessageToTab<T = any>(request: Request) {
    const [tab] = await Browser.tabs.query({
        active: true,
        lastFocusedWindow: true,
    });
    if (tab && tab.id) {
        const response = await Browser.tabs.sendMessage(tab.id, request);
        return response as T;
    }
}

export async function updateTab<T = any>(url: string) {
    const [tab] = await Browser.tabs.query({
        active: true,
        lastFocusedWindow: true,
    });
    if (tab && tab.id) {
        const response = await Browser.tabs.update(tab.id, { url });
        return response as T;
    }
}

class StorageService {
    async get<T>(key: string | null): Promise<T | null> {
        try {
            const localStorage = await Browser.storage.local.get(key);
            if (key) {
                return localStorage[key] !== undefined ? (localStorage[key] as T) : null;
            }
            return localStorage as T;
        } catch (error) {
            console.error('Error retrieving data:', error);
            return null;
        }
    }

    async set<T>(key: string, value: T): Promise<void> {
        try {
            await Browser.storage.local.set({ [key]: value });
        } catch (error) {
            console.error('Error setting data:', error);
        }
    }

    async remove(key: string): Promise<void> {
        try {
            await Browser.storage.local.remove(key);
        } catch (error) {
            console.error('Error removing data:', error);
        }
    }
}
export const storage = new StorageService();

export function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function formatNumber(num: number): string {
    return new Intl.NumberFormat().format(num);
}

export function downloadFile(content: string, filename: string, contentType: string) {
    const a = document.createElement('a');
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
}

// License validation functions
const API_BASE_URL = 'http://localhost:5000';

export async function validateLicense(key: string): Promise<{ valid: boolean; data?: any; message?: string }> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/license/activation`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                key, 
                extensionName: chrome.runtime.getManifest().name 
            })
        });

        const result = await response.json();

        if (response.ok && result.success) {
            return { 
                valid: true, 
                data: result.data 
            };
        } else {
            return { 
                valid: false, 
                message: result.message || 'Invalid license key' 
            };
        }
    } catch (error) {
        console.error('License validation error:', error);
        return { 
            valid: false, 
            message: 'Failed to connect to license server' 
        };
    }
}

export async function saveLicense(key: string, data: any): Promise<void> {
    await storage.set('licenseKey', key);
    await storage.set('licenseData', {
        ...data,
        validatedAt: new Date().toISOString()
    });
}

export async function getLicense(): Promise<{ key: string | null; data: any | null }> {
    const key = await storage.get<string>('licenseKey');
    const data = await storage.get<any>('licenseData');
    return { key, data };
}

export async function removeLicense(): Promise<void> {
    await storage.remove('licenseKey');
    await storage.remove('licenseData');
}

export async function checkLicenseStatus(): Promise<{ valid: boolean; data?: any; message?: string }> {
    const { key, data } = await getLicense();
    
    if (!key) {
        return { valid: false, message: 'No license key found' };
    }

    // Check if we need to revalidate (every 24 hours or on browser restart)
    const shouldRevalidate = !data || 
        !data.validatedAt || 
        (new Date().getTime() - new Date(data.validatedAt).getTime()) > 24 * 60 * 60 * 1000;

    if (shouldRevalidate) {
        console.log('🔄 Revalidating license...');
        const result = await validateLicense(key);
        
        if (result.valid) {
            await saveLicense(key, result.data);
            return result;
        } else {
            // Invalid license, remove it
            await removeLicense();
            return result;
        }
    }

    // License is still valid from cache
    return { valid: true, data };
}

export function calculateDaysRemaining(expiresAt: string): number {
    const expiry = new Date(expiresAt);
    const now = new Date();
    const diff = expiry.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
