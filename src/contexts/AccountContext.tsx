import { User } from 'oidc-client';
import { createContext, PropsWithChildren, useState, useContext } from 'react';

const AccountContext = createContext<{
  user: User | null | undefined;
  setUser: (user: User | null) => void;
}>({
  user: undefined,
  setUser: () => {
    throw 'Context was used outside of scope';
  },
});

export default function AccountProvider({ children }: PropsWithChildren<unknown>) {
  const [user, setUser] = useState<User | null | undefined>();

  return <AccountContext.Provider value={{ user, setUser }}>{children}</AccountContext.Provider>;
}

export const useAccount = () => useContext(AccountContext);
