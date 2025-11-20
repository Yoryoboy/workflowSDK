import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { DanellaError, AuthenticationError, NotFoundError, ValidationError } from './errors';

export interface HttpClientConfig {
  baseURL: string;
  timeout?: number;
}

export class HttpClient {
  private axiosInstance: AxiosInstance;
  private token: string | null = null;

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
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Response interceptor: handle errors
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response) {
          const { status, data } = error.response;

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

  setToken(token: string): void {
    this.token = token;
  }

  clearToken(): void {
    this.token = null;
  }

  getToken(): string | null {
    return this.token;
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
