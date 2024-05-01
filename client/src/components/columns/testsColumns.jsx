import { createCell, createSortableHeader } from "@/utils/tablefxns";

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
