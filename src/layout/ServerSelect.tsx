import { useAccount } from 'src/contexts/AccountContext';
import { FiChevronDown } from 'react-icons/fi';
import { useState } from 'react';
import { usePopper } from 'react-popper';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import discordLoader from 'src/util/loaders/discordLoader';

export default function ServerSelect() {
  const { user, guildId } = useAccount();

  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>();
  const [popperElement, setPopperElement] = useState<HTMLElement | null>();
  const { styles } = usePopper(referenceElement, popperElement, {
    placement: 'bottom-end',
  });

  const [dropdownVisible, setDropdownVisible] = useState(false);

  return (
    <div className="intro-x dropdown">
      <button
        className="flex border px-4 py-2 items-center gap-1 rounded hover:bg-theme-20 dark:hover:bg-dark-4 transition-colors duration-100"
        ref={setReferenceElement}
        onClick={() => setDropdownVisible(v => !v)}
      >
        {guildId
          ? user?.profile.user.guilds.find((g: App.UserProfileGuild) => g.id === guildId).name
          : 'Select a server'}
        <FiChevronDown />
      </button>
      <div
        ref={setPopperElement}
        style={styles.popper}
        className={clsx('dropdown-menu w-56', dropdownVisible && 'show')}
      >
        <div className="dropdown-menu__content box bg-theme-11 dark:bg-dark-6 text-white">
          {user?.profile.user.guilds.map((g: App.UserProfileGuild) => (
            <Link key={g.id} href={`/guilds/${g.id}/banks`}>
              <a className="flex h-8 items-center m-2 transition duration-300 ease-in-out hover:bg-theme-1 dark:hover:bg-dark-3 rounded-md w-full">
                {g.icon ? (
                  <div className="mr-2">
                    <Image
                      className="rounded-full"
                      loader={discordLoader}
                      src={`/icons/${g.id}/${g.icon}.webp`}
                      alt="Server icon"
                      height={24}
                      width={24}
                    />
                  </div>
                ) : (
                  <div className="w-10"></div>
                )}
                {g.name}
              </a>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
