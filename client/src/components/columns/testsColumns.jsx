import { createCell, createSortableHeader } from "@/util/tablefxns";
import { Checkbox } from "../ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, MoreHorizontal, X } from "lucide-react";
import { buttonVariants } from "../ui/button";
import {
  useDeactivateTestForBranchMutation,
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
import { selectActiveBranch } from "@/redux/branches/activeBranchSlice";
import { useDispatch, useSelector } from "react-redux";
import { useFetchUserBranches } from "@/api/queries";
import { useState } from "react";
import { changeTestMethod } from "@/redux/lab/updatetestmethodSlice";

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
export function DeactivateDialog({
  mutate,
  branch,
  isPending,
  pending,
  mutateforbranch,
  data,
  purpose,
}) {
  const buttonClassName = buttonVariants({
    variant: "outline",
    size: "lg",
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <span className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent">
          {purpose} test
        </span>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex flex-row justify-between">
            {purpose} test
            <AlertDialogCancel>
              <X className="w-4 h-4" />
            </AlertDialogCancel>
          </AlertDialogTitle>
          <AlertDialogDescription>
            Do you want to {purpose.charAt(0).toLowerCase() + purpose.slice(1)}{" "}
            this test for only the active branch-
            {branch} or for all your branches
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            disabled={pending || isPending}
            onClick={() => mutateforbranch(data)}
            className={`${buttonClassName} text-black dark:text-white`}
          >
            Only {branch}
          </AlertDialogAction>
          <AlertDialogAction
            onClick={() => mutate(data)}
            disabled={isPending || pending}
          >
            All branches
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export const useTestColumns = (setSelected) => {
  const testscolumnDef = [
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
      header: createSortableHeader(`Price (GH${`\u20B5`})`),
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
      id: "details",
      cell: ({ row }) => {
        const test = row.original;

        return (
          <span
            className="text-xs underline hover:no-underline"
            onClick={() => setSelected(test.id)}
          >
            Details
          </span>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const test = row.original;

        const { mutate } = usedeleteTestMutation(test?.id);
        const { mutate: mutateforall, isPending } = useDeactivateTestMutation(
          test?.id
        );
        const { mutate: mutateforbranch, isPending: pending } =
          useDeactivateTestForBranchMutation(test?.id);
        const activeBranch = useSelector(selectActiveBranch);
        const { data: userbranches } = useFetchUserBranches();
        const dispatch = useDispatch();

        const activeBranchName = userbranches?.data?.find(
          (branch) => branch.id === activeBranch
        )?.name;

        return test?.test_status === "active" ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <MoreHorizontal className="w-4 h-4 " />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 space-x-22"
              collisionPadding={24}
            >
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>View Test</DropdownMenuItem>
                {test?.branch?.length > 1 ? (
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Update Test</DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <span
                          onClick={() => dispatch(changeTestMethod("single"))}
                        >
                          <UpdateTest test={test} branch={activeBranchName} />
                        </span>

                        <span onClick={() => dispatch(changeTestMethod("all"))}>
                          <UpdateTest test={test} branch="For all branches" />
                        </span>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                ) : (
                  <span onClick={() => dispatch(changeTestMethod("all"))}>
                    <UpdateTest test={test} branch={`Update Test`} />
                  </span>
                )}
                <ApplyDisCount test={test} />
                <DropdownMenuItem onClick={() => mutateforbranch("inactive")}>
                  Deactivate test
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DeleteDialog testId={test.id} mutate={mutate} />
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreHorizontal className="w-4 h-4 " />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 space-x-22"
              collisionPadding={24}
            >
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => mutateforbranch("active")}>
                  Activate test
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  return testscolumnDef;
};
