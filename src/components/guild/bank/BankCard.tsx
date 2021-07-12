import { FaPiggyBank, FaQuestionCircle } from 'react-icons/fa';
import BankItemForm from './BankItemForm';
import Modal from 'react-modal';
import { useState } from 'react';
import { useApi } from 'src/services';

Modal.setAppElement('#__next');

type BankCardProps = {
  bank: Dto.Guild.Bank;
};

export default function BankCard({ bank }: BankCardProps) {
  const [activeItem, setActiveItem] = useState<Dto.Guild.BankItem>();

  const { data } = useApi('/banks');

  console.log(data);

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
              onClick={() => setActiveItem(i)}
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
        </div>
      </div>
      {activeItem && (
        <Modal
          isOpen={true}
          onRequestClose={() => setActiveItem(undefined)}
          style={{
            overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
            content: {
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              transform: 'translate(-50%, -50%)',
              padding: 0,
            },
          }}
        >
          <div className="bg-dark-6 p-5">
            <BankItemForm bankId={bank.id} item={activeItem} />
          </div>
        </Modal>
      )}
    </>
  );
}
