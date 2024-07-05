import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Form } from "../ui/form";
import { FormBuilder } from "../formbuilder";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { SampleTypeSchema } from "@/lib/schema";
import { Button } from "../ui/button";
import { AlertCircle, Loader2, Plus } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { useSelector } from "react-redux";
import { selectSampleTypes } from "@/redux/samples/sampleTypeSlice";
import { useAddSampleType } from "@/lib/formactions";

export const SampleTypeForm = ({ form, setOpen }) => {
  const [serverErrors, setServerErrors] = useState(null);
  const SampleTypes = useSelector(selectSampleTypes);

  const onAddSampleType = useAddSampleType(
    form,
    setOpen,
    SampleTypes,
    serverErrors,
    setServerErrors
  );

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-2"
        noValidate
        onSubmit={(e) => {
          e.stopPropagation();
          return form.handleSubmit(onAddSampleType)(e);
        }}
      >
        <FormBuilder name={"sample_name"} label={"Sample Type"}>
          <Input placeholder="Sample Type" />
        </FormBuilder>
        <FormBuilder name={"collection_time"} label={"Collection Time"}>
          <Input type="text" placeholder="Collection Time" />
        </FormBuilder>
        <FormBuilder
          name={"collection_procedure"}
          label={"Collection Procedure"}
          control={form.control}
          description={"Also include sample container to be used"}
        >
          <Textarea placeholder="Collection Procedure" />
        </FormBuilder>
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="mt-4"
        >
          {form.formState.isSubmitting ? (
            <span className="flex items-center">
              Adding sample type{" "}
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            </span>
          ) : (
            <span className="flex items-center">
              Add sample type <Plus className="ml-2 h-4 w-4" />
            </span>
          )}
        </Button>
        {serverErrors && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{serverErrors}</AlertDescription>
          </Alert>
        )}
      </form>
    </Form>
  );
};
const AddSampleType = ({ children }) => {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const form = useForm({
    resolver: zodResolver(SampleTypeSchema),
    defaultValues: {
      sample_name: "",
      collection_procedure: "",
      collection_time: "",
    },
  });

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add new sample type</DialogTitle>
          </DialogHeader>
          <SampleTypeForm setOpen={setOpen} form={form} />
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="px-4 py-4">
        <DrawerHeader>
          <DrawerTitle>Add new sample type</DrawerTitle>
        </DrawerHeader>
        <SampleTypeForm setOpen={setOpen} form={form} />
      </DrawerContent>
    </Drawer>
  );
};
export default AddSampleType;
