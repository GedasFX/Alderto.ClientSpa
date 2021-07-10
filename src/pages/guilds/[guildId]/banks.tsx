import BankCard from 'src/components/guild/bank/BankCard';
import { useApi } from 'src/services';

export default function GuildBanks() {
  const { data, error } = useApi<Dto.Guild.Bank[]>('/banks');

  if (error) {
    return <span>Error</span>;
  }

  if (!data) {
    return <span>Loading</span>;
  }

  return (
    <div>
      {data.map(b => (
        <BankCard key={b.id} bank={b} />
      ))}
    </div>
  );
}
