import { chartConfig } from "@/lib/utils";
import { chartData } from "@/data/data";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CartesianGrid, Line, LineChart, Bar, BarChart, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { BarChart2, ChevronRight, LineChartIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectUserGraph,
  setGraphType,
} from "@/redux/analytics/graphTypesSlice";

import React from "react";

const LabsVHospitals = () => {
  const graphType = useSelector(selectUserGraph);
  const dispatch = useDispatch();
  return (
    <div className="mx-auto grid md:grid-cols-2 gap-4">
      <Card className="mx-auto max-w-xl ">
        <CardHeader>
          <CardTitle className="text-lg">
            Hospitals vs Laboratory users
          </CardTitle>
          <CardDescription>
            This chart shows the number of hospitals vs laboratories sending
            samples to your facility
          </CardDescription>
          <ToggleGroup type="single" className="justify-end" value={graphType}>
            <ToggleGroupItem
              value="line"
              onClick={() =>
                dispatch(setGraphType({ type: "user", value: "line" }))
              }
            >
              <LineChartIcon className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="bar"
              onClick={() =>
                dispatch(setGraphType({ type: "user", value: "bar" }))
              }
            >
              <BarChart2 className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            {graphType === "line" ? (
              <LineChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Line
                  dataKey="Hospitals"
                  type="monotone"
                  stroke="var(--color-Hospitals)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  dataKey="Laboratories"
                  type="monotone"
                  stroke="var(--color-Laboratories)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            ) : (
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dashed" />}
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                  dataKey="Hospitals"
                  fill="var(--color-Hospitals)"
                  radius={4}
                />
                <Bar
                  dataKey="Laboratories"
                  fill="var(--color-Laboratories)"
                  radius={4}
                />
              </BarChart>
            )}
          </ChartContainer>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-secondary-foreground">
            Showing the number of hospitals vs laboratories sending samples to
            your facility
          </p>
        </CardFooter>
      </Card>
      <div className="flex justify-end">
        <blockquote className="h-fit rounded-md border-b-2 p-5 text-sm leading-6 tracking-wider">
          <ul className="text-xs space-y-4">
            <li className="flex gap-2">
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              Highest Performing month:June
            </li>
            <li className="flex gap-2">
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              Highest Performing month for Laboratories: May
            </li>
            <li className="flex gap-2">
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              Highest Performing month for Hospitals: June
            </li>
            <li className="flex gap-2">
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              Highest Performing month for Laboratories: June
            </li>
          </ul>
        </blockquote>
      </div>
    </div>
  );
};

export default LabsVHospitals;
