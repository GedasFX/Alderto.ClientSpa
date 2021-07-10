import axios, { AxiosRequestConfig } from 'axios';
import { useAccount } from 'src/contexts/AccountContext';
import useSWR from 'swr';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API,
  withCredentials: true,
});

const fetcher = <T>(url: string, config?: AxiosRequestConfig) => {
  return apiClient.get<T>(url, config).then(t => t.data);
};

export const useApi = <T>(url: string | null, withCredentials = true, useGuild = true) => {
  const { guildId, user } = useAccount();

  if (useGuild) {
    url = guildId ? `/guilds/${guildId}` + url : null;
  }

  if (withCredentials) {
    if (!user) {
      url = null;
    }
  }

  return useSWR(url, (u: string) =>
    fetcher<T>(u, {
      headers: {
        Authorization: user?.access_token ? `Bearer ${user?.access_token}` : undefined,
      },
    })
  );
};
