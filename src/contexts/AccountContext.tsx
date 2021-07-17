import { useRouter } from 'next/dist/client/router';
import { User } from 'oidc-client';
import { createContext, PropsWithChildren, useState, useContext, useEffect } from 'react';

const AccountContext = createContext<{
  user: User | null | undefined;
  setUser: (user: User | null) => void;
  guildId: string | null;
}>({
  user: undefined,
  setUser: () => {
    throw 'Context was used outside of scope';
  },
  guildId: null,
});

export default function AccountProvider({ children }: PropsWithChildren<unknown>) {
  const [user, setUser] = useState<User | null | undefined>();
  const [guildId, setGuildId] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const qGuildId = router.query.guildId;
    if (qGuildId) {
      setGuildId(qGuildId as string);
    }
  }, [router.query.guildId]);

  console.log(user);

  return (
    <AccountContext.Provider value={{ user, setUser, guildId }}>{children}</AccountContext.Provider>
  );
}

export const useAccount = () => useContext(AccountContext);
