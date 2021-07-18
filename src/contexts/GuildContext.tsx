import { useRouter } from 'next/dist/client/router';
import { createContext, PropsWithChildren, useState, useContext, useEffect } from 'react';
import { useAccount } from './AccountContext';

const GuildContext = createContext<{
  id: string;
  userLevel: App.AccessLevel;
} | null>(null);

export default function AccountProvider({ children }: PropsWithChildren<unknown>) {
  const router = useRouter();

  const { user } = useAccount();

  const [guildId, setGuildId] = useState<string | null>(null);
  const [accessLevel, setAccessLevel] = useState<App.AccessLevel>(0);

  useEffect(() => {
    if (user?.access_token && guildId) {
      fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${guildId}/@me`, {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
          'Content-Type': 'application/json',
        },
      })
        .then(t => t.json())
        .then((t: { accessLevel: App.AccessLevel }) => setAccessLevel(t.accessLevel));
    }
  }, [guildId, user?.access_token]);

  useEffect(() => {
    const qGuildId = router.query.guildId;
    if (qGuildId) {
      setGuildId(qGuildId as string);
    }
  }, [router.query.guildId]);

  return (
    <GuildContext.Provider
      value={
        guildId
          ? {
              id: guildId,
              userLevel: accessLevel,
            }
          : null
      }
    >
      {children}
    </GuildContext.Provider>
  );
}

export const useGuild = () => useContext(GuildContext);
