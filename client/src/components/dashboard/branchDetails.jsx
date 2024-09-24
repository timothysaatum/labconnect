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

const BranchDetails = ({ selected, setSelected, nextTest, prevTest }) => {
  console.log(selected);
  return (
    <FormWrapper className={cn("col-span-4")}>
      <Card className="text-wrap overflow-hidden break-all">
        <CardHeader className="bg-muted/50">
          <div className="flex flex-row items-start">
            <div className="grid gap-0.5">
              <CardTitle className="group flex items-center gap-2 text-lg">
                <p className="text-sm"> {selected?.name}</p>
              </CardTitle>
              <CardDescription>
                Date added: {moment(selected?.date_created).format("MMM Do YY")}
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
                onClick={() => setSelected(null)}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 text-sm">
          <div className="grid gap-6 ">
            <div className="font-semibold">Branch Details</div>
            <ul className="grid gap-3">
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Branch name</span>
                <span>
                  {selected?.branch_name || selected?.town + " Branch"}
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Branch manager</span>
                <span className="capitalize">{selected?.branch_manager}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Branch Phone</span>
                <span>{selected?.phone}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Branch email</span>
                <span>{selected?.email}</span>
              </li>
            </ul>
            <Separator className="my-2" />
            <div className="grid gap-3">
              <div className="font-semibold">Branch Location</div>
              <ul className="grid gap-3">
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Region</span>
                  <span>{selected?.region}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Town</span>
                  <span className="capitalize">{selected?.town}</span>
                </li>
              </ul>
            </div>
          </div>
          <Separator className="my-2" />
          <div className="grid gap-3">
            <div className="font-semibold">Address</div>
            <ul>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Region</span>
                <span>{selected?.digital_address}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Postal Address</span>
                <span className="capitalize">{selected?.postal_address}</span>
              </li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
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

export default BranchDetails;
