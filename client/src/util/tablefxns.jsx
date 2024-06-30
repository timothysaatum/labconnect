import { Button } from "@/components/ui/button";
import { ArrowUpDown, ChevronsUpDown } from "lucide-react";
import moment from "moment";

export const createSortableHeader =
  (columnName) =>
  ({ column }) => {
    return (
      <Button
        variant="ghost"
        className="font-bold"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {columnName}
        <ChevronsUpDown className="ml-1 h-3 w-3" />
      </Button>
    );
  };

export const createCell =
  (cell) =>
  ({ getValue }) => {
    if (cell === "date_added" || cell.split("_")[0].includes("date")) {
      const date = moment(getValue(cell)).format("MMM Do YY");
      return <div className="text-start font-normal text-xs">{date}</div>;
    }
    return <div className="text-center font-medium">{getValue(cell)}</div>;
  };
