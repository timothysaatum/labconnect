import { useFetchLabRequestsReceived } from "@/api/queries";
import React, { useId } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { calcAge } from "@/util/ageCalculate";
import { ChevronLeft, ChevronRight, MoreVertical } from "lucide-react";
import { Button } from "./ui/button";
import moment from "moment";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import RejectSample from "./dashboard/rejectSample";
import UploadResults from "./dashboard/resultupload";

const SampleDetails = () => {
  const { branchId, sampleId } = useParams();
  const { data, isPending, isError } = useFetchLabRequestsReceived(branchId);

  if (isPending) return <div>Loading...</div>;
  if (isError) {
    toast.error("An error occurred. Please try again");
    return <div className="pl-14">Error...</div>;
  }

  // transforming sample.id to a string

  let sample = data?.data?.find((sample) => {
    return sample.id.toString() === sampleId;
  });
  let index = data?.data?.findIndex((sample) => {
    return sample.id.toString() === sampleId;
  });
  if (!sample) {
    toast.error("No sample found with the given id");
    return <div className="pl-14">Sample not found</div>;
  }
  const NextLink = () => {
    if (index + 1 < data?.data?.length) {
      return `/dashboard/overview/samples/received/${branchId}/${data?.data[index + 1].id}`;
    } else {
      return `/dashboard/overview/samples/received/${branchId}/${data?.data[0].id}`;
    }
  };

  const prevLink = () => {
    if (index - 1 >= 0) {
      return `/dashboard/overview/samples/received/${branchId}/${data?.data[index - 1].id}`;
    } else {
      return `/dashboard/overview/samples/received/${branchId}/${data?.data[data?.data.length - 1].id}`;
    }
  };
  return (
    <main className="sm:pl-14 mx-4 py-10">
      <Card className="max-w-5xl mx-auto">
        <CardHeader className="flex justify-between flex-row border-b-2 pb-4">
          <div className="flex flex-col gap-2">
            <CardTitle className="text-xl">
              {sample?.id} - {sample?.patient_name}
            </CardTitle>
            <CardDescription className="">
              displaying details of the sample with id {sample?.id}
            </CardDescription>
          </div>
          <div className="flex gap-2 flex-col items-end">
            <div>
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="outline" className="h-8 w-8">
                      <MoreVertical className="h-3.5 w-3.5" />
                      <span className="sr-only">More</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => navigator.clipboard.writeText(sample?.id)}
                    >
                      Copy payment ID
                    </DropdownMenuItem>
                    <Link
                      to={`/dashboard/overview/samples/received/${sample?.id}`}
                    ></Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>View Laboratory</DropdownMenuItem>
                    <DropdownMenuItem>
                      <a
                        href={sample?.attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Attachment
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <UploadResults />
                    <RejectSample id={sample?.id} />
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground text-xs">
                priority level:
              </span>
              <div className="flex  items-center gap-2">
                <span className="ml-2 capitalize text-[14px]">
                  {sample?.priority}
                </span>
                <div
                  className={`w-3 h-3 rounded-full ${sample?.priority === "Normal" ? "bg-yellow-600" : "bg-red-600 animate-pulse"}`}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-[300px_1fr] gap-4">
            <div className="col-span-1 space-y-6 md:px-4 px-2 md:py-8 py-4 rounded-lg my-2 tracking-wider">
              <div className="border-[1px] p-4 rounded-3xl bg-muted/10">
                <CardTitle className="text-sm tracking-wider underline underline-offset-2 max-md:text-center">
                  Patient Details
                </CardTitle>
                <div className="space-y-2 max-md:flex items-center justify-evenly max-md:py-2 ">
                  <div className="">
                    <span className="text-xs capitalize text-muted-foreground">
                      Name
                    </span>{" "}
                    :{" "}
                    <span className=" md:ml-5 capitalize text-[12px]">
                      {sample?.patient_name}
                    </span>
                  </div>
                  <div className="">
                    <span className="text-xs capitalize text-muted-foreground">
                      Age
                    </span>{" "}
                    :{" "}
                    <span className="md:ml-5 capitalize text-[12px]">
                      {calcAge(sample?.patient_age)}
                    </span>
                  </div>
                  <div className="">
                    <span className="text-xs capitalize text-muted-foreground">
                      Gender
                    </span>{" "}
                    :{" "}
                    <span className="capitalize text-[12px]">
                      {sample?.patient_sex}
                    </span>
                  </div>
                </div>
                {sample?.attachment && (
                  <div className="text-center md:text-end">
                    <a
                      href={sample?.attachment}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-blue-700 text-xs"
                    >
                      View attachment
                    </a>
                  </div>
                )}
              </div>
              <div className="border-[1px] p-4 rounded-3xl bg-muted/10">
                <CardTitle className="text-sm tracking-wider underline underline-offset-2 max-md:text-center">
                  Referor Details
                </CardTitle>
                <div className="space-y-2 max-md:flex items-center justify-evenly max-md:py-2 flex-wrap gap-2">
                  <div className="">
                    <span className="text-xs capitalize text-muted-foreground">
                      facilty
                    </span>{" "}
                    :{" "}
                    <span className="capitalize text-[12px]">
                      {sample?.referring_facility}
                    </span>
                  </div>
                  <div className="">
                    <span className="text-xs capitalize text-muted-foreground">
                      Facility Type
                    </span>{" "}
                    :{" "}
                    <span className="capitalize text-[12px]">
                      {sample?.facility_type}
                    </span>
                  </div>
                  <div className="">
                    <span className="text-xs capitalize text-muted-foreground">
                      Name of referor
                    </span>{" "}
                    :{" "}
                    <span className="capitalize text-[12px]">
                      {sample?.sender_full_name}
                    </span>
                  </div>
                  <div className="">
                    <span className="text-xs capitalize text-muted-foreground">
                      Referor's Email
                    </span>{" "}
                    :{" "}
                    <span className="capitalize text-[12px]">
                      {sample?.sender_email}
                    </span>
                  </div>
                  <div className="">
                    <span className="text-xs capitalize text-muted-foreground">
                      Referor's Contact
                    </span>{" "}
                    :{" "}
                    <span className="capitalize text-[12px]">
                      {sample?.sender_phone}
                    </span>
                  </div>
                </div>
              </div>
              <div className="border-[1px] p-4 rounded-3xl bg-muted/10">
                <CardTitle className="text-sm tracking-wider underline underline-offset-2 max-md:text-center">
                  Payment Details
                </CardTitle>
                <div className="space-y-2 max-md:flex items-center justify-evenly max-md:py-2 flex-wrap gap-2">
                  <div className="">
                    <span className="text-xs capitalize text-muted-foreground">
                      Payment Status
                    </span>{" "}
                    :{" "}
                    <span
                      className={`capitalize text-[12px] ${sample?.payment_status === "Paid" ? "text-green-400" : ""}`}
                    >
                      {sample?.payment_status}
                    </span>
                  </div>
                  <div className="">
                    <span className="text-xs capitalize text-muted-foreground">
                      Payment Method
                    </span>{" "}
                    :{" "}
                    <span className="capitalize text-[12px]">
                      {sample?.payment_mode}
                    </span>
                  </div>
                  <div className="">
                    <span className="text-xs capitalize text-muted-foreground">
                      Amount Paid
                    </span>{" "}
                    :{" "}
                    <span className="capitalize text-[12px]">
                      GH{`\u20B5`} 34.00
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-end">
                  <span className="text-xs capitalize text-muted-foreground">
                    Sample Status:
                  </span>{" "}
                  :{" "}
                  <span className="ml-5 capitalize text-[12px]">
                    {" "}
                    {sample?.sample_status}
                  </span>
                </div>
                <div className="text-end">
                  <span className="text-xs capitalize text-muted-foreground">
                    Request Date
                  </span>{" "}
                  :{" "}
                  <span className="ml-5 capitalize text-[12px]">
                    {" "}
                    {moment(sample?.date_created).format("DD/MM/YYYY hh:mm A")}
                  </span>
                </div>
              </div>
            </div>
            <div className="px-4 flex flex-col gap-4">
              {sample?.clinical_history && (
                <div className=" p-4 ">
                  <CardTitle className="text-lg underline underline-offset-2 pb-4">
                    {" "}
                    Clinical History
                  </CardTitle>
                  <div>
                    <p className="first-letter:uppercase text-[15px]">
                      {sample?.clinical_history}
                    </p>
                  </div>
                </div>
              )}
              <div className="border-[1px] p-4 flex-1 rounded-md ">
                <CardTitle className="text-lg underline underline-offset-2 py-4">
                  Tests Requested
                </CardTitle>
                <div>
                  <ul className="flex flex-col gap-3">
                    {sample?.tests?.map((test) => (
                      <li className="text-[14px] capitalize" key={test}>
                        <ChevronRight className="inline w-4 h-34 mr-2 text-muted" />
                        {test}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-end">
          <div className="my-4 flex gap-4">
            <Link to={prevLink()}>
              <Button className="" variant="outline" size="icon">
                <ChevronLeft />
              </Button>
            </Link>
            <Link to={NextLink()}>
              <Button variant="outline" size="icon">
                <ChevronRight />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SampleDetails;
