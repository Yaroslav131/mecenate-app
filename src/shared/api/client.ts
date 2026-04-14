import axios from 'axios';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl ?? process.env.EXPO_PUBLIC_API_URL ?? '';
const AUTH_TOKEN =
  Constants.expoConfig?.extra?.authToken ?? process.env.EXPO_PUBLIC_AUTH_TOKEN ?? '';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${AUTH_TOKEN}`,
  },
  timeout: 10_000,
});
