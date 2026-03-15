import { sendMessage, storage } from './utils';
import { AdData, ScraperStatus, Settings } from './types';

// Global flag to prevent multiple initializations
let isInitialized = false;
let isScraperRunning = false;

// Create status overlay
const createStatusOverlay = () => {
  // Remove existing overlay if any
  const existing = document.getElementById('ads-scraper-status');
  if (existing) {
    existing.remove();
  }

  const overlay = document.createElement('div');
  overlay.id = 'ads-scraper-status';
  overlay.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background-color: rgba(0, 0, 0, 0.85);
    color: white;
    padding: 15px;
    border-radius: 8px;
    z-index: 999999;
    font-size: 14px;
    font-family: Arial, sans-serif;
    box-shadow: 0 4px 6px rgba(0,0,0,0.3);
    min-width: 200px;
  `;

  overlay.innerHTML = `
    <div style="margin-bottom: 8px; font-weight: bold; border-bottom: 1px solid #444; padding-bottom: 5px;">
      L2G Ads Scraper
    </div>
    <div style="margin-bottom: 5px;">Status: <span id="scraper-status-text" style="font-weight: bold;">Idle</span></div>
    <div style="margin-bottom: 5px;">Progress: <span id="scraper-progress-text">0/0</span></div>
    <div style="font-size: 12px; color: #aaa;">Updated: <span id="scraper-updated-time">${new Date().toLocaleTimeString()}</span></div>
  `;
  
  document.body.appendChild(overlay);
  console.log('✅ Status overlay created');
};

const updateStatusOverlay = (status: ScraperStatus) => {
  const statusText = document.getElementById('scraper-status-text');
  const progressText = document.getElementById('scraper-progress-text');
  const updatedTime = document.getElementById('scraper-updated-time');

  if (statusText && progressText && updatedTime) {
    statusText.textContent = status.state;
    progressText.textContent = `${status.current}/${status.total}`;
    updatedTime.textContent = new Date().toLocaleTimeString();

    if (status.state === 'Running') {
      statusText.style.color = '#4CAF50';
    } else if (status.state === 'Paused') {
      statusText.style.color = '#FFC107';
    } else if (status.state === 'Idle') {
      statusText.style.color = 'white';
    }
  }
};

const timestampToDate = (timestamp: string): string => {
  const date = new Date(parseInt(timestamp) * 1000);
  return date.toISOString().split('T')[0];
};

// Helper function to format currency
const formatCurrency = (amount: string, currency: string = 'USD'): string => {
  if (!amount) return '';
  const num = parseInt(amount);
  if (isNaN(num)) return amount;
  
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num);
  
  return formatted;
};

// Main scraper function
const scrapeAdsData = async () => {
  if (isScraperRunning) {
    console.warn('⚠️ Scraper already running, skipping...');
    return;
  }

  isScraperRunning = true;
  console.log('🚀 Starting scraper...');

  let status: ScraperStatus = await storage.get('status') as ScraperStatus || {
    state: 'Idle',
    current: 0,
    total: 0,
    data: [],
    nextToken: undefined
  };

  if (!status.data) {
    status.data = [];
  }

  const settings = await storage.get('settings') as Settings || {
    enabled: false,
    delay: 2000,
    maxCount: 100,
    selectAll: false,
    mode: 'local'
  };

  if (!settings.enabled) {
    console.log('⚠️ Scraper not enabled in settings');
    isScraperRunning = false;
    return;
  }

  status.state = 'Running';
  status.total = settings.maxCount;
  await storage.set('status', status);
  updateStatusOverlay(status);

  chrome.runtime.sendMessage({
    event: 'statusUpdate',
    data: status
  }).catch(err => console.log('Popup closed:', err));

  try {
    let nextToken: any = null;
    let processedCount = 0;

    while (processedCount < settings.maxCount && status.state === 'Running') {
      status = await storage.get('status') as ScraperStatus;
      
      if (status.state === 'Paused') {
        console.log('⏸️ Scraper paused');
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }

      if (status.state === 'Idle') {
        console.log('⏹️ Scraper stopped');
        break;
      }

      const data = await fetchAdsData(nextToken);

      if (!data) {
        console.log("❌ No data received");
        break;
      }

      let structuredData = await handleResponseData(data);
      const imageUrls = structuredData.map((item: any) => item.imageUrl);

      let domainList = [];
      try {
        domainList = await sendMessage({ event: 'getDomains', data: imageUrls });
      } catch (error) {
        console.error('Error getting domains:', error);
        domainList = Array(imageUrls.length).fill('');
      }

      structuredData = structuredData.map((item: any, index: any) => ({
        ...item,
        domain: domainList[index] || item.domain
      }));

      await saveDataToLocalStorage(structuredData);

      nextToken = data?.['2'];
      processedCount += structuredData.length;

      status.current = processedCount;
      status.nextToken = nextToken;
      await storage.set('status', status);
      updateStatusOverlay(status);

      chrome.runtime.sendMessage({
        event: 'statusUpdate',
        data: status
      }).catch(err => console.log('Popup closed:', err));

      console.log(`✅ Processed ${processedCount}/${settings.maxCount} ads`);

      await new Promise(resolve => setTimeout(resolve, settings.delay));

      if (!nextToken) {
        console.log('✅ No more data available');
        break;
      }
    }

    if (status.state === 'Running') {
      status.state = 'Idle';
      await storage.set('status', status);
      updateStatusOverlay(status);

      chrome.runtime.sendMessage({
        event: 'statusUpdate',
        data: status
      }).catch(err => console.log('Popup closed:', err));
      
      console.log('✅ Scraping completed');
    }
  } catch (error) {
    console.error('❌ Error in scraper:', error);
    status.state = 'Idle';
    await storage.set('status', status);
    updateStatusOverlay(status);
  } finally {
    isScraperRunning = false;
  }
};

const saveDataToLocalStorage = async (data: any): Promise<boolean> => {
  const savedData = (await storage.get<any[]>("dataList")) ?? [];
  const newArray = [...savedData, ...data];
  await storage.set("dataList", newArray);
  return true;
}

const handleResponseData = (data: any): Promise<any> => {
  let dataArray: any = []
  
  function getImageUrlFromElementString(ele: any) {
    const match = ele.match(/<img[^>]+src="([^"]+)"/);
    return match ? match[1] : '';
  }

  data['1'].forEach(async (item: any) => {
    // Extract currency and spending from field 10 (min spend) and field 11 (max spend)
    let currency = 'USD';
    let minSpend = '';
    let maxSpend = '';
    
    // Field 10: Min spend - structure: {1: [{1: "USD", 2: "600"}]}
    if (item["10"] && item["10"]["1"] && item["10"]["1"][0]) {
      currency = item["10"]["1"][0]["1"] || 'USD';
      minSpend = item["10"]["1"][0]["2"] || '';
    }
    
    // Field 11: Max spend - structure: {1: [{1: "USD", 2: "700"}]}
    if (item["11"] && item["11"]["1"] && item["11"]["1"][0]) {
      if (!currency && item["11"]["1"][0]["1"]) {
        currency = item["11"]["1"][0]["1"];
      }
      maxSpend = item["11"]["1"][0]["2"] || '';
    }

    // Extract min and max shown range from fields 8 and 9
    const minShownRange = item["8"] || '';
    const maxShownRange = item["9"] || '';

    // Create formatted spend range
    let spendRange = '';
    if (minSpend && maxSpend) {
      spendRange = `${formatCurrency(minSpend, currency)} - ${formatCurrency(maxSpend, currency)}`;
    } else if (minSpend) {
      spendRange = `${formatCurrency(minSpend, currency)}+`;
    } else if (maxSpend) {
      spendRange = `Up to ${formatCurrency(maxSpend, currency)}`;
    }

    // Create formatted shown range
    let shownRange = '';
    if (minShownRange && maxShownRange) {
      shownRange = `${parseInt(minShownRange).toLocaleString()} - ${parseInt(maxShownRange).toLocaleString()}`;
    } else if (minShownRange) {
      shownRange = `${parseInt(minShownRange).toLocaleString()}+`;
    } else if (maxShownRange) {
      shownRange = `Up to ${parseInt(maxShownRange).toLocaleString()}`;
    }

    const adData: AdData = {
      advertiserId: item["1"] || '',
      advertiserName: item["12"] || '',
      urlDetail: `https://adstransparency.google.com/advertiser/${item["1"]}/creative/${item["2"]}`,
      startDate: item["6"] && item["6"]['1'] ? timestampToDate(item["6"]['1']) : '',
      endDate: item["7"] && item["7"]['1'] ? timestampToDate(item["7"]['1']) : '',
      totalDisplayDays: item["13"] || 0,
      domain: '',
      imageUrl: item["3"] && item["3"]['3'] && item["3"]['3']['2'] ?
        getImageUrlFromElementString(item["3"]['3']['2']) : '',
      minSpend: minSpend,
      maxSpend: maxSpend,
      currency: currency,
      spendRange: spendRange,
      minShownRange: minShownRange,
      maxShownRange: maxShownRange,
      shownRange: shownRange
    }
    dataArray.push(adData);
  });

  return dataArray;
}

const fetchAdsData = async (nextToken?: string): Promise<any> => {
  const xsrfToken = await storage.get('xsrfToken') as string | null;
  if (!xsrfToken) {
    console.error('❌ XSRF token not found. Please ensure you are logged in to Google Ads Transparency.');
    return null;
  }
  try {
    const myHeaders = new Headers();
    myHeaders.append("x-framework-xsrf-token", xsrfToken);

    const requestBody: any = JSON.parse(await storage.get('formData') as string | null || '{}');
    console.log('📤 Request body:', requestBody);

    if (nextToken) {
      requestBody["4"] = nextToken;
    }

    const urlencoded = new URLSearchParams();
    urlencoded.append("f.req", JSON.stringify(requestBody));

    const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow"
    };

    const response = await fetch(
      "https://adstransparency.google.com/anji/_/rpc/SearchService/SearchCreatives?authuser=0",
      requestOptions
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('❌ Error fetching ads data:', error);
    return null;
  }
};

const setupNetworkInterceptor = () => {
  const originalFetch = window.fetch;

  window.fetch = async function (input: RequestInfo | URL, init?: RequestInit) {
    const response = await originalFetch.apply(this, [input, init as any]);
    const responseClone = response.clone();

    try {
      const url = typeof input === 'string' ? input : (input as Request).url;

      if (url.includes('SearchCreatives') || url.includes('GetAdvertiserById')) {
        responseClone.json().then(data => {
          storage.set(`intercepted_${Date.now()}`, { url, data });
        });
      }
    } catch (error) {
      console.error('Error in fetch interceptor:', error);
    }

    return response;
  };
};

// Initialize
const init = async () => {
  if (isInitialized) {
    console.log('⚠️ Content script already initialized');
    return;
  }

  console.log('🟢 L2G Ads Content Script Initializing...');

  createStatusOverlay();
  setupNetworkInterceptor();

  // Message listener
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('📨 Content script received message:', message.event);
    
    if (message.event === 'ping') {
      sendResponse({ success: true, message: 'Content script is alive' });
      return true;
    }
    
    if (message.event === 'start') {
      storage.get('settings').then((settings: unknown) => {
        const settingsObj = settings as Settings || {
          enabled: true,
          delay: 2000,
          maxCount: 100,
          selectAll: false,
          mode: 'local'
        };
        settingsObj.enabled = true;
        storage.set('settings', settingsObj).then(() => {
          scrapeAdsData();
          sendResponse({ success: true });
        });
      });
      return true;
    } else if (message.event === 'stop') {
      storage.get('status').then((status: unknown) => {
        const scraperStatus = status as ScraperStatus || { state: 'Idle', current: 0, total: 0, data: [] };
        if (!scraperStatus.data) scraperStatus.data = [];
        scraperStatus.state = 'Idle';
        storage.set('status', scraperStatus);
        updateStatusOverlay(scraperStatus);
        isScraperRunning = false;
        sendResponse({ success: true });
      });
      return true;
    } else if (message.event === 'pause') {
      storage.get('status').then((status: unknown) => {
        const scraperStatus = status as ScraperStatus || { state: 'Paused', current: 0, total: 0, data: [] };
        if (!scraperStatus.data) scraperStatus.data = [];
        scraperStatus.state = 'Paused';
        storage.set('status', scraperStatus);
        updateStatusOverlay(scraperStatus);
        sendResponse({ success: true });
      });
      return true;
    } else if (message.event === 'resume') {
      storage.get('status').then((status: unknown) => {
        const scraperStatus = status as ScraperStatus || { state: 'Running', current: 0, total: 0, data: [] };
        if (!scraperStatus.data) scraperStatus.data = [];
        scraperStatus.state = 'Running';
        storage.set('status', scraperStatus);
        updateStatusOverlay(scraperStatus);
        scrapeAdsData();
        sendResponse({ success: true });
      });
      return true;
    } else if (message.event === 'updateSettings') {
      const { delay, maxCount, selectAll, mode } = message.data;
      storage.get('settings').then((settings: unknown) => {
        const settingsObj = settings as Settings || {
          enabled: true,
          delay: 2000,
          maxCount: 100,
          selectAll: false,
          mode: 'local'
        };

        settingsObj.delay = delay;
        settingsObj.maxCount = maxCount;
        settingsObj.selectAll = selectAll;
        if (mode !== undefined) settingsObj.mode = mode;
        settingsObj.enabled = true;

        storage.set('settings', settingsObj);
        sendResponse({ success: true });
      });
      return true;
    } else if (message.event === 'clearData') {
      storage.set('dataList', []);
      sendResponse({ success: true });
      return true;
    } else if (message.event === 'modeChange') {
      const { mode } = message.data;
      storage.get('settings').then((settings: unknown) => {
        const settingsObj = settings as Settings || {
          enabled: true,
          delay: 2000,
          maxCount: 100,
          selectAll: false,
          mode: 'local'
        };
        settingsObj.mode = mode;
        storage.set('settings', settingsObj);
        sendResponse({ success: true });
      });
      return true;
    }

    return true;
  });

  const settings = await storage.get('settings') as Settings | null;
  const status = await storage.get('status') as ScraperStatus | null;

  if (settings) {
    settings.enabled = true;
    await storage.set('settings', settings);
  } else {
    await storage.set('settings', {
      enabled: true,
      delay: 2000,
      maxCount: 100,
      selectAll: false,
      mode: 'local'
    });
  }

  if (status && status.state === 'Running') {
    scrapeAdsData();
  }
  
  isInitialized = true;
  console.log('✅ Content script initialized successfully');
};

// Run init when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Signal that content script is loaded
console.log('🟢 L2G Ads Content Script Loaded');
