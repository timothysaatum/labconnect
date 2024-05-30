import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import moment from "moment";

export const createSortableHeader =
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

export const createCell =
  (cell) =>
    ({ getValue }) => {
    if (cell === "date_added" || cell.split("_")[0].includes("date")) {
      const date = moment(getValue(cell)).format("MMM Do YY");
      return <div className="text-start font-medium">{date}</div>;
    }
    return <div className="text-center font-medium">{getValue(cell)}</div>;
  };
