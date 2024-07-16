import { createCell, createSortableHeader } from "@/util/tablefxns";
import { Checkbox } from "../ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { BadgeCent, Edit3, MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import {
  useDeactivateTestMutation,
  usedeleteTestMutation,
} from "@/api/mutations";

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
import { ApplyDisCount } from "../dashboard/adddiscount";
import UpdateTest from "../dashboard/updateTest";

export function DeleteDialog({ testId, mutate }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <span className="relative text-destructive flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent">
          Delete Test
        </span>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this test
            from the selected branch and remove it's data from our servers.
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

export const testscolumnDef = [
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
    accessorKey: "test_code",
    header: "Test Code",
  },
  {
    accessorKey: "test_name",
    header: createSortableHeader("Test Name"),
  },
  {
    accessorKey: "price",
    header: createSortableHeader("Price (GHS)"),
  },
  {
    accessorKey: "turn_around_time",
    header: "Turn around time",
  },
  {
    accessorKey: "date_added",
    header: createSortableHeader("Date added"),
    cell: createCell("date_added"),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const test = row.original;

      const { mutate, error } = usedeleteTestMutation(test.id);
      const { mutate: Deactivate } = useDeactivateTestMutation(test.id);
      return (
        <div className="flex items-center space-x-6 ">
          <TooltipProvider>
            <Tooltip>
              <UpdateTest test={test}>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <Edit3 className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
              </UpdateTest>
              <TooltipContent side="right">Edit test</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <ApplyDisCount test={test}>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <BadgeCent className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
              </ApplyDisCount>
              <TooltipContent side="right">Apply discount</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-8 h-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => Deactivate()}>
                Deactivate test
              </DropdownMenuItem>
              <DropdownMenuItem>Remove discount</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DeleteDialog testId={test.id} mutate={mutate} />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
