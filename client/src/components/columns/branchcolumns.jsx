import { createCell, createSortableHeader } from "@/util/tablefxns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";

export const branchcolumnDef = [
  {
    accessorKey: "branch_name",
    header: createSortableHeader("Branch"),
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
            <DropdownMenuItem className="text-destructive">
              Delete Branch
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
