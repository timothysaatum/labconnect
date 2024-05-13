import { BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import RequestDialog from "./requestdialog";
import { useFetchHealthWorkerRequests } from "@/api/queries";
import { useEffect, useState } from "react";
import RequestDetails from "./requestDetails";
import { DataTable } from "../data-table";
import { useHealthWorkerRequestColumns } from "@/components/columns/RequestColumn";

export default function HealthWorkerDashboardOverview() {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requests, setTableRequests] = useState([]);
  const RequestColumns = useHealthWorkerRequestColumns();


  const { isError, data: allrequests, isLoading } = useFetchHealthWorkerRequests();
  useEffect(() => {
    if (allrequests) {
      setTableRequests(
        allrequests.data.map((request) => {
          return {
            id: request.id,
            Patient: request.name_of_patient,
            laboratory: request.lab,
            date: request.date_created,
          };
        })
      );
    }
  }, [allrequests]);
  return (
    <main className="grid gap-4 p-4 sm:px-6 sm:pl-20 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div
        className={`grid auto-rows-max items-start gap-4 md:gap-8 ${
          selectedRequest ? "lg:col-span-2" : "lg:col-span-3"
        }`}
      >
        <div className="max-w-full grid gap-4 grid-cols-1 md:grid-cols-10">
          <Card className="md:col-span-3">
            <CardHeader className="relative pb-3">
              <CardTitle>Your Requests</CardTitle>
              <CardDescription className="max-w-lg text-balance leading-relaxed">
                Introducing Our Dynamic Requests Dashboard for Seamless
                Management and Insightful Analysis.
              </CardDescription>
              <div className="absolute right-5 top-5 md:hidden">
                <Button variant="outline" size="icon" className="text-gray-400">
                  <BellRing />
                </Button>
              </div>
            </CardHeader>
            <CardFooter>
              <RequestDialog />
            </CardFooter>
          </Card>

          <Card className="col-span-7 px-4 place-items-center">
            <CardContent className=" grid grid-cols-3 gap-8">
              <Card>
                <CardContent>ii</CardContent>
              </Card>
              <Card>hh</Card>
              <Card></Card>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="px-7">
            <CardTitle>Requests</CardTitle>
            <CardDescription>Recent Requests you made</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              data={requests}
              error={isError}
              loading={isLoading}
              columnDef={RequestColumns}
              title={"Requests"}
              filter={"Patient"}
            />
          </CardContent>
        </Card>
      </div>
      {selectedRequest && (
        <RequestDetails
          selectedRequest={selectedRequest}
          setSelectedRequest={setSelectedRequest}
        />
      )}
    </main>
  );
}
