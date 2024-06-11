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
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import moment from "moment";
import { Label } from "../ui/label";

const formVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
    transition: {
      ease: "easeOut",
    },
  },
};

const SampleDetails = ({
  selected,
  setSelectedSamples,
  updatedAt,
  prevSample,
  nextSample,
}) => {
  return (
    <motion.div
      variants={formVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={cn("col-span-4")}
    >
      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/50">
          <div className="flex flex-row items-start">
            <div className="grid gap-0.5">
              <CardTitle className="group flex items-center gap-2 text-lg">
                <p className="text-sm">Sample ID: {selected?.id}</p>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <Copy className="h-3 w-3" />
                  <span className="sr-only">Copy Sample ID</span>
                </Button>
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
                onClick={() => setSelectedSamples(null)}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 text-sm">
          <div className="grid gap-6 ">
            <div className="font-semibold">Sample Details</div>
            <em>Patient</em>
            <ul className="grid gap-3">
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Test name</span>
                <span>{selected?.name}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Accepted Samples</span>
                <span></span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Price</span>
                <span>GHS</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Turn around time</span>
                <span>
                  {moment(selected?.turn_around_time, "HH:mm:ss").format(
                    "h [hours] m [minutes]"
                  )}
                </span>
              </li>
            </ul>
            <Separator className="my-2" />
            <Label className="text-muted-foreground">Patient preparation</Label>
            <p>{selected.patient_preparation}</p>
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
    </motion.div>
  );
};

export default SampleDetails;
