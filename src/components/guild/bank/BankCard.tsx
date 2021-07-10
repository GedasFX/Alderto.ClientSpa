type BankCardProps = {
  bank: Dto.Guild.Bank;
};

export default function BankCard({ bank }: BankCardProps) {
  return <div className="intro-y box">{JSON.stringify(bank)}</div>;
}
