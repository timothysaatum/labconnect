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
import RequestForm from "./RequestForm";
import { CircleChevronLeft, PanelBottomClose } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { currentStep } from "@/redux/requests/requestStepSlice";
import { ScrollArea } from "../ui/scroll-area";
import { setTests } from "@/redux/laboratories/AllLabsSlice";
import { setDeliveries } from "@/redux/deliveries/AlldeliveriesSlice";

export default function RequestDialog() {
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
  React.useEffect(() => {
    if (!open) {
      dispatch(setTests([]));
      dispatch(setDeliveries([]))
    }
  }, [open]);

  const isDesktop = useMediaQuery("(min-width: 768px)");
  const step = useSelector(currentStep);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="">Send New Sample</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-3xl max-h-[90%]">
          <DialogHeader>
            <DialogTitle>Create New Request</DialogTitle>
            <DialogDescription>
              fill out the form below to create a new request
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[70%] max-h-[700px] px-4">
            <RequestForm />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      onRelease={() => console.log("released")}
      onClose={() => console.log("closed")}
    >
      <DrawerTrigger asChild>
        <Button>Create New Request</Button>
      </DrawerTrigger>
      <DrawerContent className="px-4">
        <DrawerHeader className="flex justify-between text-left items-start">
          <div>
            <DrawerTitle className="flex gap-4">
              {step !== 1 && (
                <CircleChevronLeft className="text-gray-400 self-center" />
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
        <RequestForm />
      </DrawerContent>
    </Drawer>
  );
}
