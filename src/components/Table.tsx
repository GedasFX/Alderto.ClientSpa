import React, { useState } from 'react';
import { useTable, usePagination, Column } from 'react-table';
import { useApi } from 'src/services';

type TableProps<T extends Record<string, unknown>> = {
  columns: Column<T>[];
  data?: T[];
  dataUrl?: string;
};

export default function Table<T extends { id: string | number }>({
  columns,
  data,
  dataUrl,
}: TableProps<T>) {
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: apiData } = useApi<T>(dataUrl ?? null);
  if (!data) {
    data = apiData ?? [];
  }

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    pageOptions,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data,
      useControlledState: state => {
        return React.useMemo(
          () => ({
            ...state,
            pageIndex: currentPage,
          }),
          [state]
        );
      },
      initialState: { pageIndex: currentPage },
      manualPagination: true,
      pageCount: pageSize,
    },
    usePagination
  );

  return (
    <>
      <table {...getTableProps()} className="table-fixed">
        <thead>
          {headerGroups.map(headerGroup => (
            // eslint-disable-next-line react/jsx-key
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.slice(0, 1).map(column => (
                // eslint-disable-next-line react/jsx-key
                <th
                  {...column.getHeaderProps()}
                  className="px-1 py-4 bg-red-100 capitalize w-96 text-left"
                >
                  {column.render('Header')}
                </th>
              ))}
              {headerGroup.headers.slice(1).map(column => (
                // eslint-disable-next-line react/jsx-key
                <th
                  {...column.getHeaderProps()}
                  className="py-4 bg-red-100 capitalize w-1/6 text-left"
                >
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map(row => {
            prepareRow(row);
            return (
              // eslint-disable-next-line react/jsx-key
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return (
                    // eslint-disable-next-line react/jsx-key
                    <td {...cell.getCellProps()} className="truncate p-1 border-b-2">
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="flex justify-between bg-red-100 p-4">
        <button
          onClick={() => {
            setCurrentPage(1);
          }}
          disabled={currentPage === 1}
        >
          first
        </button>
        <button
          onClick={() => {
            setCurrentPage(s => (s === 0 ? 0 : s - 1));
          }}
          disabled={currentPage === 1}
        >
          prev
        </button>
        <button
          onClick={() => {
            setCurrentPage(s => s + 1);
          }}
        >
          next
        </button>
        <span>
          Page
          <strong>
            {pageIndex} of {pageOptions.length}
          </strong>
        </span>
        <span>
          | Go to page:
          <input
            type="number"
            defaultValue={pageIndex}
            min="1"
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) : 1;
              setCurrentPage(page);
            }}
            className="w-20 border-2 rounded px-2"
          />
        </span>
        <select
          value={pageSize}
          onBlur={e => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[5, 10, 20].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
