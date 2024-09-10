import {
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  MoreVertical,
  Paperclip,
  Truck,
  X,
} from "lucide-react";

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
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import FormWrapper from "../FormWrapper";
import { calcAge } from "@/util/ageCalculate";
import moment from "moment";

const RequestDetails = ({
  selected,
  setSelected,
  updatedAt,
  prevSample,
  nextSample,
}) => {
  return (
    <FormWrapper>
      <div>
        <Card className="overflow-hidden">
          <CardHeader className="bg-muted/50">
            <div className="flex flex-row items-start">
              <div className="grid gap-0.5">
                <CardTitle className="group flex items-center gap-2 text-lg whitespace-nowrap">
                  Sample Id: {selected.id}
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <Copy className="h-3 w-3" />
                    <span className="sr-only">Copy Order ID</span>
                  </Button>
                </CardTitle>
                <CardDescription className="whitespace-nowrap">
                  Date:{" "}
                  {moment(selected?.date_created).format("DD / MM / YYYY")}
                </CardDescription>
              </div>
              <div className="ml-auto flex items-center gap-1">
                {selected?.attachment && (
                  <Button size="sm" variant="outline" className="h-8 gap-1">
                    <Paperclip className="h-3.5 w-3.5" />
                    <a
                      className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap"
                      href={selected.attachment}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      View Attachment
                    </a>
                  </Button>
                )}
                
                <Button
                  className="h-8 w-8"
                  size="icons"
                  variant="outline"
                  onClick={() => setSelected()}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 text-sm">
            <div className="grid gap-3">
              <div className="font-semibold">Patient Details</div>
              <ul className="grid gap-3">
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Patient name</span>
                  <span>{selected.patient_name}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Patient age</span>
                  <span>{calcAge(selected.patient_age)}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Patient sex</span>
                  <span>{selected.patient_sex}</span>
                </li>
              </ul>

              <Separator className="my-2" />
              <div className="grid gap-4">
                <div className="grid gap-3">
                  <div className="font-semibold">Tests Requested</div>
                  <ul className="grid gap-2 not-italic text-end ">
                    {selected?.tests?.map((test, index) => (
                      <li key={index}>{test}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="font-semibold">Referror</div>
            <ul className="grid gap-3">
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Referring Facility
                </span>
                <span className="text-end">{selected.referring_facility}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Sender's name</span>
                <span className="text-end">{selected.sender_full_name}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Sender's email</span>
                <span className="text-end">{selected.sender_email}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Sender's Contact</span>
                <span className="text-end">{selected.sender_phone}</span>
              </li>
            </ul>
            <Separator className="my-4" />
            <div className="grid gap-3">
              <div className="font-semibold">Payment details</div>
              <dl className="grid gap-3">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Payment Mode</dt>
                  <dd>{selected?.payment_mode}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Payment Status</dt>
                  <dd>{selected?.payment_status}</dd>
                </div>
              </dl>
            </div>
          </CardContent>
          <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
            <div className="text-xs text-muted-foreground">
              Updated <time dateTime="2023-11-23">November 23, 2023</time>
            </div>
            <Pagination className="ml-auto mr-0 w-auto">
              <PaginationContent>
                <PaginationItem>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-6 w-6"
                    onClick={prevSample}
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    <span className="sr-only">Previous Order</span>
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-6 w-6"
                    onClick={nextSample}
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                    <span className="sr-only">Next Order</span>
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardFooter>
        </Card>
      </div>
    </FormWrapper>
  );
};

export default RequestDetails;
