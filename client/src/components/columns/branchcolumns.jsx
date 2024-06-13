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
import { MoreHorizontal, Trash } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { Link } from "react-router-dom";
import { usedeleteBranchMutation } from "@/api/mutations";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import AddManager from "../dashboard/addManager";

export function DeleteDialog({ mutate }) {
  const [open, setOpen] = useState(false);
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <span className="relative gap-2 text-destructive flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-destructive">
          Delete Branch
        </span>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-sm:max-w-[90vw]">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently deletey your
            branch and remove it's data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => mutate()}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

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
      const { mutate } = usedeleteBranchMutation(branch.id);

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
            <AddManager branchId={branch.id}>
              <span className="relative gap-2 flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent">
                Assign Manager
              </span>
            </AddManager>
            <Link to="../settings">
              <DropdownMenuItem>Update Branch</DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DeleteDialog mutate={mutate} branchId={branch.id} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
