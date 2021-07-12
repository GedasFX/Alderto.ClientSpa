import BankCard from 'src/components/guild/bank/BankCard';
import { useApi } from 'src/services';

export default function GuildBanks() {
  const { data, error, mutate } = useApi<Dto.Guild.Bank>('/banks');

  if (error) {
    return <span>Error</span>;
  }

  if (!data) {
    return <span>Loading</span>;
  }

  return (
    <div>
      <div className="intro-y flex flex-col sm:flex-row items-center mt-4 mb-4">
        <h2 className="text-lg font-medium mr-auto">Banks</h2>
      </div>
      {data.map(b => (
        <BankCard key={b.id} bank={b} />
      ))}
    </div>
  );
}
