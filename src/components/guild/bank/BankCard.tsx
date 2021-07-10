import { FaPiggyBank, FaQuestionCircle } from 'react-icons/fa';

type BankCardProps = {
  bank: Dto.Guild.Bank;
};

export default function BankCard({ bank }: BankCardProps) {
  return (
    <div className="intro-y box my-4">
      <div className="flex items-center p-5 border-b border-gray-200 dark:border-dark-5 gap-3 leading-none">
        <FaPiggyBank size={24} strokeWidth={1.5} /> {bank.name}
      </div>
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {bank.contents.map(i => (
          <button
            key={i.id}
            title={i.description}
            className="flex flex-col p-3 items-center hover:bg-them"
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
  );
}
