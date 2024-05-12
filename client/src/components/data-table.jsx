import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
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
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ChevronLeft, ChevronRight, ListFilter, Search } from "lucide-react";

function EmptyLab({ header, helper, button }) {
  return (
    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
      <div className="flex flex-col items-center  text-center py-14 ">
        <h3 className="text-xl font-semibold tracking-tight">{header}</h3>
        <p className="text-sm text-muted-foreground">{helper}</p>
        <Button className="mt-4">{button}</Button>
      </div>
    </div>
  );
}
export function DataTable({
  data,
  columnDef,
  loading,
  error,
  title,
  filter,
  setSelected,
  selected,
}) {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const finalData = React.useMemo(() => data, [data]);
  const finalColumnDef = React.useMemo(() => columnDef, [columnDef]);

  const table = useReactTable({
    columns: finalColumnDef,
    data: finalData,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (loading) return "Loading...";
  if (error)
    return (
      <EmptyLab
        header={`Error loading ${title}`}
        title={title}
        helper={"Please check no connection and try again "}
        button={"Try Again"}
      />
    );
  if (!loading && !error) {
    if (finalData.length === 0)
      return (
        <EmptyLab
          header={`No ${title} Found`}
          helper={`Add ${title} to view`}
          button={null}
        />
      );
  }
  return (
    <>
      <div className=" ml-auto  md:grow-0 flex justify-end mb-2 gap-2">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              id="search"
              placeholder={`Search ${title} ...`}
              className="w-full rounded-lg bg-background md:w-[200px] lg:w-[336px] pl-10 max-w-[350px]"
              value={table.getColumn(`${filter}`)?.getFilterValue() ?? ""}
              onChange={(event) =>
                table.getColumn(`${filter}`)?.setFilterValue(event.target.value)
              }
            />
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto ">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerEl) => (
              <TableRow key={headerEl.id}>
                {headerEl.headers.map((columnEl) => (
                  <TableHead key={columnEl.id} colSpan={columnEl.colSpan}>
                    {columnEl.isPlaceholder
                      ? null
                      : flexRender(
                          columnEl.column.columnDef.header,
                          columnEl.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((rowEl) => (
              <TableRow
                key={rowEl.id}
                onDoubleClick={() => {
                  if (rowEl.original.id === selected) {
                    setSelected(null);
                  } else {
                    setSelected(rowEl.original.id);
                  }
                }}
                className="cursor-pointer"
              >
                {rowEl.getVisibleCells().map((cellEl) => (
                  <TableCell key={cellEl.id}>
                    {flexRender(
                      cellEl.column.columnDef.cell,
                      cellEl.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center mt-2">
        <div className="text-muted-foreground flex-1 text-xs">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="w-8 h-8"
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="w-8 h-8"
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </>
  );
}
