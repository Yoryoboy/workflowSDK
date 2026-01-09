export interface DanellaConfig {
  apiKey: string;
  userId: number;
  employeeId: number;
  name: string;
  baseUrl?: string;
  debug?: boolean;
}

export const DEFAULT_BASE_URL = 'https://danella-x.com';
export const AUTH_ENDPOINT = 'https://outerapi.onrender.com/auth/token';
