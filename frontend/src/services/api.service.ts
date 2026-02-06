import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_BASE_URL } from '../utils/constants';
import { ApiErrorResponse } from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiErrorResponse>) => {
        if (error.response) {
          const errorData = error.response.data;
          console.error('API Error:', errorData);
          throw errorData;
        } else if (error.request) {
          console.error('Network Error:', error.message);
          throw {
            title: 'Network Error',
            message: 'Unable to connect to server. Please check your connection.',
          };
        } else {
          console.error('Error:', error.message);
          throw {
            title: 'Error',
            message: error.message,
          };
        }
      }
    );
  }

  public getApi(): AxiosInstance {
    return this.api;
  }
}

export const apiService = new ApiService();
export const api = apiService.getApi();