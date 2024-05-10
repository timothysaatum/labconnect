import { createCell, createSortableHeader } from "@/util/tablefxns";

export const testscolumnDef = [
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
];
