import {
  Activity,
  ChevronDown,
  CreditCard,
  RefreshCcw,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import RequestDialog from "./requestdialog";
import { useFetchLabRequests, useFetchUserBranches } from "@/api/queries";
import { useEffect, useState } from "react";
import { DataTable } from "../data-table";
import { useRequestLabColumns } from "../columns/RequestColumn";
import { calcAge } from "@/util/ageCalculate";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

function EmptyLab() {
  return (
    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
      <div className="flex flex-col items-center  text-center py-16 ">
        <h3 className="text-xl font-semibold ">
          You have received no samples yet
        </h3>
        <p className="text-sm text-muted-foreground">
          you will see requests made to your lab here{" "}
        </p>
      </div>
    </div>
  );
}
function LoadingLab() {
  return (
    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
      <div className="flex flex-col items-center  text-center py-16 ">
        {/* <h3 className="text-xl font-semibold ">An Error has Occured</h3> */}
        <p className="text-sm text-muted-foreground">loading...</p>
      </div>
    </div>
  );
}
function ErrorLab({ refetch }) {
  return (
    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
      <div className="flex flex-col items-center  text-center py-16 ">
        <h3 className="text-xl font-semibold ">An Error has Occured</h3>
        <p className="text-sm text-muted-foreground">
          check your internet connection and try again{" "}
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => {
            refetch();
          }}
        >
          Try Again{" "}
          <RefreshCcw className="h-4 w-4 ml-2 text-muted-foreground" />
        </Button>
        <p className="text-muted-foreground text-xs mt-2">
          If error persists{" "}
          <Link className="hover:underline underline-offset-2">Contact us</Link>
        </p>
      </div>
    </div>
  );
}

export default function LaboratoryDashboardOverview() {
  const [requests, setTableRequests] = useState([]);
  const [checked, setChecked] = useState("Sent Samples");
  const requestColumns = useRequestLabColumns();
  const {
    isError,
    data: allrequests,
    isLoading,
    isRefetching,
    refetch,
    isRefetchError,
  } = useFetchLabRequests();

  const {
    data: branches,
    isLoading: branchesLoading,
    isError: branchesError,
  } = useFetchUserBranches();
  useEffect(() => {
    if (allrequests) {
      setTableRequests(
        allrequests.data.map((request) => {
          return {
            id: request.id,
            Patient: request.name_of_patient,
            Patient_age: calcAge(request.patient_age),
            Sent_by: request.send_by,
            date: request.date_created,
          };
        })
      );
    }
  }, [allrequests]);
  return (
    <main className="px-4 sm:pl-16 ">
      <div className="lg:col-span-3 flex flex-col gap-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card className="bg-transparent shadow-none ring-0 border-none p-0">
            <RequestDialog
              className="w-full h-16 font-medium shadow-sm"
              size="lg"
            />
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Subscriptions
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+2350</div>
              <p className="text-xs text-muted-foreground">
                +180.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sales</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12,234</div>
              <p className="text-xs text-muted-foreground">
                +19% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Now</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+573</div>
              <p className="text-xs text-muted-foreground">
                +201 since last hour
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="">
          {branches?.data.length > 1 ? (
            <Tabs defaultValue={branches?.data[0].branch_name}>
              <TabsList className="max-w-full">
                {branches?.data.map((branch) => (
                  <TabsTrigger
                    key={branch.branch_name}
                    value={branch.branch_name}
                  >
                    {branch.branch_name}
                  </TabsTrigger>
                ))}
              </TabsList>
              <TabsContent value="Kumasi Branch">
                <Card>
                  <CardHeader className="flex flex-row">
                    <div className="flex-1">
                      <CardTitle>Samples</CardTitle>
                      <CardDescription>
                        {checked === "Sent Samples"
                          ? "Samples you have sent to other labs"
                          : "Samples you have received "}
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="flex gap-2">
                          <span className="text-muted-foreground">
                            Viewing:
                          </span>{" "}
                          {checked}
                          <ChevronDown className="w-4 h-4 ml-2" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuCheckboxItem
                          checked={checked === "Sent Samples"}
                          onCheckedChange={() => setChecked("Sent Samples")}
                        >
                          Sent Samples
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={checked === "Received Samples"}
                          onCheckedChange={() => setChecked("Received Samples")}
                        >
                          Received Samples
                        </DropdownMenuCheckboxItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <LoadingLab />
                    ) : isError ? (
                      <ErrorLab
                        refetch={refetch}
                        isRefetchError={isRefetchError}
                        isRefetching={isRefetching}
                      />
                    ) : allrequests?.data.length < 1 ? (
                      <EmptyLab />
                    ) : (
                      <DataTable
                        data={requests}
                        error={isError}
                        loading={isLoading}
                        columnDef={requestColumns}
                        title={"Requests"}
                        filter={"Patient"}
                      />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Requests</CardTitle>
                <CardDescription>Recent Requests you made</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <LoadingLab />
                ) : isError ? (
                  <ErrorLab
                    refetch={refetch}
                    isRefetchError={isRefetchError}
                    isRefetching={isRefetching}
                  />
                ) : allrequests?.data.length < 1 ? (
                  <EmptyLab />
                ) : (
                  <DataTable
                    data={requests}
                    error={isError}
                    loading={isLoading}
                    columnDef={requestColumns}
                    title={"Requests"}
                    filter={"Patient"}
                  />
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}
