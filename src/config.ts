export interface DanellaConfig {
  apiKey: string;
  userId: number;
  employeeId: number;
  name?: string;
  baseUrl?: string;
}

export const DEFAULT_BASE_URL = 'https://danella-x.com';
