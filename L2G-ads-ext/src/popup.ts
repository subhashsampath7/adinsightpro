import { storage, validateLicense, saveLicense, getLicense, removeLicense, checkLicenseStatus, calculateDaysRemaining } from './utils';
import { ScraperStatus, Settings } from './types';

// License elements
const licenseContainer = document.getElementById('licenseContainer') as HTMLDivElement;
const licenseKeyInput = document.getElementById('licenseKeyInput') as HTMLInputElement;
const activateBtn = document.getElementById('activateBtn') as HTMLButtonElement;
const registerLink = document.getElementById('registerLink') as HTMLAnchorElement;
const licenseStatus = document.getElementById('licenseStatus') as HTMLDivElement;

// Main app elements
const popupContainer = document.getElementById('popupContainer') as HTMLDivElement;
const startBtn = document.getElementById('startBtn') as HTMLButtonElement;
const pauseBtn = document.getElementById('pauseBtn') as HTMLButtonElement;
const resumeBtn = document.getElementById('resumeBtn') as HTMLButtonElement;
const stopBtn = document.getElementById('stopBtn') as HTMLButtonElement;
const delayInput = document.getElementById('delayInput') as HTMLInputElement;
const maxCountInput = document.getElementById('maxCountInput') as HTMLInputElement;
const selectAllCheckbox = document.getElementById('selectAllCheckbox') as HTMLInputElement;
const dashboardBtn = document.getElementById('dashboardBtn') as HTMLButtonElement;
const modeToggle = document.getElementById('modeToggle') as HTMLInputElement;
const currentMode = document.getElementById('currentMode') as HTMLSpanElement;
const statusText = document.getElementById('statusText') as HTMLSpanElement;
const licenseStatusText = document.getElementById('licenseStatusText') as HTMLSpanElement;
const licenseExpiryText = document.getElementById('licenseExpiryText') as HTMLSpanElement;
const deactivateLicenseBtn = document.getElementById('deactivateLicenseBtn') as HTMLButtonElement;

// Show status message
const showStatus = (element: HTMLElement, message: string, type: 'success' | 'error' | 'info') => {
    element.textContent = message;
    element.className = `status-message ${type}`;
    element.style.display = 'block';
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        element.style.display = 'none';
    }, 5000);
};

// Show license screen
const showLicenseScreen = () => {
    licenseContainer.style.display = 'block';
    popupContainer.style.display = 'none';
};

// Show main app
const showMainApp = async () => {
    licenseContainer.style.display = 'none';
    popupContainer.style.display = 'block';
    
    // Update license info
    const { data } = await getLicense();
    if (data) {
        const daysRemaining = calculateDaysRemaining(data.expiresAt);
        licenseStatusText.textContent = '✓ License Active';
        licenseStatusText.style.color = '#4CAF50';
        
        if (daysRemaining <= 5) {
            licenseExpiryText.textContent = `⚠️ Expires in ${daysRemaining} days`;
            licenseExpiryText.style.color = '#FFC107';
        } else {
            licenseExpiryText.textContent = `Expires in ${daysRemaining} days`;
            licenseExpiryText.style.color = '#888';
        }
    }
};

// Setup license listeners
const setupLicenseListeners = () => {
    // Activate button
    activateBtn.addEventListener('click', async () => {
        const key = licenseKeyInput.value.trim();
        
        if (!key) {
            showStatus(licenseStatus, 'Please enter a license key', 'error');
            return;
        }

        activateBtn.textContent = 'Activating...';
        activateBtn.disabled = true;

        const result = await validateLicense(key);

        if (result.valid) {
            await saveLicense(key, result.data);
            showStatus(licenseStatus, 'License activated successfully!', 'success');
            
            setTimeout(() => {
                showMainApp();
                initMainApp();
            }, 1000);
        } else {
            showStatus(licenseStatus, result.message || 'Invalid license key', 'error');
        }

        activateBtn.textContent = 'Activate License';
        activateBtn.disabled = false;
    });

    // Register link
    registerLink.addEventListener('click', (e) => {
        e.preventDefault();
        chrome.tabs.create({ url: 'http://localhost:5173/register' });
    });

    // Enter key to activate
    licenseKeyInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            activateBtn.click();
        }
    });
};

// Check if content script is ready
const checkContentScriptReady = async (): Promise<boolean> => {
    try {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        const currentTab = tabs[0];
        
        if (!currentTab?.id) return false;
        if (!currentTab.url?.includes('adstransparency.google.com')) return false;
        
        const response = await chrome.tabs.sendMessage(currentTab.id, { event: 'ping' });
        return response?.success === true;
    } catch {
        return false;
    }
};

// Send message to content script with retry
const sendMessageToContentScript = async (message: any, retries = 3): Promise<any> => {
    try {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        const currentTab = tabs[0];

        if (!currentTab?.id) {
            return { success: false, error: 'No active tab' };
        }

        if (!currentTab.url?.includes('adstransparency.google.com')) {
            alert('⚠️ Please navigate to Google Ads Transparency Center first\n\nhttps://adstransparency.google.com');
            return { success: false, error: 'Invalid page' };
        }

        for (let i = 0; i < retries; i++) {
            try {
                const response = await chrome.tabs.sendMessage(currentTab.id, message);
                return response;
            } catch (error: any) {
                if (i < retries - 1) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                    
                    if (i === retries - 2) {
                        await chrome.tabs.reload(currentTab.id);
                        await new Promise(resolve => setTimeout(resolve, 3000));
                    }
                } else {
                    throw error;
                }
            }
        }
    } catch (error: any) {
        if (error.message?.includes('Receiving end does not exist')) {
            alert('❌ Content script not loaded.\n\nPlease:\n1. Refresh the Google Ads Transparency page\n2. Wait a few seconds\n3. Try again');
        }
        return { success: false, error: String(error) };
    }
};

// Initialize popup
const initPopup = async () => {
    console.log('🚀 Initializing popup...');
    
    // Check license status
    const licenseCheck = await checkLicenseStatus();
    
    if (!licenseCheck.valid) {
        console.log('❌ No valid license found');
        showLicenseScreen();
        setupLicenseListeners();
        return;
    }
    
    console.log('✅ License valid');
    await showMainApp();
    await initMainApp();
};

// Initialize main app
const initMainApp = async () => {
    try {
        const settings = await storage.get('settings') as Settings || {
            enabled: false,
            delay: 2000,
            maxCount: 100,
            selectAll: false,
            mode: 'local'
        };

        delayInput.value = settings.delay.toString();
        maxCountInput.value = settings.maxCount.toString();
        selectAllCheckbox.checked = settings.selectAll;
        modeToggle.checked = settings.mode === 'server';

        updateModeDisplay();

        if (settings.selectAll) {
            maxCountInput.disabled = true;
        }

        const status = await storage.get('status') as ScraperStatus || {
            state: 'Idle',
            current: 0,
            total: 0,
            data: []
        };

        setupEventListeners();
        await checkCurrentPage();
        updateButtonStates(status.state);
    } catch (error) {
        console.error('Error initializing main app:', error);
    }
};

const updateModeDisplay = () => {
    if (modeToggle.checked) {
        currentMode.textContent = 'Server';
        currentMode.className = 'current-mode server-mode';
    } else {
        currentMode.textContent = 'Local';
        currentMode.className = 'current-mode local-mode';
    }
};

const updateButtonStates = (state: any) => {
    if (state === 'Running') {
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        resumeBtn.disabled = true;
        stopBtn.disabled = false;
    } else if (state === 'Paused') {
        startBtn.disabled = true;
        pauseBtn.disabled = true;
        resumeBtn.disabled = false;
        stopBtn.disabled = false;
    } else {
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        resumeBtn.disabled = true;
        stopBtn.disabled = true;
    }
};

const checkCurrentPage = async () => {
    try {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        const currentTab = tabs[0];

        if (!currentTab.url?.includes('adstransparency.google.com')) {
            startBtn.disabled = true;
            pauseBtn.disabled = true;
            resumeBtn.disabled = true;
            stopBtn.disabled = true;
            
            if (statusText) {
                statusText.textContent = '⚠️ Navigate to Google Ads Transparency';
                statusText.style.color = '#FFC107';
            }
        } else {
            const isReady = await checkContentScriptReady();
            if (statusText) {
                if (isReady) {
                    statusText.textContent = '✓ Ready to scrape';
                    statusText.style.color = '#4CAF50';
                } else {
                    statusText.textContent = '⚠️ Please refresh the page';
                    statusText.style.color = '#FFC107';
                }
            }
        }
    } catch (error) {
        console.error('Error checking current page:', error);
    }
};

const setupEventListeners = () => {
    startBtn.addEventListener('click', async () => {
        await saveSettings();
        startBtn.disabled = true;
        startBtn.textContent = 'Starting...';
        
        const response = await sendMessageToContentScript({ event: 'start' });
        
        if (response && response.success) {
            updateButtonStates('Running');
            startBtn.textContent = 'Start';
        } else {
            startBtn.disabled = false;
            startBtn.textContent = 'Start';
        }
    });

    pauseBtn.addEventListener('click', async () => {
        const response = await sendMessageToContentScript({ event: 'pause' });
        if (response && response.success) {
            updateButtonStates('Paused');
        }
    });

    resumeBtn.addEventListener('click', async () => {
        const response = await sendMessageToContentScript({ event: 'resume' });
        if (response && response.success) {
            updateButtonStates('Running');
        }
    });

    stopBtn.addEventListener('click', async () => {
        const response = await sendMessageToContentScript({ event: 'stop' });
        if (response && response.success) {
            updateButtonStates('Idle');
        }
    });

    dashboardBtn.addEventListener('click', () => {
        chrome.tabs.create({ url: chrome.runtime.getURL('dashboard.html') });
    });

    delayInput.addEventListener('change', saveSettings);
    maxCountInput.addEventListener('change', saveSettings);

    selectAllCheckbox.addEventListener('change', () => {
        maxCountInput.disabled = selectAllCheckbox.checked;
        saveSettings();
    });

    modeToggle.addEventListener('change', async () => {
        updateModeDisplay();
        await saveSettings();
        const mode = modeToggle.checked ? 'server' : 'local';
        const apiUrl = mode === 'server' ? 'https://adsocr.solidnexus.lk/ocr' : 'http://localhost:3000/ocr';
        await storage.set('apiUrl', apiUrl);

        await sendMessageToContentScript({
            event: 'modeChange',
            data: { mode }
        }).catch(() => {
            console.log('Failed to update mode in content script');
        });
    });

    // Deactivate license button
    deactivateLicenseBtn.addEventListener('click', async () => {
        if (confirm('Are you sure you want to deactivate your license?\n\nYou will need to enter it again to use the extension.')) {
            await removeLicense();
            showLicenseScreen();
            setupLicenseListeners();
        }
    });
};

const saveSettings = async () => {
    const delay = parseInt(delayInput.value) || 2000;
    const maxCount = parseInt(maxCountInput.value) || 100;
    const selectAll = selectAllCheckbox.checked;
    const mode = modeToggle.checked ? 'server' : 'local';

    if (delay < 1000) delayInput.value = '1000';
    if (maxCount < 1) maxCountInput.value = '1';

    const settings = await storage.get('settings') as Settings || {
        enabled: true,
        delay: 2000,
        maxCount: 100,
        selectAll: false,
        mode: 'local'
    };

    settings.delay = delay;
    settings.maxCount = maxCount;
    settings.selectAll = selectAll;
    settings.mode = mode;

    await storage.set('settings', settings);

    sendMessageToContentScript({
        event: 'updateSettings',
        data: { delay, maxCount, selectAll, mode }
    }).catch(() => {
        console.log('Content script not ready for settings update');
    });
};

chrome.runtime.onMessage.addListener((message) => {
    if (message.event === 'statusUpdate') {
        if (message.data && message.data.state) {
            updateButtonStates(message.data.state);
        }
    }
});

document.addEventListener('DOMContentLoaded', initPopup);
