import { createCell, createSortableHeader } from "@/util/tablefxns";

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
