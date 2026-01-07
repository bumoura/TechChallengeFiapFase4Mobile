import axios from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import storage from '@/lib/storage';

const baseURL =
  Platform.OS === 'web'
    ? 'http://127.0.0.1:3000'
    : ((Constants.expoConfig?.extra as any)?.apiUrl ?? 'http://10.0.2.2:3000');

console.log('API baseURL:', baseURL);

const api = axios.create({ baseURL });

api.interceptors.request.use(async (config) => {
  const token = await storage.getItem('token');
  console.log('API token:', token);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
