import { FaPiggyBank } from 'react-icons/fa';
import {
  FiHome,
  FiNavigation,
  FiFolder,
  FiUsers,
  FiSettings,
  FiHash,
  FiDollarSign,
} from 'react-icons/fi';

export type RouteCommon = {
  name: string;
  icon: JSX.Element;
};

export type RouteLink = RouteCommon & {
  type: 'link';
  path: string;
};

export type RouteGroup = RouteCommon & {
  type: 'group';
  children: RouteLink[];
};

export type Route = RouteLink | RouteGroup;

export default function getRoutes({ guildId }: { guildId?: string }): Route[] {
  const routes: Route[] = [];

  routes.push(
    {
      type: 'link',
      path: '/',
      name: 'News',
      icon: <FiHome size={24} strokeWidth={1.5} />,
    },
    {
      type: 'link',
      path: '/docs',
      name: 'Docs',
      icon: <FiFolder size={24} strokeWidth={1.5} />,
    }
  );

  if (guildId) {
    routes.push({
      type: 'group',
      name: 'Guild',
      icon: <FiUsers size={24} strokeWidth={1.5} />,
      children: [
        {
          type: 'link',
          path: `/guilds/${guildId}/`,
          name: 'Overview',
          icon: <FiSettings size={24} strokeWidth={1.5} />,
        },
        {
          type: 'link',
          path: `/guilds/${guildId}/currencies`,
          name: 'Currencies',
          icon: <FiDollarSign size={24} strokeWidth={1.5} />,
        },
        {
          type: 'link',
          path: `/guilds/${guildId}/banks`,
          name: 'Banks',
          icon: <FaPiggyBank size={24} strokeWidth={1.5} />,
        },
        {
          type: 'link',
          path: `/guilds/${guildId}/messages`,
          name: 'Messages',
          icon: <FiHash size={24} strokeWidth={1.5} />,
        },
      ],
    });
  }

  routes.push({
    type: 'link',
    path: 'https://discordapp.com/api/oauth2/authorize?client_id=595936593592844306&permissions=8&scope=bot',
    name: 'Invite to Server',
    icon: <FiNavigation size={24} strokeWidth={1.5} />,
  });

  return routes;
}
