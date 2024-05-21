import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "../ui/scroll-area";
import React, { useRef } from "react";
import { CreditCardIcon, Truck } from "lucide-react";
import { BranchForm } from "./addbranch";
import { useForm } from "react-hook-form";

const date = new Date()
console.log(date)
export default function AddBranchCreateLab({ open, setOpen, ...rest }) {
  const submitRef = useRef();
  const handleClick = () => {
    submitRef.current.click();
  };
  const form = useForm({
    defaultValues: {
      branch_name: "",
      branch_email: "",
      branch_phone: "",
      region: "",
      location: "",
      digital_address: "",
    },
  });
  return (
    <Sheet open onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button {...rest}>Add Branch</Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="h-[80dvh] p-4 md:p-8 mx-2 rounded-md"
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
          <BranchForm form={form}  className="grid grid-cols-2 gap-6 px-4"/>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
