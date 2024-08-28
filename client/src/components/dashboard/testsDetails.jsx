import { ChevronLeft, ChevronRight, Copy, MoreVertical, X } from "lucide-react";

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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import moment from "moment";
import FormWrapper from "../FormWrapper";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";


const TestDetails = ({
  selected,
  setSelectedTests,
  updatedAt,
  nextTest,
  prevTest,
}) => {

  return (
    <FormWrapper className={cn("col-span-4")}>
      <Card className="text-wrap overflow-hidden break-all">
        <CardHeader className="bg-muted/50">
          <div className="flex flex-row items-start">
            <div className="grid gap-0.5">
              <CardTitle className="group flex items-center gap-2 text-lg">
                <p className="text-sm">Test name: {selected?.name}</p>
              </CardTitle>
              <CardDescription>
                Date added: {moment(selected?.date_added).format("MMM Do YY")}
              </CardDescription>
            </div>
            <div className="ml-auto flex items-center gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="outline" className="h-8 w-8">
                    <MoreVertical className="h-3.5 w-3.5" />
                    <span className="sr-only">More</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit and Update</DropdownMenuItem>
                  <DropdownMenuItem>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                className="h-8 w-8"
                size="icons"
                variant="outline"
                onClick={() => setSelectedTests(null)}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 text-sm">
          <div className="grid gap-6 ">
            <div className="font-semibold">Test Details</div>
            <ul className="grid gap-3">
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Test name</span>
                <span>{selected?.name}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Test Status</span>
                <span className="capitalize">{selected?.test_status}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Price</span>
                <span>
                  GH{`\u20B5`}
                  {selected?.price}
                </span>
              </li>
              {selected?.discount_price * 1 > 0 ? (
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Applied Discount
                  </span>
                  <span>
                    GH{`\u20B5`}
                    {selected?.discount_price}
                  </span>
                </li>
              ) : null}
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Turn around time</span>
                <span>{selected?.turn_around_time}</span>
              </li>
            </ul>
            <Separator className="my-2" />
            <div className="grid gap-3">
              <div className="font-semibold">Patient Preparation</div>
              <div className="">{selected?.patient_preparation}</div>
            </div>
          </div>
          <Separator className="my-2" />
          <div className="grid gap-3">
            <div className="font-semibold">Sample Requirements</div>
            <Accordion type="single" collapsible className="w-full max-">
              {selected?.sample_type?.map((sample, index) => (
                <AccordionItem value={"item" + index} key={index}>
                  <AccordionTrigger className="hover:no-underline text-sm  text-start">
                    {sample?.sample_name}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 border-b-[1px] pb-2">
                      <p className="text-xs uppercase">
                        <span className="capitalize mr-2">Sample Type:</span>
                        {sample.sample_name}
                      </p>
                      <p className="text-xs uppercase">
                        <span className="capitalize mr-2">
                          Collection time:
                        </span>
                        {sample.collection_time}
                      </p>
                      <p className="text-xs uppercase">
                        <span className="capitalize mr-2">
                          collection Procedure:
                        </span>
                        {sample.collection_procedure}
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </CardContent>
        <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
          <div className="text-xs text-muted-foreground">
            Updated{" "}
            <time dateTime={moment(updatedAt).format("YYYY MM DD HH:mm:ss")}>
              {moment(updatedAt).format("MMM Do YYYY HH:mm:ss")}
            </time>
          </div>
          <Pagination className="ml-auto mr-0 w-auto">
            <PaginationContent>
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-6 w-6"
                  onClick={prevTest}
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
                  onClick={nextTest}
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                  <span className="sr-only">Next Order</span>
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      </Card>
    </FormWrapper>
  );
};

export default TestDetails;
