import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";

import { createCell, createSortableHeader } from "../../util/tablefxns";

export const useHospitalRequestColumns = () => {
  const RequestColumns = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: "Sample Id",
    },
    // {
    //   accessorKey: "Patient",
    //   header: createSortableHeader("Patient"),
    // },
    {
      accessorKey: "laboratory",
      header: createSortableHeader("laboratory"),
    },
    {
      accessorKey: "date",
      header: createSortableHeader("Date"),
      cell: createCell("date_added"),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const request = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(request.id)}
              >
                Copy payment ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View Laboratory</DropdownMenuItem>
              <DropdownMenuItem>View payment details</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Update Request</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                Delete Request
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  return RequestColumns;
};
export const useRequestLabColumns = () => {
  const RequestColumns = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "Patient",
      header: createSortableHeader("Patient"),
    },
    {
      accessorKey: "Patient_age",
      header: createSortableHeader("Patient's Age"),
      cell: createCell("Patient_age"),
    },
    {
      accessorKey: "referring_facility",
      header: createSortableHeader("Referring facility"),
      cell: createCell("referring_facility"),
    },
    {
      accessorKey: "referring_facility_phone",
      header: createSortableHeader("Referror Contact"),
      cell: createCell("referring_facility_phone"),
    },
    {
      accessorKey: "referror_name",
      header: createSortableHeader("Referror"),
      cell: createCell("referror_name"),
    },
    {
      accessorKey: "date",
      header: createSortableHeader("Date"),
      cell: createCell("date_added"),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const request = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(request.id)}
              >
                Copy payment ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View Laboratory</DropdownMenuItem>
              <DropdownMenuItem>Download Attachment</DropdownMenuItem>
              <DropdownMenuItem>View payment details</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Upload Results</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                Reject Sample
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  return RequestColumns;
};
