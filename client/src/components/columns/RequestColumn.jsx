import { Eye, MoreHorizontal } from "lucide-react";

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
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectActiveBranch } from "@/redux/branches/activeBranchSlice";
import UploadResults from "../dashboard/resultupload";
import RejectSample from "../dashboard/rejectSample";

export const useHospitalRequestColumns = (setSelected) => {
  const RequestSentColumns = [
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
      accessorKey: "laboratory",
      header: createSortableHeader("laboratory"),
    },
    {
      accessorKey: "Laboratory_contact",
      header: createSortableHeader("Laboratory Contact"),
    },
    {
      accessorKey: "Laboratory Email",
      header: createSortableHeader("Laboratory Email"),
    },
    {
      accessorKey: "date",
      header: createSortableHeader("Date"),
      cell: createCell("date_added"),
    },
    {
      id: "tracking",
      cell: ({ row }) => {
        return <p className="text-xs cursor-pointer">Track Sample</p>;
      },
    },
    {
      id: "details",
      cell: ({ row }) => {
        const request = row.original;

        return (
          <span
            className="text-xs underline hover:no-underline"
            onClick={() => setSelected(request.id)}
          >
            Details
          </span>
        );
      },
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
  return { RequestSentColumns };
};
export const useRequestLabColumns = (setSelected) => {
  const activeBranch = useSelector(selectActiveBranch);
  const RequestReceivedColumns = [
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
      header: "Patient's Age",
      cell: createCell("Patient_age"),
    },
    {
      accessorKey: "referring_facility",
      header: createSortableHeader("Referring facility"),
      cell: createCell("referring_facility"),
    },
    {
      accessorKey: "referring_facility_phone",
      header: "Referror Contact",
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
      id: "details",
      cell: ({ row }) => {
        const request = row.original;

        return (
          <span
            className="text-xs underline hover:no-underline"
            onClick={() => setSelected(request.id)}
          >
            Details
          </span>
        );
      },
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
                onClick={() => navigator.clipboard.writeText(request?.id)}
              >
                Copy payment ID
              </DropdownMenuItem>
              <Link to={`/dashboard/overview/samples/received/${request.id}`}>
                <DropdownMenuItem>view sample</DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View Laboratory</DropdownMenuItem>
              <DropdownMenuItem>
                <a
                  href={request?.attachment}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Attachment
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem>View payment details</DropdownMenuItem>
              <DropdownMenuSeparator />
              <UploadResults />
              <RejectSample id={request?.id} />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const RequestSentColumns = [
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
      header: "Patient's Age",
      cell: createCell("Patient_age"),
    },
    {
      accessorKey: "referring_facility",
      header: createSortableHeader("Referring facility"),
      cell: createCell("referring_facility"),
    },
    {
      accessorKey: "referring_facility_phone",
      header: "Referror Contact",
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
      id: "details",
      cell: ({ row }) => {
        const request = row.original;

        return (
          <span
            className="text-xs underline hover:no-underline"
            onClick={() => setSelected(request.id)}
          >
            Details
          </span>
        );
      },
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
                onClick={() => navigator.clipboard.writeText(request?.id)}
              >
                Copy payment ID
              </DropdownMenuItem>
              <Link to={`/dashboard/overview/samples/received/${request.id}`}>
                <DropdownMenuItem>view sample</DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View Laboratory</DropdownMenuItem>
              <DropdownMenuItem>
                <a
                  href={request?.attachment}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Attachment
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem>View payment details</DropdownMenuItem>
              <DropdownMenuSeparator />
              <UploadResults />
              <RejectSample id={request?.id} />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return { RequestReceivedColumns, RequestSentColumns };
};
