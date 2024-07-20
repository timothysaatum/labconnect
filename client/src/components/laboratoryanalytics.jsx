import { chartConfig } from "@/lib/utils";
import { chartData } from "@/data/data";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import UsersAnalytics from "@/components/analytics/users.analytics";

export default function Analytics() {
  return (
    <div className="py-10 sm:pl-14 mx-4">
      <Card className="mx-auto max-w-5xl">
        <CardHeader>
          <CardTitle>Laboratory Analytics</CardTitle>
          <CardDescription>
            All the data you need to make informed decisions about your
            laboratory.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UsersAnalytics />
        </CardContent>
      </Card>
    </div>
  );
}
