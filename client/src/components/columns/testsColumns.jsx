import { createCell, createSortableHeader } from "@/util/tablefxns";

export const testscolumnDef = [
  {
    accessorKey: "test_code",
    header: createSortableHeader("Test Code"),
  },
  {
    accessorKey: "test_name",
    header: "Test Name",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "turn_around_time",
    header: "Turn around time",
  },
  {
    accessorKey: "date",
    header: createSortableHeader("Date added"),
    cell: createCell("date_added"),
  },
];
