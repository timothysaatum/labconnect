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
        <SheetHeader className="p-7 flex flex-row justify-between">
          <div>
            <SheetTitle>Send a new sample</SheetTitle>
            <SheetDescription>
              fill out the form below to create send new sample
            </SheetDescription>
          </div>
          <div className="px-5 md:px-10">
          <Button className="" size="lg" onClick={handleClick}>Proceed to Payment</Button>
        </div>
        </SheetHeader>
        <ScrollArea className="h-[80%] pr-2">
          <RequestForm ref={submitRef} />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
