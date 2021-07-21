import { isEmpty } from 'lodash';
import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { useAccount } from 'src/contexts/AccountContext';
import { useGuild } from 'src/contexts/GuildContext';
import useSWR from 'swr';

// Creates a new object with the difference in properties
export const calcObjDiff = (obj1: Record<string, unknown>, obj2: Record<string, unknown>) => {
  const diff: Record<string, unknown> = {};

  for (const key in { ...obj1, ...obj2 }) {
    if (
      Object.prototype.hasOwnProperty.call(obj1, key) ||
      Object.prototype.hasOwnProperty.call(obj2, key)
    ) {
      const tKey1 = typeof obj1[key];
      const tKey2 = typeof obj2[key];

      if (tKey2 === 'undefined' || (tKey2 !== 'boolean' && !tKey2)) {
        // Set to undefined - do nothing
      } else if (tKey2 !== tKey1) {
        diff[key] = obj2[key];
      } else if (obj2[key] !== obj1[key]) {
        diff[key] = obj2[key];
      }
    }
  }

  return diff;
};

const fetcher = async <T>(
  url: string,
  access_token: string,
  body?: BodyInit | null,
  config?: RequestInit
) => {
  const result = await fetch(url, {
    ...config,
    body,
    headers: {
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
      ...config?.headers,
    },
  });

  if (result.ok) return (await result.json()) as T;

  const err = (await result.json()) as App.ErrorResponse;
  toast.error(err.message, {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

export const useApi = <T extends { id: string | number }>(
  url: string | null,
  search?: { page?: number; limit?: number }
) => {
  const { user } = useAccount();
  const guild = useGuild();

  url = guild?.id ? `/guilds/${guild.id}` + url : null;

  if (!user) {
    url = null;
  }

  if (url) {
    const req = new URL(`${process.env.NEXT_PUBLIC_API}${url}`);
    if (search?.page) req.searchParams.append('page', `${search.page}`);
    if (search?.limit) req.searchParams.append('limit', `${search.limit}`);

    url = req.href;
  }

  const { data, error, mutate } = useSWR(
    url && user?.access_token ? [url, user.access_token] : null,
    (u: string, token: string) => fetcher<T[]>(u, token)
  );

  const request = useCallback(
    async <L>(path: string, body?: BodyInit | null, config?: RequestInit) => {
      if (!user?.access_token || !url) {
        throw 'Unable to perform request: access_token is missing';
      }

      return await fetcher<L>(`${url}${path}`, user.access_token, body, config);
    },
    [url, user?.access_token]
  );

  const create = useCallback(
    async (obj: Omit<T, 'id'>, shouldRevalidate = false) => {
      const res = await request<T>('', JSON.stringify(obj), {
        method: 'POST',
      });

      if (!res) return;

      if (data) {
        await mutate([...data, res], shouldRevalidate);
      }

      return res;
    },
    [data, mutate, request]
  );

  const update = useCallback(
    async (id: string | number, obj: Omit<T, 'id'>, shouldRevalidate = true) => {
      if (!data) throw 'Data not loaded';

      const currObjIdx = data.findIndex(o => o.id === id);
      const currObj = data[currObjIdx];

      const diff = currObj ? calcObjDiff(currObj, obj) : null;
      if (!diff) {
        throw 'Update failed';
      }
      if (isEmpty(diff)) {
        return currObj;
      }

      const res = await request<T>(`/${id}`, JSON.stringify(obj), {
        method: 'PATCH',
      });

      if (!res) return;

      const newData = [...data];
      newData.splice(currObjIdx, 1, res);

      await mutate(newData, shouldRevalidate);

      return res;
    },
    [data, mutate, request]
  );

  const remove = useCallback(
    async (id: string | number, shouldRevalidate = false) => {
      if (!data) throw 'Data not loaded';

      const currObjIdx = data.findIndex(o => o.id === id);
      if (currObjIdx < 0) {
        throw 'Item not found';
      }

      const res = await request<T>(`/${id}`, null, {
        method: 'DELETE',
      });

      if (!res) return;

      const newData = [...data];
      newData.splice(currObjIdx, 1);

      await mutate(newData, shouldRevalidate);

      return res;
    },
    [data, mutate, request]
  );

  return { data, error, mutate, api: { create, update, remove, request } };
};
