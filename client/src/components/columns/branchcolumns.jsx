import { createCell, createSortableHeader } from "@/util/tablefxns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { Link } from "react-router-dom";

export const branchcolumnDef = [
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
    accessorKey: "branch_name",
    header: createSortableHeader("Branch"),
    cell: ({ getValue, row }) => {
      return (
        <Link
          to={`branches/${row.original.id}/`}
          className="hover:underline transition-all"
        >
          {getValue()}
        </Link>
      );
    },
  },
  {
    accessorKey: "branch_manager",
    header: "Branch Manager",
  },
  {
    accessorKey: "branch_phone",
    header: "Branch Phone",
  },
  {
    accessorKey: "branch_email",
    header: "Branch Email",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const branch = row.original;

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
            <DropdownMenuItem>Update Branch</DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => console.log(branch.id)}
            >
              Delete Branch
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
