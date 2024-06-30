import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import RequestForm from "./RequestForm";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import React, { useRef } from "react";
import { ChevronRight, CreditCardIcon, Truck } from "lucide-react";
import { MovingButton } from "@/components/ui/movingborder";

export default function RequestDialog({ ...rest }) {
  const [open, setOpen] = React.useState(false);
  const submitRef = useRef();
  const handleClick = () => {
    submitRef.current.click();
  };
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="inline-flex dark:shadow-md dark:ring-2 animate-shimmer items-center justify-center rounded-md  bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-white  transition-colors focus:outline-none">
          Send a sample
        </button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className=" min-h-fit h-[90dvh] max-h-fit p-4 md:p-8 rounded-md rounded-b-none"
      >
        <SheetHeader className="flex flex-col sm:flex-row sm:items-start items-start text-start px-2 mb-4 space-y-4">
          <div className="sm:flex-1 pt-2">
            <SheetTitle>Send a new sample</SheetTitle>
            <SheetDescription>
              fill out the form below to create send new sample
            </SheetDescription>
          </div>
          <Button
            className="max-sm:w-full sm:mr-8 flex gap-2 text-accent"
            onClick={handleClick}
          >
            <CreditCardIcon className="w-6 h-6" /> Proceed to Payment
          </Button>
        </SheetHeader>
        <ScrollArea className="h-[80%] pr-2">
          <RequestForm ref={submitRef} setOpen={setOpen} />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
