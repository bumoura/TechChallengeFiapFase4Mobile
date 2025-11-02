// src/lib/storage.ts
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

type MaybePromise<T> = T | Promise<T>;

const storage = {
  getItem: (key: string): MaybePromise<string | null> => {
    if (Platform.OS === 'web') {
      try { return window.localStorage.getItem(key); } catch { return null; }
    }
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string): MaybePromise<void> => {
    if (Platform.OS === 'web') {
      try { window.localStorage.setItem(key, value); } catch {}
      return;
    }
    return SecureStore.setItemAsync(key, value);
  },
  deleteItem: (key: string): MaybePromise<void> => {
    if (Platform.OS === 'web') {
      try { window.localStorage.removeItem(key); } catch {}
      return;
    }
    return SecureStore.deleteItemAsync(key);
  }
};

export default storage;