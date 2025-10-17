import { AxiosError, AxiosRequestConfig } from "axios";
import { api, handleApiError } from "./client";

// Generic API service with common HTTP methods
export class ApiService {
  /**
   * Generic GET request
   * @param url - The endpoint URL
   * @param config - Optional axios config
   * @returns Promise with response data
   */
  static async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await api.get<T>(url, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error as AxiosError);
    }
  }

  /**
   * Generic POST request
   * @param url - The endpoint URL
   * @param data - Request body data
   * @param config - Optional axios config
   * @returns Promise with response data
   */
  static async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response = await api.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error as AxiosError);
    }
  }

  /**
   * Generic PUT request
   * @param url - The endpoint URL
   * @param data - Request body data
   * @param config - Optional axios config
   * @returns Promise with response data
   */
  static async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response = await api.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error as AxiosError);
    }
  }

  /**
   * Generic PATCH request
   * @param url - The endpoint URL
   * @param data - Request body data
   * @param config - Optional axios config
   * @returns Promise with response data
   */
  static async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response = await api.patch<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error as AxiosError);
    }
  }

  /**
   * Generic DELETE request
   * @param url - The endpoint URL
   * @param config - Optional axios config
   * @returns Promise with response data
   */
  static async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await api.delete<T>(url, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error as AxiosError);
    }
  }

  /**
   * Generic request with custom method
   * @param config - Axios request config
   * @returns Promise with response data
   */
  static async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await api.request<T>(config);
      return response.data;
    } catch (error) {
      throw handleApiError(error as AxiosError);
    }
  }
}

// Convenience functions for common use cases
export const apiGet = ApiService.get;
export const apiPost = ApiService.post;
export const apiPut = ApiService.put;
export const apiPatch = ApiService.patch;
export const apiDelete = ApiService.delete;
export const apiRequest = ApiService.request;

// Example usage:
// import { apiGet, apiPost, apiPut, apiDelete } from './apiService';
//
// const users = await apiGet<User[]>('/users');
// const newUser = await apiPost<User>('/users', { name: 'John', email: 'john@example.com' });
// const updatedUser = await apiPut<User>(`/users/${id}`, { name: 'Jane' });
// await apiDelete(`/users/${id}`);
