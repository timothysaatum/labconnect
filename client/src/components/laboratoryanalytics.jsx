// import { chartConfig } from "@/lib/utils";
// import { chartData } from "@/data/data";

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import UsersAnalytics from "@/components/analytics/users.analytics";

// export default function Analytics() {
//   return (
//     <div className="py-10 sm:pl-14 mx-4">
//       <Card className="mx-auto max-w-5xl">
//         <CardHeader>
//           <CardTitle>Laboratory Analytics</CardTitle>
//           <CardDescription>
//             All the data you need to make informed decisions about your
//             laboratory.
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <UsersAnalytics />
//         </CardContent>
//       </Card>
//     </div>
//   );
// }


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
    <div class="flex items-center justify-center min-h-screen bg-background text-foreground px-4">
      <div class="text-center max-w-lg p-8 bg-card rounded-2xl transition-transform transform hover:scale-105 duration-500">
        <h1 class="text-5xl font-extrabold mb-6 text-primary animate-pulse">
          Coming Soon
        </h1>
        <p class="text-lg mb-8 text-muted-foreground leading-relaxed">
          We're working hard on the analytics section. Join the waiting to be the first
          to know when it's ready!
        </p>
        <div class="flex justify-center space-x-6">
          <button class="bg-primary text-primary-foreground py-3 px-6 rounded-full shadow-md hover:bg-opacity-80 hover:shadow-lg transition duration-300 ease-in-out">
            Notify Me
          </button>
          <button class="bg-muted text-muted-foreground py-3 px-6 rounded-full shadow-md hover:bg-opacity-80 hover:shadow-lg transition duration-300 ease-in-out">
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
