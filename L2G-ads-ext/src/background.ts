import { storage, checkLicenseStatus } from './utils';
import { Settings, ScraperStatus } from './types';

// Listen for installation and startup
chrome.runtime.onInstalled.addListener(async () => {
  await initializeExtension();
});

chrome.runtime.onStartup.addListener(async () => {
  console.log('🚀 Extension started');
  
  // Validate license on browser startup
  const licenseCheck = await checkLicenseStatus();
  if (licenseCheck.valid) {
    console.log('✅ License valid on startup');
  } else {
    console.log('❌ License invalid or expired on startup');
  }
});

const initializeExtension = async () => {
  // Initialize settings
  const settings = await storage.get('settings');
  if (!settings) {
    const defaultSettings: Settings = {
      enabled: false,
      delay: 2000,
      maxCount: 100,
      selectAll: false,
      mode: 'local'
    };
    await storage.set('settings', defaultSettings);
  }

  // Initialize status
  const status = await storage.get('status');
  if (!status) {
    const defaultStatus: ScraperStatus = {
      state: 'Idle',
      current: 0,
      total: 0,
      data: []
    };
    await storage.set('status', defaultStatus);
  }
};

// Handle domain extraction requests
chrome.runtime.onMessage.addListener((req: any, sender, sendResponse) => {
  if (req.event === 'getDomains') {
    const validImages = req.data.filter((url: string) => url && url.trim() !== '');

    if (validImages.length === 0) {
      console.log('No valid image URLs provided');
      sendResponse(Array(req.data.length).fill(''));
      return true;
    }

    getDomains(validImages).then(domainList => {
      const result: string[] = [];
      let domainIndex = 0;

      for (let i = 0; i < req.data.length; i++) {
        if (req.data[i] && req.data[i].trim() !== '') {
          result.push(domainList[domainIndex] || '');
          domainIndex++;
        } else {
          result.push('');
        }
      }

      sendResponse(result);
    }).catch(error => {
      console.error('Error extracting domains:', error);
      sendResponse(Array(req.data.length).fill(''));
    });

    return true;
  }

  return false;
});

async function getDomains(images: string[]): Promise<string[]> {
  try {
    const apiUrl: any = await storage.get('apiUrl') || 'https://adsocr.solidnexus.lk/ocr';
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        images
      }),
    });

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    const result = await response.json();
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error('Error in getDomains function:', error);
    return [];
  }
}

// Capture XSRF token for API requests
chrome.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    if (details.url.includes("adstransparency.google.com/anji/_/rpc/SearchService/SearchCreatives")) {
      if (details.requestHeaders) {
        const token = details.requestHeaders?.find(
          h => h.name.toLowerCase() === 'x-framework-xsrf-token'
        )?.value;

        if (token) {
          storage.set('xsrfToken', token);
          console.log('✅ XSRF token captured');
        }
      }
    }
    return { requestHeaders: details.requestHeaders };
  },
  { urls: ["<all_urls>"] },
  ["requestHeaders"]
);

chrome.webRequest.onBeforeRequest.addListener((details) => {
  if (details.method === "POST") {
    if (details.url.includes("adstransparency.google.com/anji/_/rpc/SearchService/SearchCreatives")) {
      if (details.requestBody && details.requestBody.formData) {
        storage.get('status').then((status) => {
          const s = status as ScraperStatus;
          if (
            s.state === 'Idle' &&
            details.requestBody &&
            details.requestBody.formData &&
            details.requestBody.formData["f.req"] &&
            details.requestBody.formData["f.req"][0]
          ) {
            storage.set('formData', details.requestBody.formData["f.req"][0]);
            console.log('✅ Form data captured');
          }
        });
      }
    }
  }
},
  {
    urls: ["<all_urls>"],
    types: ["xmlhttprequest"]
  },
  ["requestBody"]
);
