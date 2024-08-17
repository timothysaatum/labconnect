import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "../ui/skeleton";

const TableSkeleton = () => {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>
              <Skeleton className="h-3 w-3 rounded-full" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-3 w-80" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-3 w-44" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-3 w-20" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-2 w-6" />
            </TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              <Skeleton className="h-3 w-3 rounded-full" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-3 w-80" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-3 w-44" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-3 w-20" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-2 w-6" />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Skeleton className="h-3 w-3 rounded-full" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-3 w-80" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-3 w-44" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-3 w-20" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-2 w-6" />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Skeleton className="h-3 w-3 rounded-full" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-3 w-80" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-3 w-44" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-3 w-20" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-2 w-6" />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Skeleton className="h-3 w-3 rounded-full" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-3 w-80" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-3 w-44" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-3 w-20" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-2 w-6" />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default TableSkeleton;
