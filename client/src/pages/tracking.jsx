import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DeliveryStepper from "../components/dashboard/stepper";
import { useFetchSampleTracking } from "../api/queries";
import { GetCurrentStep } from "../hooks/usesampleStatus";

const Tracking = () => {
  const { data, error, isLoading } = useFetchSampleTracking(1);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (data?.data) {
      const state = data?.data?.status;
      setStatus(state);
    }
  }, [data?.data]);
  const currentStep = GetCurrentStep(status);

  console.log(currentStep)
  console.log(status)
  console.log(data?.data)

  return (
    <div className="my-5 sm:pl-14 mx-2">
      <Card className="max-w-5xl mx-auto">
        <CardHeader>
          <div className="flex items-center">
            <div className="flex gap-4 flex-grow">
              <Link>
                <Button className="w-7 h-7" variant="outline" size="icon">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </Link>
              <CardTitle className="text-lg">
                Tracking Sample #8240820820838
              </CardTitle>
            </div>
            <div className=" relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                id="search"
                placeholder={"search by sample id"}
                className="w-full h-10 rounded-lg bg-background md:w-[200px] lg:w-[336px] pl-10 max-w-[350px]"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border-b-[1px] pb-5">
            <DeliveryStepper currentStep={2} />
          </div>
          <div className="flex justify-around gap-5 mt-5">
            <p className="flex flex-col text-sm">
              <span className="text-muted-foreground"> Courier's name</span>
              <span className="font-semibold"> Saatum Timothy</span>
            </p>
            <p className="flex flex-col text-sm">
              <span className="text-muted-foreground">Courier's Contact</span>
              <span className="font-semibold">0249906015</span>
            </p>
            <p className="flex flex-col text-sm">
              <span className="text-muted-foreground"> Laboratory name</span>
              <span className="font-semibold"> Advanced Diagnostics</span>
            </p>
            <p className="flex flex-col text-sm">
              <span className="text-muted-foreground"> Laboratory Contact</span>
              <span className="font-semibold"> Saatum Timothy</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Tracking;

// export default function Tracking() {
//   return (
//     <div class="flex items-center justify-center min-h-screen bg-background text-foreground px-4">
//       <div class="text-center max-w-lg p-8 bg-card rounded-2xl shadow-xl transition-transform transform hover:scale-105 duration-500">
//         <h1 class="text-5xl font-extrabold mb-6 text-primary animate-pulse">
//           Coming Soon
//         </h1>
//         <p class="text-lg mb-8 text-muted-foreground leading-relaxed">
//           We're working hard on the Sample Tracking section. Join the waiting to be
//           the first to know when it's ready!
//         </p>
//         <div class="flex justify-center space-x-6">
//           <button class="bg-primary text-primary-foreground py-3 px-6 rounded-full shadow-md hover:bg-opacity-80 hover:shadow-lg transition duration-300 ease-in-out">
//             Notify Me
//           </button>
//           <button class="bg-muted text-muted-foreground py-3 px-6 rounded-full shadow-md hover:bg-opacity-80 hover:shadow-lg transition duration-300 ease-in-out">
//             Back to Home
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
