import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API请求错误:', error);
    return Promise.reject(error);
  }
);

export const apiService = {
  // 获取总览数据
  getOverview: () => api.get('/overview'),
  
  // 获取24小时趋势
  getTrend24h: () => api.get('/trend/24h'),
  
  // 获取当天用电
  getTrendToday: () => api.get('/trend/today'),
  
  // 获取30天趋势
  getTrend30d: () => api.get('/trend/30d'),
  
  // 获取月度趋势
  getTrendMonthly: () => api.get('/trend/monthly'),
};

export default api;
