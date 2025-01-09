"use client";

import { TicketSearchResultsType } from "@/lib/queries/getTicketSearchResults";
import { useRouter, useSearchParams } from "next/navigation";
import { usePolling } from "@/hooks/usePolling";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  ColumnFiltersState,
  SortingState,
  getFilteredRowModel,
  getFacetedUniqueValues,
  getSortedRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleCheckIcon,
  CircleXIcon,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Filter from "@/components/react-table/Filter";
import { useState, useMemo } from "react";

type Props = {
  data: TicketSearchResultsType;
};

type RowType = TicketSearchResultsType[0];

type ColumnNames = keyof TicketSearchResultsType[0];

const columnDisplayNames: Record<ColumnNames, string> = {
  id: "",
  ticketDate: "Created",
  title: "Job Title",
  firstName: "First Name",
  lastName: "Last Name",
  email: "Email",
  tech: "Technician",
  completed: "Completed",
};

function TicketTable({ data }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "ticketDate",
      desc: false,
    },
  ]);

  usePolling(searchParams.get("searchText"), 300000);

  const pageParam = searchParams.get("page");
  const pageIndex = useMemo(() => {
    return pageParam ? parseInt(pageParam) - 1 : 0;
  }, [pageParam]);

  const columnHeadersArray: Array<keyof RowType> = [
    "ticketDate",
    "title",
    "tech",
    "firstName",
    "lastName",
    "email",
    "completed",
  ];

  const columnWidths = {
    completed: 150,
    ticketDate: 150,
    title: 250,
    tech: 225,
    email: 225,
  };

  const columnHelper = createColumnHelper<RowType>();
  const columns = columnHeadersArray.map((columnName) => {
    return columnHelper.accessor(
      // transformational
      (row) => {
        const value = row[columnName];
        if (columnName === "ticketDate" && value instanceof Date) {
          return value.toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          });
        }
        if (columnName === "completed") {
          return value ? "COMPLETED" : "OPEN";
        }
        return value;
      },
      {
        id: columnName,
        size:
          columnWidths[columnName as keyof typeof columnWidths] ?? undefined,
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              className="flex w-full justify-between pl-1"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              {columnDisplayNames[
                columnName as keyof typeof columnDisplayNames
              ] || columnName}

              {column.getIsSorted() === "asc" && (
                <ArrowUp className="ml-2 h-4 w-4" />
              )}

              {column.getIsSorted() === "desc" && (
                <ArrowDown className="ml-2 h-4 w-4" />
              )}

              {column.getIsSorted() !== "desc" &&
                column.getIsSorted() !== "asc" && (
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                )}
            </Button>
          );
        },
        cell: ({ getValue }) => {
          // presentational
          const value = getValue();
          if (columnName === "completed") {
            return (
              <div className="flex justify-center">
                {value === "OPEN" ? (
                  <CircleXIcon className="opacity-25" />
                ) : (
                  <CircleCheckIcon className="text-green-600" />
                )}
              </div>
            );
          }
          return value;
        },
      },
    );
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      pagination: {
        pageIndex,
        pageSize: 10,
      },
    },
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="mt-6 flex flex-col gap-4">
      <div className="overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="p-1"
                      style={{ width: header.getSize() }}
                    >
                      <div>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </div>
                      {header.column.getCanFilter() ? (
                        <div className="grid place-content-center">
                          <Filter
                            column={header.column}
                            filteredRows={table
                              .getFilteredRowModel()
                              .rows.map((row) =>
                                row.getValue(header.column.id),
                              )}
                          />
                        </div>
                      ) : null}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer hover:bg-border/25"
                  onClick={() =>
                    router.push(`/tickets/form?ticketId=${row.original.id}`)
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-1">
        <div>
          <p className="whitespace-nowrap text-sm">
            {`Page ${table.getState().pagination.pageIndex + 1} / ${table.getPageCount()}`}
            &nbsp; &nbsp;
            {`[ ${table.getFilteredRowModel().rows.length} ${table.getFilteredRowModel().rows.length !== 1 ? "total results" : "result"} ]`}
          </p>
        </div>
        <div className="flex flex-row gap-1">
          <div className="flex flex-row gap-1">
            <Button variant="outline" onClick={() => router.refresh()}>
              Refresh data
            </Button>
            <Button variant="outline" onClick={() => table.resetSorting()}>
              Reset sorting
            </Button>
            <Button
              variant="outline"
              onClick={() => table.resetColumnFilters()}
            >
              Reset filters
            </Button>
          </div>
          <div className="flex flex-row gap-1">
            <Button
              variant="outline"
              onClick={() => {
                const newIndex = table.getState().pagination.pageIndex - 1;
                table.setPageIndex(newIndex);
                const params = new URLSearchParams(searchParams.toString());
                params.set("page", (newIndex + 1).toString());
                router.replace(`?${params.toString()}`, { scroll: false });
              }}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeftIcon />
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const newIndex = table.getState().pagination.pageIndex + 1;
                table.setPageIndex(newIndex);
                const params = new URLSearchParams(searchParams.toString());
                params.set("page", (newIndex + 1).toString());
                router.replace(`?${params.toString()}`, { scroll: false });
              }}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRightIcon />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketTable;
