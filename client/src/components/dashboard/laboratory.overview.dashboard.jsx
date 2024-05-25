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
import {
  useFetchLabRequests,
  useFetchLabRequestsSent,
  useFetchUserBranches,
} from "@/api/queries";
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
        <h3 className="text-xl font-semibold text-destructive ">
          An Error has Occured
        </h3>
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
    isError: sentError,
    data: sentrequests,
    isLoading: sentRequestsLoading,
    refetch: sentRequestsRefetch,
  } = useFetchLabRequestsSent();

  const {
    data: branches,
    isLoading: branchesLoading,
    isError: branchesError,
  } = useFetchUserBranches();
  useEffect(() => {
    setChecked(branches?.data[0]?.id);
  }, [branches?.data]);
  useEffect(() => {
    if (allrequests) {
      setTableRequests(
        allrequests.data.map((request) => {
          return {
            sent_by: request.from_lab,
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
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4 sticky top-0 left-0 bg-background bg-opacity-20 py-4 px-4">
          <RequestDialog className="max-md:w-full shadow-sm h-14" size="lg" />
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium tracking-wide">
                Samples Received:
              </CardTitle>
              <div className="text-sm font-bold">+2350</div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium tracking-wide">
                Samples Sent:
              </CardTitle>
              <div className="text-sm font-bold">+12,234</div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium tracking-wide">
                proccessed today:
              </CardTitle>
              <div className="text-sm font-bold">+573</div>
            </CardHeader>
          </Card>
        </div>
        <div className="">
          <Tabs defaultValue="Received">
            <TabsList className="max-w-full">
              <TabsTrigger value="Received">Received Samples</TabsTrigger>
              <TabsTrigger value="Sent Samples">Sent Samples</TabsTrigger>
            </TabsList>
            <TabsContent value="Received">
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
                        <span className="text-muted-foreground">Viewing:</span>{" "}
                        {
                          branches?.data?.find(
                            (branch) => branch.id === checked
                          )?.branch_name
                        }
                        <ChevronDown className="w-4 h-4 ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {branches?.data?.map((branch) => (
                        <DropdownMenuCheckboxItem
                          key={branch.id}
                          checked={checked === branch.id}
                          onCheckedChange={() => setChecked(branch.id)}
                        >
                          {branch.branch_name}
                        </DropdownMenuCheckboxItem>
                      ))}
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
            <TabsContent value="Sent Samples">
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
                        <span className="text-muted-foreground">Viewing:</span>{" "}
                        {
                          branches?.data?.find(
                            (branch) => branch.id === checked
                          )?.branch_name
                        }
                        <ChevronDown className="w-4 h-4 ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {branches?.data?.map((branch) => (
                        <DropdownMenuCheckboxItem
                          key={branch.id}
                          checked={checked === branch.id}
                          onCheckedChange={() => setChecked(branch.id)}
                        >
                          {branch.branch_name}
                        </DropdownMenuCheckboxItem>
                      ))}
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
        </div>
      </div>
    </main>
  );
}
