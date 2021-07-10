import clsx from 'clsx';
import { useEffect, useMemo, useState } from 'react';
import { usePopper } from 'react-popper';
import Image from 'next/image';
import discordLoader from 'src/util/loaders/discordLoader';
import { useAccount } from 'src/contexts/AccountContext';
import { FiLogOut } from 'react-icons/fi';
import ServerSelect from './ServerSelect';

import { UserManager, User } from 'oidc-client';

class AccountService {
  private readonly _host = `${window.location.protocol}//${window.location.host}`;
  private readonly _userManager = new UserManager({
    authority: process.env.NEXT_PUBLIC_AUTH,
    client_id: 'js',
    redirect_uri: `${this._host}/oidc/signin-callback.html`,
    post_logout_redirect_uri: `${this._host}/oidc/signout-callback.html`,
    response_type: 'id_token token',
    scope: 'openid api',

    silent_redirect_uri: `${this._host}/oidc/refresh-callback.html`,
    automaticSilentRenew: true,

    popupWindowFeatures: 'location=no,toolbar=no,width=500,height=800,left=100,top=100',
  });

  public setUser: (user: User | null) => void = () => {
    console.error('DOM Mapper not set up.');
  };

  public user: User | null;

  constructor() {
    this.user = null;

    this.renewToken().catch(() => {
      /* User is not signed in. Ignore. */
    });
  }

  public renewToken = () => {
    return this._userManager
      .signinSilent()
      .then(t => (this.user = t))
      .finally(() => {
        this.setUser(this.user);
      });
  };

  public login = () => {
    return this._userManager
      .signinPopup()
      .then(t => (this.user = t))
      .finally(() => {
        this.setUser(this.user);
      });
  };

  public logout = () => {
    return this._userManager
      .signoutPopup()
      .then(() => {
        this.user = null;
      })
      .finally(() => {
        this.setUser(this.user);
      });
  };
}

const accountService = new AccountService();

export default function AccountMenu() {
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>();
  const [popperElement, setPopperElement] = useState<HTMLElement | null>();
  const { styles } = usePopper(referenceElement, popperElement, {
    placement: 'bottom-end',
  });

  const [dropdownVisible, setDropdownVisible] = useState(false);

  const { user, setUser } = useAccount();
  useEffect(() => {
    accountService.setUser = setUser;
  }, [setUser]);

  const gjMessage = useMemo(() => {
    const msgList = ['Being wonderful', 'Pondering life', 'Aiming high', 'Looting mobs'];
    return msgList[Math.floor(Math.random() * msgList.length)];
  }, []);

  if (user === null) {
    return (
      <button
        className="bg-theme-discord dark:bg-theme-discord-dark py-2 px-4 rounded"
        onClick={() => {
          accountService.login();
        }}
      >
        Login with Discord
      </button>
    );
  }

  if (user === undefined) {
    return <span>Loading user info</span>;
  }

  return (
    <div className="flex gap-4 items-center ml-auto">
      <ServerSelect />
      <div className="intro-x dropdown w-8 h-8">
        <button
          ref={setReferenceElement}
          className="dropdown-toggle w-8 h-8 rounded-full overflow-hidden shadow-lg image-fit zoom-in scale-110"
          onClick={() => setDropdownVisible(v => !v)}
        >
          <Image
            alt="User profile image"
            loader={discordLoader}
            src={`/avatars/${user.profile.user.id}/${user.profile.user.avatar}.webp`}
            width={32}
            height={32}
          />
        </button>
        <div
          ref={setPopperElement}
          style={styles.popper}
          className={clsx('dropdown-menu w-56', dropdownVisible && 'show')}
        >
          <div className="dropdown-menu__content box bg-theme-11 dark:bg-dark-6 text-white">
            <div className="p-4 border-b border-theme-12 dark:border-dark-3">
              <div className="font-medium">
                {user.profile.user.username}
                <span className="text-gray-600">#{user.profile.user.discriminator}</span>
              </div>
              <div className="text-xs text-theme-13 mt-0.5 dark:text-gray-600">{gjMessage}</div>
            </div>
            <div className="p-2 pt-0 border-t border-theme-12">
              <button
                onClick={() => accountService.logout()}
                className="flex items-center p-2 transition duration-300 ease-in-out hover:bg-theme-1 dark:hover:bg-dark-3 rounded-md w-full"
              >
                <FiLogOut strokeWidth={1.5} className="mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
