"use client";

import { selectCustomerSchemaType } from "@/zod-schemas/customer";
import { useRouter } from "next/navigation";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Props = {
  data: selectCustomerSchemaType[];
};

type ColumnNames = keyof selectCustomerSchemaType;

const columnDisplayNames: Record<ColumnNames, string> = {
  firstName: "First Name",
  lastName: "Last Name",
  email: "Email Address",
  id: "",
  phone: "Phone Number",
  address1: "",
  address2: "",
  city: "City",
  state: "",
  zip: "ZIP Code",
  notes: "",
  active: "",
  createdAt: "",
  updatedAt: "",
};

function CustomerTable({ data }: Props) {
  const router = useRouter();
  const columnHeadersArray: Array<keyof selectCustomerSchemaType> = [
    "firstName",
    "lastName",
    "email",
    "phone",
    "city",
    "zip",
  ];
  const columnHelper = createColumnHelper<selectCustomerSchemaType>();
  const columns = columnHeadersArray.map((columnName) => {
    return columnHelper.accessor(columnName, {
      id: columnName,
      header:
        columnDisplayNames[columnName as keyof typeof columnDisplayNames] ||
        columnName,
    });
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="mt-6 overflow-hidden rounded-lg border border-border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
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
                  router.push(`/customers/form?customerId=${row.original.id}`)
                }
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default CustomerTable;
