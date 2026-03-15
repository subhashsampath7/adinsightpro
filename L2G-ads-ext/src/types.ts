export interface AdData {
  advertiserId: string;
  advertiserName: string;
  urlDetail: string;
  startDate: string;
  endDate: string;
  totalDisplayDays: number;
  domain: string;
  imageUrl: string;
  minSpend?: string;       
  maxSpend?: string;        
  currency?: string;        
  spendRange?: string; 
  minShownRange: string;
  maxShownRange: string;
  shownRange: string;     
}

export interface ScraperStatus {
  state: 'Idle' | 'Running' | 'Paused';
  current: number;
  total: number;
  data: AdData[];
  nextToken?: string;
}

export interface Settings {
  enabled: boolean;
  delay: number;
  maxCount: number;
  selectAll: boolean;
  mode: 'local' | 'server';
}

export interface LicenseData {
  key: string;
  isValid: boolean;
  expiresAt?: string;
}

export interface RegistrationData {
  email: string;
  username: string;
}
