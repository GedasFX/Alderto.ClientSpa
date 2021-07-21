import { useMemo } from 'react';
import Table from 'src/components/Table';
import { Column, CellProps } from 'react-table';

type CurrencyLeaderboardsProps = {
  currencyId: string | number;
};

export default function CurrencyLeaderboards({ currencyId }: CurrencyLeaderboardsProps) {
  const columns = useMemo(() => {
    const data: Column<Dto.Guild.CurrencyWallet>[] = [
      {
        id: 'row',
        Header: 'Place',
        Cell: ({ row }: CellProps<Record<string, unknown>, string>) => row.index + 1,
      },
      {
        accessor: 'memberId',
        Header: 'User',
        Cell: ({ value }) => `<@${value}>`,
      },
      {
        accessor: 'amount',
        Header: 'Amount',
      },
      {
        accessor: 'timelyLastClaimed',
        Header: 'Last timely claim',
        Cell: ({ value }) => new Date(value).toUTCString(),
      },
    ];
    return data;
  }, []);
  return <Table dataUrl={`/currencies/${currencyId}/leaderboards`} columns={columns} />;
}
