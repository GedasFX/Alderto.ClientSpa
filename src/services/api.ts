import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API,
});
export const authClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AUTH,
});

export const renewToken = async () => {
  const response = await authClient.post('/token');
  const token = response.data as string;

  apiClient.defaults.headers['Authorization'] = `Bearer ${token}`;
};
