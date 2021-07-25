import clsx from 'clsx';
import React, { useMemo, useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { FiSkipBack, FiSkipForward } from 'react-icons/fi';
import { useTable, usePagination, Column } from 'react-table';
import { useApi } from 'src/services';

type TableProps<T extends Record<string, unknown>> = {
  columns: Column<T>[];
  data?: T[];
  dataUrl?: string;
  disablePagination?: boolean;
};

export default function Table<T extends { id: string | number }>({
  columns,
  data,
  dataUrl,
  disablePagination,
}: TableProps<T>) {
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: apiData } = useApi<T>(dataUrl ?? null, { page: currentPage, limit: pageSize });
  if (!data) {
    data = apiData;
  }

  const mData = useMemo(() => data ?? [], [data]);

  const pageInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (pageInput.current) {
      pageInput.current.value = String(currentPage);
    }
  }, [currentPage]);

  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, page } = useTable(
    {
      columns,
      data: mData,
      useControlledState: state => {
        return React.useMemo(
          () => ({
            ...state,
            pageIndex: currentPage,
          }),
          //
          // eslint-disable-next-line react-hooks/exhaustive-deps
          [state, currentPage]
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
      <div className="w-full overflow-x-auto">
        <table {...getTableProps()} className="table">
          <thead>
            {headerGroups.map(headerGroup => (
              // eslint-disable-next-line react/jsx-key
              <tr
                className="border-b-2 dark:border-dark-5 whitespace-nowrap"
                {...headerGroup.getHeaderGroupProps()}
              >
                {headerGroup.headers.map(column => (
                  // eslint-disable-next-line react/jsx-key
                  <th {...column.getHeaderProps()} className="">
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                // eslint-disable-next-line react/jsx-key
                <tr
                  className={clsx(i % 2 === 0 && 'bg-gray-200 dark:bg-dark-1')}
                  {...row.getRowProps()}
                >
                  {row.cells.map(cell => {
                    return (
                      // eslint-disable-next-line react/jsx-key
                      <td {...cell.getCellProps()} className="border-b dark:border-dark-5">
                        {cell.render('Cell')}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {!disablePagination && (
        <div className="flex justify-around p-4">
          <div className="flex gap-4">
            <button
              onClick={() => setCurrentPage(s => (s === 0 ? 0 : s - 1))}
              disabled={currentPage === 1}
            >
              <FiSkipBack />
            </button>
            <div className="flex gap-2 items-center">
              Page
              <input
                ref={pageInput}
                type="number"
                defaultValue={currentPage}
                min="1"
                onBlur={e => {
                  setCurrentPage(e.target.value ? Number(e.target.value) : 1);
                }}
                className="form-control w-16 border-2 rounded px-2"
              />
            </div>
            <button
              onClick={() => {
                setCurrentPage(s => s + 1);
              }}
            >
              <FiSkipForward />
            </button>
          </div>

          <select
            className="form-control w-32"
            value={pageSize}
            onChange={e => setPageSize(Number(e.target.value))}
            onBlur={e => setPageSize(Number(e.target.value))}
          >
            {[5, 10, 20].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      )}
    </>
  );
}
