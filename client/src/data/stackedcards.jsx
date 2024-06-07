import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export const stackedCards = [
  {
    id: 1,
    name: "Samples Received",
    designation: "hey",
    content: (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between p-4">
          <CardTitle className="text-xs font-medium tracking-wide">
            Samples Received:
          </CardTitle>
          <div className="text-sm font-bold">+2350</div>
        </CardHeader>
      </Card>
    ),
  },
  {
    id: 2,
    name: "Samples sent",
    designation: "merr",
    content: (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between p-4">
          <CardTitle className="text-xs font-medium tracking-wide">
            Samples Sent:
          </CardTitle>
          <div className="text-sm font-bold">+12,234</div>
        </CardHeader>
      </Card>
    ),
  },
  {
    id: 3,
    name: "Proccessed",
    designation: "merr",
    content: (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between p-4">
          <CardTitle className="text-xs font-medium tracking-wide">
            proccessed today:
          </CardTitle>
          <div className="text-sm font-bold">+573</div>
        </CardHeader>
      </Card>
    ),
  },
];
