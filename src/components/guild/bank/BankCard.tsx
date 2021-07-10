type BankCardProps = {
  bank: Dto.Guild.Bank;
};

export default function BankCard({ bank }: BankCardProps) {
  return <div>{JSON.stringify(bank)}</div>;
}
