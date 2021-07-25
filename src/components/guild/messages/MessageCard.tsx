import { useMemo } from 'react';
import Link from 'next/link';
import { CellProps, Column } from 'react-table';
import Table from 'src/components/Table';
import { FaHashtag } from 'react-icons/fa';
import { FiEdit } from 'react-icons/fi';

type MessageCardProps = {
  guildId: string;
  channel: Discord.Channel;
  data: Dto.Guild.Message[];

  onRequestEdit?: (item: Dto.Guild.Message) => void;
};

export default function MessageCard({ guildId, channel, data, onRequestEdit }: MessageCardProps) {
  const columns = useMemo(() => {
    const data: Column<Dto.Guild.Message>[] = [
      {
        accessor: 'id',
        Header: 'Id',
        Cell: function Cell({ value }) {
          return (
            <Link href={`https://discordapp.com/channels/${guildId}/${channel.id}/${value}`}>
              {value}
            </Link>
          );
        },
      },
      {
        accessor: 'content',
        Header: 'Content',
        Cell: function Cell({ value }) {
          return <span className="overflow-ellipsis whitespace-pre">{value}</span>;
        },
      },
      {
        accessor: 'lastModified',
        Header: 'Last modified',
        Cell: ({ value }) => new Date(value).toUTCString(),
      },
      {
        id: 'actions',
        Cell: function Cell({ row: { original: message } }: CellProps<Dto.Guild.Message, string>) {
          return (
            <button>
              <FiEdit
                onClick={() => {
                  if (onRequestEdit) {
                    onRequestEdit(message);
                  }
                }}
              />
            </button>
          );
        },
      },
    ];
    return data;
  }, [guildId, channel.id, onRequestEdit]);
  return (
    <div className="intro-y box my-4">
      <div className="flex justify-between p-5 border-b border-gray-200 dark:border-dark-5 gap-3 leading-none">
        <div className="flex items-center gap-2">
          <FaHashtag size={24} strokeWidth={1.5} />
          {channel.name}
        </div>
      </div>
      <div className="p-4">
        <Table data={data} columns={columns} disablePagination />
      </div>
    </div>
  );
}
