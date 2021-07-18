import { FaPiggyBank, FaPlusCircle, FaQuestionCircle } from 'react-icons/fa';
import { FiEdit, FiX } from 'react-icons/fi';
import BankItemForm from './BankItemForm';
import { useCallback } from 'react';
import { calcObjDiff, useApi } from 'src/services';
import { isEmpty } from 'lodash';
import { modal } from 'src/services/modal';

type BankCardProps = {
  bank: Dto.Guild.Bank;
  editable?: boolean;
  itemsEditable?: boolean;

  onRequestEdit?: (bank: Dto.Guild.Bank) => void;
};

export default function BankCard({ bank, editable, itemsEditable, onRequestEdit }: BankCardProps) {
  const {
    data,
    mutate,
    api: { request },
  } = useApi<Dto.Guild.Bank>('/banks');

  const handleItemFormSubmit = useCallback(
    async (prev: Dto.Guild.BankItem | null, item: Dto.Guild.BankItem | null) => {
      if (!data) return;

      if (item?.imageUrl === '') {
        delete item.imageUrl;
      }

      const newData = [...data];

      if (prev === null && item !== null) {
        // On Create

        const result = await request<Dto.Guild.BankItem>(
          `/${bank.id}/items`,
          JSON.stringify(item),
          { method: 'POST' }
        );

        if (!result) return;

        const bankIdx = data.findIndex(o => o.id === bank.id);

        newData.splice(bankIdx, 1, { ...bank, contents: [...bank.contents, result] });
      }

      if (prev !== null && item !== null) {
        // On Update

        const diff = calcObjDiff(prev, item);
        if (isEmpty(diff)) return;

        const result = await request<Dto.Guild.BankItem>(
          `/${bank.id}/items/${prev.id}`,
          JSON.stringify(diff),
          { method: 'PATCH' }
        );

        if (!result) return;

        const bankIdx = data.findIndex(o => o.id === bank.id);
        const bankItemIdx = bank.contents.findIndex(c => c.id === item.id);

        const newBankContents = [...bank.contents];
        newBankContents.splice(bankItemIdx, 1, result);

        newData.splice(bankIdx, 1, { ...bank, contents: newBankContents });
      }

      if (prev !== null && item === null) {
        // On Delete

        const result = await request<Dto.Guild.BankItem>(`/${bank.id}/items/${prev.id}`, null, {
          method: 'DELETE',
        });

        if (!result) return;

        const bankIdx = data.findIndex(o => o.id === bank.id);
        const bankItemIdx = bank.contents.findIndex(c => c.id === prev.id);

        const newBankContents = [...bank.contents];
        newBankContents.splice(bankItemIdx, 1, result);

        newData.splice(bankIdx, 1, { ...bank, contents: newBankContents });
      }

      await mutate(newData);
    },
    [bank, data, mutate, request]
  );

  const openItemForm = useCallback(
    (item: Dto.Guild.BankItem | null) => {
      const ref = modal.open(
        <>
          <div className="flex justify-between p-2 pb-4 mb-4 border-b border-theme-2 dark:border-theme-4 text-lg">
            {item === null ? 'Add new bank item' : item.name}
            <button>
              <FiX strokeWidth={2.5} size={24} onClick={() => ref.close()} />
            </button>
          </div>
          <BankItemForm
            disabled={!itemsEditable}
            item={item}
            onSubmit={i => handleItemFormSubmit(item, i).then(() => ref.close())}
          />
        </>
      );
    },
    [handleItemFormSubmit, itemsEditable]
  );

  return (
    <>
      <div className="intro-y box my-4">
        <div className="flex justify-between p-5 border-b border-gray-200 dark:border-dark-5 gap-3 leading-none">
          <div className="flex items-center gap-2">
            <FaPiggyBank size={24} strokeWidth={1.5} />
            {bank.name}
          </div>
          {editable && (
            <div className="flex items-center gap-2">
              {onRequestEdit && (
                <button onClick={() => onRequestEdit(bank)}>
                  <FiEdit size={20} strokeWidth={1.5} />
                </button>
              )}
            </div>
          )}
        </div>
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {bank.contents?.map(i => (
            <button
              key={i.id}
              title={i.description}
              className="flex flex-col p-3 items-center"
              onClick={() => openItemForm(i)}
            >
              {i.imageUrl ? (
                // Image is provided via link, cannot optimize that
                // eslint-disable-next-line @next/next/no-img-element
                <img alt="" src={i.imageUrl} className="h-8 w-auto" />
              ) : (
                <FaQuestionCircle size={32} strokeWidth={1.5} />
              )}

              <div className="mt-1">{i.name}</div>
              <div className="text-xs">{i.quantity * i.value}</div>
            </button>
          ))}
          {itemsEditable && (
            <button className="flex flex-col p-3 items-center" onClick={() => openItemForm(null)}>
              <FaPlusCircle size={32} strokeWidth={1.5} />
              <div className="mt-1">Add new item</div>
            </button>
          )}
        </div>
      </div>
    </>
  );
}
