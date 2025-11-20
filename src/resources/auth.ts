import { HttpClient } from '../lib/httpClient';
import { DanellaConfig } from '../config';

export interface TokenRequest {
  apiKey: string;
  userID: number;
  employeeID: number;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export class AuthResource {
  constructor(
    private httpClient: HttpClient,
    private config: DanellaConfig,
  ) {}

  /**
   * Authenticate and obtain an access token
   */
  async login(): Promise<TokenResponse> {
    const payload: TokenRequest = {
      apiKey: this.config.apiKey,
      userID: this.config.userId,
      employeeID: this.config.employeeId,
    };

    const response = await this.httpClient.post<TokenResponse>('/api/auth/token', payload);

    // Store the token in the HTTP client
    if (response.access_token) {
      this.httpClient.setToken(response.access_token);
    }

    return response;
  }

  /**
   * Clear the current authentication token
   */
  logout(): void {
    this.httpClient.clearToken();
  }
}
