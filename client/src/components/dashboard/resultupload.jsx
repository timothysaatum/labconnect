import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "../ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import { FileUpload } from "../ui/fileUpload";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { Form } from "../ui/form";
import { useResultUpload } from "../../lib/formactions";

const UploadResults = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const form = useForm();
  const onSubmit = useResultUpload(form);
  if (isDesktop) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <span className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent">
            Upload Results
          </span>
        </DialogTrigger>
        <DialogHeader className="sticky top-0 left-0 z-50 flex-row items-start justify-between px-4 bg-background"></DialogHeader>
        <DialogContent className="px-8 max-w-3xl max-h-[90dvh]">
          <Form {...form}>
            <form
              noValidate
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col"
            >
              <div className="w-full max-w-4xl mx-auto min-h-96  border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg m-8">
                <FileUpload form={form} name={"result"} />
              </div>

              <Button className="mb-10">Upload Results</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <span className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent">
          Upload Results
        </span>
      </DrawerTrigger>
      <DrawerHeader className="sticky top-0 z-50 bg-background"></DrawerHeader>
      <DrawerContent className="px-8">
        <Form {...form}>
          <form
            noValidate
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col"
          >
            <div className="w-full max-w-4xl mx-auto min-h-96  border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg m-8">
              <FileUpload form={form} name={"result"} />
            </div>

            <Button className="mb-10">Upload Results</Button>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
};
export default UploadResults;
