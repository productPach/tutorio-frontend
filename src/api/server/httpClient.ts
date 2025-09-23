import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { getAccessToken, setAccessToken, removeAccessToken } from './auth';
import { fetchRefreshToken, fetchLogout } from './userApi';
import { baseUrl } from './configApi';

const httpClient: AxiosInstance = axios.create({
  baseURL: baseUrl, // <-- здесь базовый URL
});

// Типизация для очереди запросов
interface QueueItem {
  resolve: (token: string | null) => void;
  reject: (error: any) => void;
}

let isRefreshing: boolean = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: any, token: string | null = null): void => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Интерцептор запросов
httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  }
);

// Интерцептор ответов
httpClient.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<string | null>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token: string | null) => {
          if (token && originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return httpClient(originalRequest);
        }).catch((err: any) => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await fetchRefreshToken();
        const newToken: string = response;
        setAccessToken(newToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        processQueue(null, newToken);
        return httpClient(originalRequest);
      } catch (refreshError: any) {
        processQueue(refreshError, null);

        const token = getAccessToken();
        if (token) {
          try {
            await fetchLogout(token, false);
          } catch (e) {
            console.error('Logout error:', e);
          }
        }
        removeAccessToken();
        
        // Редирект на страницу авторизации
        if (typeof window !== 'undefined') {
          window.location.href = '/tokena_net';
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default httpClient;