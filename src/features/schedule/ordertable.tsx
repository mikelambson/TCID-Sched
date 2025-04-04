// @/features/schedule/ordertable.tsx
"use client";

import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  SortingState,
  ColumnFiltersState,
  FilterFn,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FaAngleDoubleDown, FaAngleDoubleUp } from "react-icons/fa";
import { columns } from "./columns";
import { ScheduleRow } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Assuming you have a Select component


interface OrderTableProps {
  location?: string;
  data: ScheduleRow[];
}

// Define the custom filter function with proper typing
const customFilter: FilterFn<ScheduleRow> = (row, columnId, filterValue: string) => {
  if (!filterValue) return true; // No filter if empty

  const isNumeric = !isNaN(Number(filterValue.charAt(0))); // Check first character
  console.log("Filter value:", filterValue, "Is numeric start:", isNumeric, "Column:", columnId);
  console.log("Row value:", row.getValue(columnId));

  if (columnId === "orderNumber" && isNumeric) {
    const orderNumber = row.getValue("orderNumber") as number;
    return orderNumber.toString().startsWith(filterValue);
  } else if (columnId === "mainLateral" && !isNumeric) {
    const mainLateral = row.getValue("mainLateral") as string;
    return mainLateral.toLowerCase().startsWith(filterValue.toLowerCase());
  }
  return true; // No filtering if conditions don’t match
};

export function OrderTable({ location, data }: OrderTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "startTime", desc: false },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [filterValue, setFilterValue] = React.useState<string>("");
  const [pageSize, setPageSize] = React.useState(25); // Default page size

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize,
        pageIndex: 0,
      },
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    filterFns: {
      customFilter, // Register the typed filter function
    },
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilterValue(value);
    const isNumeric = !isNaN(Number(value.charAt(0)));
    table.setColumnFilters([
      {
        id: isNumeric && value ? "orderNumber" : "mainLateral",
        value,
      },
    ]);
  };

  const handlePageSizeChange = (value: string) => {
    const size = value === "all" ? data.length : Number(value);
    setPageSize(size);
    table.setPageSize(size); // Update table state
  };

  return (
    <div className="rounded-md border border-gray-500/10 shadow-md">
      <div className="w-full p-2 inline-flex items-center gap-2 flex-nowrap">
        <p className="font-semibold text-gray-700">
            Search {location}:
        </p>
        <Input
          name="filter"
          className="max-w-48"
          value={filterValue}
          onChange={handleFilterChange}
          placeholder="Enter order # or lateral..."
        />
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                 <TableHead
                 key={header.id}
                 onClick={header.column.getToggleSortingHandler()}
                 className="cursor-pointer"
               >
                 <div className="flex items-center gap-1">
                   {header.isPlaceholder
                     ? null
                     : typeof header.column.columnDef.header === "function"
                     ? header.column.columnDef.header(header.getContext())
                     : header.column.columnDef.header}
                   {header.column.getIsSorted() === "asc" && <FaAngleDoubleUp />}
                   {header.column.getIsSorted() === "desc" && <FaAngleDoubleDown />}
                 </div>
               </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {typeof cell.column.columnDef.cell === "function"
                      ? cell.column.columnDef.cell(cell.getContext())
                      : cell.getValue()}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                No schedules found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex justify-between p-2 text-sm">
        <Button
          size={"sm"}
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="disabled:opacity-50"
        >
          Previous
        </Button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <Select onValueChange={handlePageSizeChange} defaultValue="25">
            <SelectTrigger className="w-20">
              <SelectValue placeholder="25" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          size={"sm"}
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="disabled:opacity-50"
        >
          Next
        </Button>
      </div>
    </div>
  );
}