import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { DanellaError, AuthenticationError, NotFoundError, ValidationError } from './errors';

export interface HttpClientConfig {
  baseURL: string;
  timeout?: number;
}

export class HttpClient {
  private axiosInstance: AxiosInstance;
  private token: string | null = null;
  private refreshTokenCallback: (() => Promise<string>) | null = null;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: Error) => void;
  }> = [];

  constructor(config: HttpClientConfig) {
    this.axiosInstance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor: inject token if available
    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }

        // Debug logging
        if (process.env.DEBUG_API === 'true') {
          console.log('\n🔍 API Request Debug:');
          console.log('URL:', `${config.baseURL || ''}${config.url || ''}`);
          console.log('Method:', config.method?.toUpperCase());
          console.log('Headers:', JSON.stringify(config.headers, null, 2));
          console.log('Payload:', JSON.stringify(config.data, null, 2));
        }

        return config;
      },
      (error) => Promise.reject(error),
    );

    // Response interceptor: handle errors and token refresh
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        if (error.response) {
          const { status, data } = error.response;

          // Handle 401 with token refresh
          if (status === 401 && !originalRequest._retry && this.refreshTokenCallback) {
            if (this.isRefreshing) {
              // Queue the request while refreshing
              return new Promise((resolve, reject) => {
                this.failedQueue.push({ resolve, reject });
              })
                .then((token) => {
                  if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                  }
                  return this.axiosInstance(originalRequest);
                })
                .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            this.isRefreshing = true;

            try {
              const newToken = await this.refreshTokenCallback();
              this.token = newToken;
              this.processQueue(null, newToken);

              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
              }

              return this.axiosInstance(originalRequest);
            } catch (refreshError) {
              this.processQueue(refreshError as Error, null);
              throw new AuthenticationError('Token refresh failed');
            } finally {
              this.isRefreshing = false;
            }
          }

          switch (status) {
            case 401:
              throw new AuthenticationError(
                (data as { message?: string })?.message || 'Unauthorized',
              );
            case 404:
              throw new NotFoundError((data as { message?: string })?.message || 'Not found');
            case 400:
              throw new ValidationError((data as { message?: string })?.message || 'Bad request');
            default:
              throw new DanellaError(
                (data as { message?: string })?.message || 'Request failed',
                status,
                data,
              );
          }
        }

        throw new DanellaError(error.message || 'Network error');
      },
    );
  }

  private processQueue(error: Error | null, token: string | null): void {
    this.failedQueue.forEach((promise) => {
      if (error) {
        promise.reject(error);
      } else if (token) {
        promise.resolve(token);
      }
    });

    this.failedQueue = [];
  }

  setToken(token: string): void {
    this.token = token;
  }

  clearToken(): void {
    this.token = null;
  }

  getToken(): string | null {
    return this.token;
  }

  setRefreshTokenCallback(callback: () => Promise<string>): void {
    this.refreshTokenCallback = callback;
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.delete<T>(url, config);
    return response.data;
  }
}
