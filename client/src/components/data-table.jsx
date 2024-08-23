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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import React, { useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUpDown,
  CirclePlus,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedRows } from "@/redux/dataTable/selectedrowsSlice";
import { selectRowCount, setRowCount } from "@/redux/dataTable/rowcount";
import { Popover, PopoverTrigger } from "./ui/popover";

export function DataTable({
  data,
  columnDef,
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

  const dispatch = useDispatch();
  const rowCount = useSelector(selectRowCount);

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 5,
  });
  const table = useReactTable({
    columns: finalColumnDef,
    data: finalData,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getRowId: (row) => row.id,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
  });
  useEffect(() => {
    if (title === "Branches") {
      dispatch(
        setSelectedRows(
          table.getSelectedRowModel()?.rows.map((row) => row.original)
        )
      );
    }
  }, [rowSelection, title]);
  const possiblePageSizes = [5, 10, 15, 20, 25];
  useEffect(() => {
    table.setPageSize(rowCount);
    table.setPageIndex(0);
  }, [rowCount]);
  return (
    <>
      <div className=" ml-auto  md:grow-0 flex justify-end mb-2 gap-4">
        <div className="flex-1">
          <div className="relative ">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              id="search"
              placeholder={`Search ${title} ...`}
              className="w-full h-10 rounded-lg bg-background md:w-[200px] lg:w-[336px] pl-10 max-w-[350px]"
              value={table.getColumn(`${filter}`)?.getFilterValue() ?? ""}
              onChange={(event) =>
                table.getColumn(`${filter}`)?.setFilterValue(event.target.value)
              }
            />
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto text-xs">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              View
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
                    {column.id.split("_").join(" ")}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md md:border max-md:pt-4">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerEl) => (
              <TableRow key={headerEl.id}>
                {headerEl.headers.map((columnEl) => (
                  <TableHead
                    key={columnEl.id}
                    colSpan={columnEl.colSpan}
                    className="font-semibold whitespace-nowrap max-md:px-2 max-sm:h-6"
                  >
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
                    setSelected &&
                      typeof setSelected === "function" &&
                      setSelected(null);
                  } else {
                    setSelected &&
                      typeof setSelected === "function" &&
                      setSelected(rowEl.original.id);
                    console.log(rowEl.original.id);
                  }
                }}
                className={`cursor-pointer ${
                  rowEl.original.id === selected ? "bg-accent" : ""
                } transition-all ${
                  rowEl?.original?.inactive === "inactive" && "opacity-50"
                }`}
              >
                {rowEl.getVisibleCells().map((cellEl) => (
                  <TableCell
                    key={cellEl.id}
                    className="max-sm:p-2 whitespace-nowrap"
                  >
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
        <div className="text-muted-foreground flex-1 text-xs hidden sm:block">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>

        <div className=" flex justify-between gap-2 sm:gap-8 items-center">
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium sm:text-sm text-[10px] whitespace-nowrap">
              {" "}
              Rows per page
            </span>{" "}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center justify-between h-8 gap-4"
                >
                  {pagination.pageSize}
                  <ChevronsUpDown className="w-3 h-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {possiblePageSizes.map((page, index) => (
                  <DropdownMenuCheckboxItem
                    checked={pagination.pageSize === page}
                    key={index}
                    onCheckedChange={() => dispatch(setRowCount(page))}
                  >
                    {page}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-medium uppercase tracking-wider">
              page {pagination.pageIndex + 1} of {table.getPageCount()}
            </p>
          </div>
          <div className="items-center space-x-1 whitespace-nowrap">
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.firstPage()}
              disabled={!table.getCanPreviousPage()}
              className="w-8 h-8"
            >
              <ChevronsLeft />
            </Button>
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
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.lastPage()}
              disabled={!table.getCanNextPage()}
              className="w-8 h-8"
            >
              <ChevronsRight />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
