import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { type ChartConfig } from "@/components/ui/chart";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const chartConfig = {
  Hospitals: {
    label: "Hospitals",
    color: "hsl(var(--chart-1))",
  },
  Laboratories: {
    label: "Laboratories",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;
