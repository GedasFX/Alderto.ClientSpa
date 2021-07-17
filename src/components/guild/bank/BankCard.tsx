import { FaPiggyBank, FaPlusCircle, FaQuestionCircle } from 'react-icons/fa';
import BankItemForm from './BankItemForm';
import { useCallback } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { calcObjDiff, useApi } from 'src/services';
import { isEmpty } from 'lodash';

type BankCardProps = {
  bank: Dto.Guild.Bank;
};

const ReactSwal = withReactContent(Swal);

export default function BankCard({ bank }: BankCardProps) {
  const {
    data,
    mutate,
    api: { request },
  } = useApi<Dto.Guild.Bank>('/banks');

  const handleSubmit = useCallback(
    async (prev: Dto.Guild.BankItem | null, item: Dto.Guild.BankItem | null) => {
      if (!data) return;

      const newData = [...data];

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

      await mutate(newData);
      ReactSwal.close();
    },
    [bank, data, mutate, request]
  );

  const openForm = useCallback(
    (item: Dto.Guild.BankItem | null) =>
      ReactSwal.fire({
        html: (
          <>
            <div className="p-2 pb-4 mb-4 border-b border-theme-2 dark:border-theme-4 text-lg">
              {item === null ? 'Add new bank item' : item.name}
            </div>
            <BankItemForm item={item} onSubmit={i => handleSubmit(item, i)} />
          </>
        ),
      }),
    [handleSubmit]
  );

  return (
    <>
      <div className="intro-y box my-4">
        <div className="flex items-center p-5 border-b border-gray-200 dark:border-dark-5 gap-3 leading-none">
          <FaPiggyBank size={24} strokeWidth={1.5} /> {bank.name}
        </div>
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {bank.contents.map(i => (
            <button
              key={i.id}
              title={i.description}
              className="flex flex-col p-3 items-center"
              onClick={() => openForm(i)}
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
          <button className="flex flex-col p-3 items-center" onClick={() => openForm(null)}>
            <FaPlusCircle size={32} strokeWidth={1.5} />
            <div className="mt-1">Add new item</div>
          </button>
        </div>
      </div>
    </>
  );
}
