import { isEmpty } from 'lodash';
import { useCallback } from 'react';
import { useAccount } from 'src/contexts/AccountContext';
import useSWR from 'swr';

// Creates a new object with the difference in properties
export const calcObjDiff = (obj1: Record<string, unknown>, obj2: Record<string, unknown>) => {
  const diff = Object.keys(obj1).reduce((result, key) => {
    // eslint-disable-next-line no-prototype-builtins
    if (!obj2.hasOwnProperty(key)) {
      result.push(key);
    }
    return result;
  }, Object.keys(obj2));

  return Object.fromEntries(
    diff.map(key => {
      return [key, obj2[key]];
    })
  );
};

const fetcher = async <T>(
  url: string,
  access_token: string,
  body?: BodyInit | null,
  config?: RequestInit
) => {
  const result = await fetch(`${process.env.NEXT_PUBLIC_API}${url}`, {
    ...config,
    body,
    headers: {
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json;charset=UTF-8',
      ...config?.headers,
    },
  });
  return (await result.json()) as T;
};

export const useApi = <T extends { id: string | number }>(url: string | null) => {
  const { guildId, user } = useAccount();

  url = guildId ? `/guilds/${guildId}` + url : null;

  if (!user) {
    url = null;
  }

  const { data, error, mutate } = useSWR([url, user?.access_token], (u: string, token: string) =>
    fetcher<T[]>(u, token)
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

      if (data) {
        await mutate([...data, res], shouldRevalidate);
      }

      return res;
    },
    [data, mutate, request]
  );

  const update = useCallback(
    async (id: string | number, obj: Omit<T, 'id'>, shouldRevalidate = false) => {
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

      const newData = [...data];
      newData.splice(currObjIdx, 1, res);

      await mutate(newData, shouldRevalidate);

      return res;
    },
    [data, mutate, request]
  );

  return { data, error, mutate, api: { create, update, remove, request } };
};
