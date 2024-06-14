import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useQueryClient } from "@tanstack/react-query";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { toast } from "sonner";

export const SampleTypeForm = ({ form, setOpen }) => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const [serverErrors, setServerErrors] = useState(null);

  const onSubmit = async (data) => {
    try {
      await axiosPrivate.post("/laboratory/sample-type/add/", data);
      queryClient.invalidateQueries(["userbranches"]);
      toast.success(`sample type added successfully`, {
        position: "top-center",
        duration: 5000,
      });
      form.reset();
      setOpen(false);
    } catch (error) {
      for (const field in error?.response?.data) {
        form.setError(field, {
          type: "manual",
          message: error.response.data[field][0],
        });
      }
      console.log(error);
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        const errorValues = [Object.values(error?.response?.data || {})];
        if (errorValues.length > 0) {
          console.log(errorValues[0]);
          setServerErrors(errorValues[0]);
        }
      } else if (error?.response?.status === 400) {
        setServerErrors("All fields are required");
      } else {
        setServerErrors("Something went wrong, try again");
      }
      toast.error(serverErrors, {
        position: "top-center",
        duration: 5000,
      });
    }
  };
  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-2"
        noValidate
        onSubmit={(e) => {
          e.stopPropagation();
          return form.handleSubmit(onSubmit)(e);
        }}
      >
        <FormBuilder name={"sample_name"} label={"Sample Type"}>
          <Input placeholder="Sample Type" />
        </FormBuilder>
        <FormBuilder
          name={"collection_procedure"}
          label={"Collection Procedure"}
          control={form.control}
        >
          <Textarea placeholder="Collection Procedure" />
        </FormBuilder>
        <FormBuilder name={"collection_time"} label={"Collection Time"}>
          <Input type="text" placeholder="Collection Time" />
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
              Add Branch <Plus className="ml-2 h-4 w-4" />
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
