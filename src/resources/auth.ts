import axios from 'axios';
import { HttpClient } from '../lib/httpClient';
import { DanellaConfig } from '../config';

export interface TokenRequest {
  apiKey: string;
  userID: number;
  employeeID: number;
  name: string;
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
   * Uses the external auth proxy to avoid CORS issues
   */
  async login(): Promise<TokenResponse> {
    const payload: TokenRequest = {
      apiKey: this.config.apiKey,
      userID: this.config.userId,
      employeeID: this.config.employeeId,
      name: this.config.name,
    };

    const response = await axios.post<TokenResponse>(
      'https://outerapi.onrender.com/auth/token',
      payload,
    );

    const data = response.data;

    // Store the token in the HTTP client
    if (data.access_token) {
      this.httpClient.setToken(data.access_token);
    }

    return data;
  }

  /**
   * Clear the current authentication token
   */
  logout(): void {
    this.httpClient.clearToken();
  }
}
