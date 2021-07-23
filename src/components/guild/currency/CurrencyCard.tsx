import { FiChevronsDown, FiClock, FiEdit, FiLock, FiUnlock } from 'react-icons/fi';
import clsx from 'clsx';
import CurrencyTransactions from './CurrencyTransactions';
import { useState } from 'react';
import CurrencyLeaderboards from './CurrencyLeaderboards';

type CurrencyCardProps = {
  currency: Dto.Guild.Currency;
  editable?: boolean;

  onEdit?: (currency: Partial<Dto.Guild.Currency>) => void;
  onRequestEdit?: (currency: Dto.Guild.Currency) => void;
};

export default function CurrencyCard({
  currency,
  editable,
  onRequestEdit,
  onEdit,
}: CurrencyCardProps) {
  const [openTab, setOpenTab] = useState<number | null>(null);

  return (
    <>
      <div className="intro-y box my-4">
        <div className="flex justify-between p-4 border-gray-200 dark:border-dark-5 gap-3 leading-none">
          <div className="flex items-center gap-2">
            <button
              title={
                currency.isLocked
                  ? 'Locked - only mods can give or take currency'
                  : 'Unlocked - anyone can do anything with the currency'
              }
              onClick={() =>
                onEdit &&
                onEdit({
                  isLocked: !currency.isLocked,
                })
              }
            >
              {currency.isLocked ? (
                <FiLock size={24} strokeWidth={1.5} className="text-theme-24" />
              ) : (
                <FiUnlock size={24} strokeWidth={1.5} className="text-theme-10" />
              )}
            </button>
            <button
              title={
                !currency.timelyEnabled
                  ? 'Disabled - users cannot claim timely rewards'
                  : currency.timelyAmount === 0 || currency.timelyInterval === 0
                  ? 'Disabled - the timely setup is invalid'
                  : 'Enabled - users can claim timely rewards'
              }
              onClick={() =>
                onEdit &&
                onEdit({
                  timelyEnabled: !currency.timelyEnabled,
                })
              }
            >
              <FiClock
                size={24}
                strokeWidth={1.5}
                className={clsx(
                  !currency.timelyEnabled
                    ? 'text-theme-24'
                    : currency.timelyAmount === 0 || currency.timelyInterval === 0
                    ? 'text-theme-23'
                    : 'text-theme-10'
                )}
              />
            </button>
            {currency.symbol} {currency.name}
          </div>
          {editable && (
            <div className="flex items-center gap-2">
              {onRequestEdit && (
                <button onClick={() => onRequestEdit(currency)}>
                  <FiEdit size={20} strokeWidth={1.5} />
                </button>
              )}
            </div>
          )}
        </div>
        <div className="p-4 flex-1">
          <div className="w-full">
            <button
              className="flex items-center gap-2 mb-2 w-full"
              onClick={() => setOpenTab(t => (t !== 0 ? 0 : null))}
            >
              <FiChevronsDown
                className={clsx('transform', openTab === 0 && 'rotate-180')}
                size={24}
                strokeWidth={1.5}
              />
              Transactions
            </button>
            {openTab === 0 && (
              <div className="border-t dark:border-dark-5 pt-4">
                <CurrencyTransactions currencyId={currency.id} />
              </div>
            )}
          </div>
          <div>
            <button
              className="flex items-center gap-2 mb-2 w-full"
              onClick={() => setOpenTab(t => (t !== 1 ? 1 : null))}
            >
              <FiChevronsDown
                className={clsx('transform', openTab === 1 && 'rotate-180')}
                size={24}
                strokeWidth={1.5}
              />
              Leaderboards
            </button>
            {openTab === 1 && (
              <div className="border-t dark:border-dark-5 pt-4">
                <CurrencyLeaderboards currencyId={currency.id} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
