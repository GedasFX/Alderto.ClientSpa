import { FiChevronsDown, FiClock, FiEdit, FiLock, FiUnlock } from 'react-icons/fi';
import clsx from 'clsx';
import CurrencyTransactions from './CurrencyTransactions';
import { useState } from 'react';

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
  const [displayTransactions, setDisplayTransactions] = useState(false);

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
        <div className="p-4">
          <button
            className="flex items-center gap-2 mb-2 w-full"
            onClick={() => setDisplayTransactions(t => !t)}
          >
            <FiChevronsDown
              className={clsx('transform', displayTransactions && 'rotate-180')}
              size={24}
              strokeWidth={1.5}
            />
            Transactions
          </button>
          {displayTransactions && (
            <div className="border-t dark:border-dark-5 pt-4">
              <CurrencyTransactions currencyId={currency.id} />
            </div>
          )}
        </div>

        {/* <div className="p-4 flex items-center gap-2">
          <FiChevronsDown size={24} strokeWidth={1.5} /> Transactions
        </div> */}
      </div>
    </>
  );
}
