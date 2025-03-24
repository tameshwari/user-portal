import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('auth-token');
    if (token && config.headers) {
      debugger
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Generate a JWT token
    const token = 'mock-auth-token';

    localStorage.setItem('auth-token', token);
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized token', error);
      return error;
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
