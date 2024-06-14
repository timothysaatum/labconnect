import { ChevronDown, RefreshCcw } from "lucide-react";
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
import { useMediaQuery } from "@/hooks/use-media-query";
import StackedCardsOverview from "../overviewcards";
import SampleDetails from "@/components/dashboard/sampleDetails";

function EmptyLab() {
  return (
    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
      <div className="flex flex-col items-center  text-center py-16 ">
        <h3 className="text-xl font-semibold ">
          You have received no samples yet
        </h3>
        <p className="text-sm text-muted-foreground">
          you will see requestsReceived made to your lab here{" "}
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
  const [requestsReceived, setTableRequestsReceived] = useState([]);
  const [requestsSent, setTableRequestsSent] = useState([]);
  const [checked, setChecked] = useState();
  const requestColumns = useRequestLabColumns();
  const [selectedSamples, setSelectedSamples] = useState();
  const [selected, setSelected] = useState();
  const {
    isError,
    data: receivedRequests,
    isLoading,
    isRefetching,
    refetch,
    isRefetchError,
    dataUpdatedAt,
  } = useFetchLabRequests();

  const {
    data: sentRequests,
    isFetching: sentfetching,
    isError: sentError,
    isRefetchError: sentFetchError,
    refetch: sentRefetch,
    isRefetching: sentrefetching,
  } = useFetchLabRequestsSent(checked);

  useEffect(() => {
    if (selectedSamples) {
      setSelected(
        receivedRequests?.data?.find((sample) => {
          return sample.id === selectedSamples;
        })
      );
    } else {
      setSelected(null);
    }
  }, [selectedSamples]);

  const index = receivedRequests?.data?.findIndex(
    (sample) => sample.id === selected?.id
  );
  const nextSample = () => {
    if (index < tests?.data.length - 1) {
      setSelectedSamples(receivedRequests?.data[index + 1]?.id);
    } else {
      setSelectedSamples(receivedRequests?.data[0]?.id);
    }
  };
  const prevSample = () => {
    if (index < receivedRequests?.data.length - 1) {
      setSelectedSamples(receivedRequests?.data[index + 1]?.id);
    } else {
      setSelectedSamples(receivedRequests?.data[0]?.id);
    }
  };

  const {
    data: branches,
    isLoading: branchesLoading,
    isError: branchesError,
  } = useFetchUserBranches();

  useEffect(() => {
    setChecked(branches?.data[0]?.id);
  }, [branches?.data]);

  useEffect(() => {
    if (receivedRequests) {
      setTableRequestsReceived(
        receivedRequests.data.map((request) => {
          return {
            id: request.id,
            referring_facility: request.referring_facility,
            Patient: request.patient_name,
            referring_facility_phone: request.sender_phone,
            referror_name: request.sender_full_name,
            Patient_age: calcAge(request.patient_age),
            Sent_by: request.send_by,
            date: request.date_created,
          };
        })
      );
    }
  }, [receivedRequests]);
  useEffect(() => {
    if (sentRequests) {
      setTableRequestsSent(
        sentRequests?.data?.map((request) => {
          return {
            id: request.id,
            referring_facility: request.referring_facility,
            Patient: request.patient_name,
            referring_facility_phone: request.sender_phone,
            referror_name: request.sender_full_name,
            Patient_age: calcAge(request.patient_age),
            Sent_by: request.send_by,
            date: request.date_created,
          };
        })
      );
    }
  }, [sentRequests]);

  const isDesktop = useMediaQuery("(min-width: 768px)");
  return (
    <main className="px-4 sm:pl-16   grid grid-cols-12 gap-x-4">
      <div
        className={`${
          selected ? "col-span-12 lg:col-span-8" : "col-span-12"
        } flex flex-col gap-8`}
      >
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4 sticky top-2 left-0 ">
          <RequestDialog className="w-full shadow-sm col-span-3 " />
          {isDesktop && !selected ? (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between p-4">
                  <CardTitle className="text-xs font-medium tracking-wide">
                    Samples Received:
                  </CardTitle>
                  <div className="text-sm font-bold">+2350</div>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between p-4">
                  <CardTitle className="text-xs font-medium tracking-wide">
                    Samples Sent:
                  </CardTitle>
                  <div className="text-sm font-bold">+12,234</div>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between p-4">
                  <CardTitle className="text-xs font-medium tracking-wide">
                    proccessed today:
                  </CardTitle>
                  <div className="text-sm font-bold">+573</div>
                </CardHeader>
              </Card>
            </>
          ) : (
            <StackedCardsOverview selected={selected} />
          )}
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
                        <span className="text-muted-foreground hidden sm:inline">Viewing:</span>{" "}
                        {
                          branches?.data?.find(
                            (branch) => branch.id === checked
                          )?.name
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
                          {branch.name}
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
                  ) : receivedRequests?.data.length < 1 ? (
                    <EmptyLab />
                  ) : (
                    <DataTable
                      data={requestsReceived}
                      error={isError}
                      loading={isLoading}
                      columnDef={requestColumns}
                      title={"Requests"}
                      filter={"Patient"}
                      selected={selectedSamples}
                      setSelected={setSelectedSamples}
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
                      <Button variant="outline" className="flex gap-2 ">
                        <span className="hidden sm:inline text-muted-foreground">Viewing:</span>{" "}
                        {
                          branches?.data?.find(
                            (branch) => branch.id === checked
                          )?.name
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
                          {branch.name}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent>
                  {sentfetching ? (
                    <LoadingLab />
                  ) : sentError ? (
                    <ErrorLab
                      refetch={sentRefetch}
                      isRefetchError={sentFetchError}
                      isRefetching={sentrefetching}
                    />
                  ) : receivedRequests?.data.length < 1 ? (
                    <EmptyLab />
                  ) : (
                    <DataTable
                      data={requestsSent}
                      error={sentError}
                      loading={sentfetching}
                      columnDef={requestColumns}
                      title={"Requests"}
                      filter={"Patient"}
                      selected={selectedSamples}
                      setSelected={setSelectedSamples}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      {selected && (
        <div className="hidden lg:block col-span-4">
          <SampleDetails
            selected={selected}
            setSelectedSamples={setSelectedSamples}
            updatedAt={dataUpdatedAt}
            nextSample={nextSample}
            prevSample={prevSample}
          />
        </div>
      )}
    </main>
  );
}
