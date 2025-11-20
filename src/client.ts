import { DanellaConfig, DEFAULT_BASE_URL } from './config';
import { HttpClient } from './lib/httpClient';
import { AuthResource } from './resources/auth';
import { TasksResource } from './resources/tasks';

export class DanellaSDK {
  private httpClient: HttpClient;
  public auth: AuthResource;
  public tasks: TasksResource;

  constructor(config: DanellaConfig) {
    const baseUrl = config.baseUrl || DEFAULT_BASE_URL;

    this.httpClient = new HttpClient({
      baseURL: baseUrl,
    });

    this.auth = new AuthResource(this.httpClient, config);
    this.tasks = new TasksResource(this.httpClient);
  }

  /**
   * Get the current authentication token
   */
  getToken(): string | null {
    return this.httpClient.getToken();
  }

  /**
   * Check if the client is authenticated
   */
  isAuthenticated(): boolean {
    return this.httpClient.getToken() !== null;
  }
}
