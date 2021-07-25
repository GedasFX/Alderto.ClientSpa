import { useCallback, useMemo } from 'react';
import { useGuild } from 'src/contexts/GuildContext';
import { useApi } from 'src/services';
import { modal } from 'src/services/modal';
import { FiX, FiPlus } from 'react-icons/fi';
import CurrencyCard from 'src/components/guild/currency/CurrencyCard';
import CurrencyForm from 'src/components/guild/currency/CurrencyForm';
import { groupBy } from 'lodash';
import MessageCard from 'src/components/guild/messages/MessageCard';
import MessageForm from 'src/components/guild/messages/MessageForm';

export default function GuildCurrencies() {
  const {
    data,
    error,
    mutate,
    api: { create, update, remove },
  } = useApi<Dto.Guild.Message>('/messages');

  console.log(data);

  const guild = useGuild();
  const accessLevel = useMemo(() => guild?.userLevel ?? 0, [guild?.userLevel]);

  const handleSubmit = useCallback(
    async (prev: Dto.Guild.Message | null, obj: Dto.Guild.Message | null) => {
      if (!data) return;

      const newData = [...data];

      if (prev === null && obj !== null) {
        return create(obj);
      }

      if (prev !== null && obj !== null) {
        return update(prev.id, obj);
      }

      if (prev !== null && obj === null) {
        return remove(prev.id);
      }

      await mutate(newData);
    },
    [create, data, mutate, remove, update]
  );

  const openForm = useCallback(
    (obj: Dto.Guild.Message | null) => {
      const ref = modal.open(
        <>
          <div className="flex justify-between p-2 pb-4 mb-4 border-b border-theme-2 dark:border-theme-4 text-lg">
            {obj === null ? 'Add new message' : 'Edit message'}
            <button>
              <FiX strokeWidth={2.5} size={24} onClick={() => ref.close()} />
            </button>
          </div>
          <MessageForm message={obj} onSubmit={i => handleSubmit(obj, i).then(() => ref.close())} />
        </>
      );
    },
    [handleSubmit]
  );

  const groupData = useMemo(() => groupBy(data ?? [], 'channelId'), [data]);
  console.log(groupData);

  const { data: channels } = useApi<Discord.Channel>('/channels');

  if (error) {
    return <span>Error</span>;
  }

  if (!data || !guild) {
    return <span>Loading</span>;
  }

  return (
    <div>
      <div className="intro-y sm:flex-row items-center mt-4 mb-4">
        <h2 className="text-lg font-medium mr-auto">Messages</h2>
      </div>
      {accessLevel >= 3 && (
        <div className="intro-y box my-4">
          <button
            className="flex justify-between p-4 gap-3 leading-none w-full"
            onClick={() => openForm(null)}
          >
            <div className="flex items-center gap-2">
              <FiPlus size={24} strokeWidth={1.5} />
              Create new message
            </div>
          </button>
        </div>
      )}

      {Object.keys(groupData).map(b => (
        <MessageCard
          key={b}
          channel={channels?.find(f => f.id === b) ?? { id: b, name: b }}
          guildId={guild.id}
          data={groupData[b]}
          onRequestEdit={i => openForm(i)}
          editable={accessLevel >= 3}
        />
      ))}
    </div>
  );
}
