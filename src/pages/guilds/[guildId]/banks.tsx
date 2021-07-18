import { useCallback, useMemo } from 'react';
import { FaPlus } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import BankCard from 'src/components/guild/bank/BankCard';
import BankForm from 'src/components/guild/bank/BankForm';
import { useGuild } from 'src/contexts/GuildContext';
import { useApi } from 'src/services';
import { modal } from 'src/services/modal';

export default function GuildBanks() {
  const {
    data,
    error,
    mutate,
    api: { create, update, remove },
  } = useApi<Dto.Guild.Bank>('/banks');

  const guild = useGuild();
  const accessLevel = useMemo(() => guild?.userLevel ?? 0, [guild?.userLevel]);

  const handleBankFormSubmit = useCallback(
    async (prev: Dto.Guild.Bank | null, bank: Dto.Guild.Bank | null) => {
      if (!data) return;

      const newData = [...data];

      if (prev === null && bank !== null) {
        return create(bank);
      }

      if (prev !== null && bank !== null) {
        return update(prev.id, bank);
      }

      if (prev !== null && bank === null) {
        return remove(prev.id);
      }

      await mutate(newData);
    },
    [create, data, mutate, remove, update]
  );

  const openBankForm = useCallback(
    (bank: Dto.Guild.Bank | null) => {
      const ref = modal.open(
        <>
          <div className="flex justify-between p-2 pb-4 mb-4 border-b border-theme-2 dark:border-theme-4 text-lg">
            {bank === null ? 'Add new bank' : bank.name}
            <button>
              <FiX strokeWidth={2.5} size={24} onClick={() => ref.close()} />
            </button>
          </div>
          <BankForm
            bank={bank ? ({ name: bank.name } as Dto.Guild.Bank) : null}
            onSubmit={i => handleBankFormSubmit(bank, i).then(() => ref.close())}
          />
        </>
      );
    },
    [handleBankFormSubmit]
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
        <h2 className="text-lg font-medium mr-auto">Banks</h2>
      </div>
      {accessLevel >= 3 && (
        <div className="intro-y box my-4">
          <button
            className="flex justify-between p-5 gap-3 leading-none w-full"
            onClick={() => openBankForm(null)}
          >
            <div className="flex items-center gap-2">
              <FaPlus size={24} strokeWidth={1.5} />
              Create new bank
            </div>
          </button>
        </div>
      )}

      {data.map(b => (
        <BankCard
          key={b.id}
          bank={b}
          onRequestEdit={() => openBankForm(b)}
          editable={accessLevel >= 3}
          itemsEditable={accessLevel >= 2}
        />
      ))}
    </div>
  );
}
