import { BellRing, ListFilter, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RequestDialog from "./requestdialog";
import { useFetchRequests } from "@/api/queries";
import { useState } from "react";
import RequestDetails from "./requestDetails";

export default function DashboardOverview() {
  const [selectedRequest, setSelectedRequest] = useState(null);

  const handleRequestSelect = (request) => {
    if (selectedRequest === request) {
      setSelectedRequest(null);
      return;
    }
    setSelectedRequest(request);
  };
  const fetchRequest = useFetchRequests();
  const { isError, data, isLoading } = fetchRequest;
  return (
    <main className="grid gap-4 p-4 sm:px-6 sm:pl-20 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div
        className={`grid auto-rows-max items-start gap-4 md:gap-8 ${
          selectedRequest ? "lg:col-span-2" : "lg:col-span-3"
        }`}
      >
        <div className="max-w-full grid gap-4 grid-cols-1 md:grid-cols-4">
          <Card className="md:col-span-2">
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
          <Card className="col-span-2 hidden md:block px-4">
            <CardHeader className="border-b px-2">
              <CardTitle className="flex justify-between">
                Notifications{" "}
                <span>
                  {" "}
                  <BellRing />{" "}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent></CardContent>
          </Card>
        </div>
        <Tabs defaultValue="week">
          <div className="flex items-center">
            <TabsList>
              <TabsTrigger value="week">Today</TabsTrigger>
              <TabsTrigger value="month">This week</TabsTrigger>
              <TabsTrigger value="year">This month</TabsTrigger>
            </TabsList>
            <div className="ml-auto flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 gap-1 text-sm"
                  >
                    <ListFilter className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only">Filter</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem checked>
                    Fulfilled
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Declined</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Refunded</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <TabsContent value="week">
            <Card>
              <CardHeader className="px-7 flex flex-row gap-10">
                <div>
                  <CardTitle>Requests</CardTitle>
                  <CardDescription>Recent Requests you made</CardDescription>
                </div>
                <div className="relative ml-auto flex-1 md:grow-0 hidden sm:block">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search Requests..."
                    className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                  />
                </div>
              </CardHeader>
              <CardContent>
                {isError ? (
                  <div className="w-full h-48 border-2 border-dashed grid place-items-center tracking-wider">
                    <h2 className="text-xl text-destructive">
                      Error loading request
                    </h2>
                    <Button variant="outline">Try Again</Button>
                  </div>
                ) : isLoading ? (
                  <div>loaing ...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Sample Id</TableHead>
                        <TableHead>Patient</TableHead>
                        <TableHead className="hidden sm:table-cell">
                          Laboratory
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Date
                        </TableHead>
                        <TableHead className="hidden sm:table-cell">
                          Status
                        </TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data?.data?.map((request) => (
                        <TableRow
                          className={`${
                            selectedRequest === request ? "bg-accent" : null
                          } cursor-pointer`}
                          key={request.id}
                          onClick={() => handleRequestSelect(request)}
                        >
                          <TableCell>
                            <div className="font-medium">{request.id}</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">
                              {request.name_of_patient.charAt(0).toUpperCase() +
                                request.name_of_patient.slice(1)}
                            </div>
                            {/* <div className="hidden text-sm text-muted-foreground md:inline">
                                liam@example.com
                              </div> */}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            {request.lab}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {request.date_modified}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge className="text-xs" variant="secondary">
                              Fulfilled
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">$250.00</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
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
