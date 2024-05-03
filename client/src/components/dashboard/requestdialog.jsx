import * as React from "react";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "../../hooks/use-media-query";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import RequestForm from "./RequestForm";
import { ScrollArea } from "../ui/scroll-area";
import { useRef } from "react";
import { CreditCardIcon } from "lucide-react";

export default function RequestDialog() {
  const submitRef = useRef();
  const handleClick = () => {
    submitRef.current.click();
  };
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Send a Sample</Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[90dvh] p-0 lg:px-5">
        <SheetHeader className="flex flex-col sm:flex-row sm:items-start items-start text-start px-2 mb-4 space-y-4">
          <div className="sm:flex-1 pt-2">
            <SheetTitle>Send a new sample</SheetTitle>
            <SheetDescription>
              fill out the form below to create send new sample
            </SheetDescription>
          </div>
          <Button className="max-sm:w-full sm:mr-8 flex gap-2 text-accent" onClick={handleClick}>
            <CreditCardIcon className="w-6 h-6"/> Proceed to Payment
          </Button>
        </SheetHeader>
        <ScrollArea className="h-[80%] pr-2">
          <RequestForm ref={submitRef} />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
