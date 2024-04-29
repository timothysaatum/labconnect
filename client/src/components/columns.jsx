import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import moment from "moment";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "./ui/checkbox";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/auth/authSlice";
import { useEffect } from "react";

const createSortableHeader =
  (columnName) =>
  ({ column }) => {
    return (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {columnName}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    );
  };
const createCell =
  (cell) =>
  ({ getValue }) => {
    if (cell === "date_added" || cell.split("_")[0].includes("date")) {
      const date = moment(getValue("date_added")).format("MMM Do YY");
      return <div className="text-start font-medium">{date}</div>;
    }
    return <div className="text-center font-medium">{getValue(cell)}</div>;
  };

export const testscolumnDef = [
  {
    accessorKey: "test_name",
    header: createSortableHeader("Test Name"),
  },
  {
    accessorKey: "price",
    header: createSortableHeader("Price (GHS)"),
    cell: createCell("price"),
  },
  {
    accessorKey: "department",
    header: createSortableHeader("Department"),
    cell: createCell("department"),
  },
  {
    accessorKey: "discounted_price",
    header: createSortableHeader("Discounted Price"),
    cell: createCell("discounted_price"),
  },
  {
    accessorKey: "date_added",
    header: createSortableHeader("Date Added"),
    cell: createCell("date_added"),
  },
];

export const departmentColumnDef = [
  {
    accessorKey: "department_name",
    header: createSortableHeader("Department name"),
  },
  {
    accessorKey: "head_of_department",
    header: "Head of department",
  },
  {
    accessorKey: "email",
    header: "Department Email",
  },
  {
    accessorKey: "phone_number",
    header: "Tel",
  },
  {
    accessorKey: "date_added",
    header: createSortableHeader("Date Added"),
    cell: createCell("date_added"),
  },
];

//requests
export const useRequestColums = () => {
  const user = useSelector(selectCurrentUser);
  useEffect(() => {
    console.log(user);
  }, [user]);
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
    {
      accessorKey: "Patient",
      header: createSortableHeader("Patient"),
    },
    {
      accessorKey:
        user?.account_type === "Clinician" ? "laboratory" : "Sent_by",
      header: createSortableHeader(
        `${user?.account_type === "Clinician" ? "laboratory" : "Sent by"}`
      ),
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
