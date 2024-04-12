import * as React from "react";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "../../hooks/use-media-query";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import RequestForm from "../requests/RequestForm";
import { CircleChevronLeft, PanelBottomClose } from "lucide-react";

export default function RequestDialog() {
  const [open, setOpen] = React.useState(false);
    const [step, setStep] = React.useState(1);

  const isDesktop = useMediaQuery("(min-width: 768px)");


  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen} >
        <DialogTrigger asChild>
          <Button>Create New Request</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Create New Request</DialogTitle>
            <DialogDescription>
              fill out the form below to create a new request
            </DialogDescription>
          </DialogHeader>
          <RequestForm step={step}/>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen} onRelease={()=>console.log('released')} onClose={()=>console.log('closed')}>
      <DrawerTrigger asChild>
        <Button>Create New Request</Button>
      </DrawerTrigger>
      <DrawerContent className="px-4">
        <DrawerHeader className="flex justify-between text-left items-start">
          <div>
            <DrawerTitle>
              {step !== 1 && (
                <CircleChevronLeft
                  className="text-gray-400 self-center"
                />
              )}
              Create New Request
            </DrawerTitle>
            <DrawerDescription>
              fill out the form below to create a new request
            </DrawerDescription>
          </div>
          <DrawerClose asChild className="">
            <PanelBottomClose
              size={28}
              strokeWidth={1.5}
              absoluteStrokeWidth
              className="text-gray-400"
            />
          </DrawerClose>
        </DrawerHeader>
        <RequestForm  step={step}/>
      </DrawerContent>
    </Drawer>
  );
}
