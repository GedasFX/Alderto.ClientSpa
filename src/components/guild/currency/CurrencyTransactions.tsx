import { useMemo } from 'react';
import Table from 'src/components/Table';
import { Column } from 'react-table';
import { FiCheck, FiGift, FiX } from 'react-icons/fi';

type CurrencyLeaderboardsProps = {
  currencyId: string | number;
};

export default function CurrencyTransactions({ currencyId }: CurrencyLeaderboardsProps) {
  const columns = useMemo(() => {
    const data: Column<Dto.Guild.CurrencyTransaction>[] = [
      {
        accessor: 'date',
        Header: 'Date',
        Cell: ({ value }) => new Date(value).toUTCString(),
      },
      {
        accessor: 'amount',
        Header: 'Amount',
      },
      {
        accessor: 'senderId',
        Header: 'Sender',
        Cell: ({ value }) => `<@${value}>`,
      },
      {
        accessor: 'recipientId',
        Header: 'Recipient',
        Cell: ({ value }) => `<@${value}>`,
      },
      {
        accessor: 'isAward',
        Header: <FiGift title="Award" />,
        Cell: function Cell({ value }) {
          return value ? <FiCheck /> : <FiX />;
        },
      },
    ];
    return data;
  }, []);
  return <Table dataUrl={`/currencies/${currencyId}/transactions/@me`} columns={columns} />;
}
