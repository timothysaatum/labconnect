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
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

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
    <main className="pl-14 mx-4 py-10">
      <Card className="max-w-5xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl">
            {sample?.id} - {sample?.patient_name}
          </CardTitle>
          <CardDescription className="border-b-2 pb-4">
            displaying details of the sample with id {sample?.id}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-[300px_1fr] gap-4 divide-x-2">
            <div className="col-span-1 space-y-6 px-4 bg-muted/10 py-8 rounded-lg">
              <div className="border-[1px] p-4 rounded-3xl space-y-2">
                <CardTitle className="text-md underline underline-offset-2">
                  Patient Details
                </CardTitle>
                <div className="">
                  <span className="text-xs capitalize text-muted-foreground">
                    Name
                  </span>{" "}
                  :{" "}
                  <span className=" ml-5 capitalize text-[12px]">
                    {sample?.patient_name}
                  </span>
                </div>
                <div className="">
                  <span className="text-xs capitalize text-muted-foreground">
                    Age
                  </span>{" "}
                  :{" "}
                  <span className="ml-5 capitalize text-[12px]">
                    {calcAge(sample?.patient_age)}
                  </span>
                </div>
                <div className="">
                  <span className="text-xs capitalize text-muted-foreground">
                    Gender
                  </span>{" "}
                  :{" "}
                  <span className="ml-5 capitalize text-[12px]">
                    {sample?.patient_sex}
                  </span>
                </div>
                {sample?.attachment && (
                  <div className="text-end">
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
              <div className="border-[1px] p-4 rounded-3xl space-y-2">
                <CardTitle className="text-md underline underline-offset-2">
                  Referor Details
                </CardTitle>
                <div className="">
                  <span className="text-xs capitalize text-muted-foreground">
                    facilty
                  </span>{" "}
                  :{" "}
                  <span className=" ml-5 capitalize text-[12px]">
                    {sample?.referring_facility}
                  </span>
                </div>
                <div className="">
                  <span className="text-xs capitalize text-muted-foreground">
                    Facility Type
                  </span>{" "}
                  :{" "}
                  <span className="ml-5 capitalize text-[12px]">
                    {sample?.facility_type}
                  </span>
                </div>
                <div className="">
                  <span className="text-xs capitalize text-muted-foreground">
                    Name of referor
                  </span>{" "}
                  :{" "}
                  <span className="ml-5 capitalize text-[12px]">
                    {sample?.sender_full_name}
                  </span>
                </div>
                <div className="">
                  <span className="text-xs capitalize text-muted-foreground">
                    referor email
                  </span>{" "}
                  :{" "}
                  <span className="ml-5 capitalize text-[12px]">
                    {sample?.sender_email}
                  </span>
                </div>
                <div className="">
                  <span className="text-xs capitalize text-muted-foreground">
                    referor Contact
                  </span>{" "}
                  :{" "}
                  <span className="ml-5 capitalize text-[12px]">
                    {sample?.sender_phone}
                  </span>
                </div>
              </div>
              <div className="border-[1px] p-4 rounded-3xl space-y-2">
                <CardTitle className="text-md underline underline-offset-2">
                  Payment Details
                </CardTitle>
                <div className="">
                  <span className="text-xs capitalize text-muted-foreground">
                    Payment Status
                  </span>{" "}
                  :{" "}
                  <span
                    className={`ml-5 capitalize text-[12px] ${sample?.payment_status === "Paid" ? "text-green-400" : ""}`}
                  >
                    {sample?.payment_status}
                  </span>
                </div>
                <div className="">
                  <span className="text-xs capitalize text-muted-foreground">
                    Payment Method
                  </span>{" "}
                  :{" "}
                  <span className="ml-5 capitalize text-[12px]">
                    {sample?.payment_mode}
                  </span>
                </div>
              </div>
            </div>
            <div className="px-4 flex flex-col gap-4">
              {sample?.clinical_history && (
                <div className="border-b-[1px] rounded-b-sm p-4 ">
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
