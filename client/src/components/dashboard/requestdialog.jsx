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
        <Button className="h-full hover:animate-pulse shadow-xl" size="lg">Send a sample</Button>
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
