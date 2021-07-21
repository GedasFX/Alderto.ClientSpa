import { useCallback, useMemo } from 'react';
import { useGuild } from 'src/contexts/GuildContext';
import { useApi } from 'src/services';
import { modal } from 'src/services/modal';
import { FiX, FiPlus } from 'react-icons/fi';
import CurrencyCard from 'src/components/guild/currency/CurrencyCard';
import CurrencyForm from 'src/components/guild/currency/CurrencyForm';

export default function GuildCurrencies() {
  const {
    data,
    error,
    mutate,
    api: { create, update, remove },
  } = useApi<Dto.Guild.Currency>('/currencies');

  console.log(data);

  const guild = useGuild();
  const accessLevel = useMemo(() => guild?.userLevel ?? 0, [guild?.userLevel]);

  const handleSubmit = useCallback(
    async (prev: Dto.Guild.Currency | null, obj: Dto.Guild.Currency | null) => {
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
    (obj: Dto.Guild.Currency | null) => {
      const ref = modal.open(
        <>
          <div className="flex justify-between p-2 pb-4 mb-4 border-b border-theme-2 dark:border-theme-4 text-lg">
            {obj === null ? 'Add new currency' : `${obj.symbol} ${obj.name}`}
            <button>
              <FiX strokeWidth={2.5} size={24} onClick={() => ref.close()} />
            </button>
          </div>
          <CurrencyForm
            currency={
              obj
                ? ({
                    name: obj.name,
                    symbol: obj.symbol,
                    description: obj.description,
                    timelyAmount: obj.timelyAmount,
                    timelyInterval: obj.timelyInterval ?? 0,
                  } as Dto.Guild.Currency)
                : null
            }
            onSubmit={i => handleSubmit(obj, i).then(() => ref.close())}
          />
        </>
      );
    },
    [handleSubmit]
  );

  if (error) {
    return <span>Error</span>;
  }

  if (!data) {
    return <span>Loading</span>;
  }

  return (
    <div>
      <div className="intro-y sm:flex-row items-center mt-4 mb-4">
        <h2 className="text-lg font-medium mr-auto">Currencies</h2>
      </div>
      {accessLevel >= 3 && (
        <div className="intro-y box my-4">
          <button
            className="flex justify-between p-4 gap-3 leading-none w-full"
            onClick={() => openForm(null)}
          >
            <div className="flex items-center gap-2">
              <FiPlus size={24} strokeWidth={1.5} />
              Create new currency
            </div>
          </button>
        </div>
      )}

      {data.map(b => (
        <CurrencyCard
          key={b.id}
          currency={b}
          onEdit={i => handleSubmit(b, i as Dto.Guild.Currency)}
          onRequestEdit={() => openForm(b)}
          editable={accessLevel >= 3}
        />
      ))}
    </div>
  );
}
