import { GitBranchPlus, Loader2, Plus } from "lucide-react";
import { Button } from "../ui/button";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { FormBuilder } from "../formbuilder";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { PhoneInput } from "../ui/phone-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddBranchSchema } from "@/lib/schema";

export const BranchForm = ({ setOpen, keepOpen, form, className }) => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const [serverErrors, setServerErrors] = useState(null);

  const regions = [
    { value: "Western", label: "Western Region" },
    { value: "Western North", label: "Western North Region" },
    { value: "Brong-Ahafo", label: "Brong-Ahafo Region" },
    { value: "Ashanti", label: "Ashanti Region" },
    { value: "Eastern", label: "Eastern Region" },
    { value: "Ahafo", label: "Ahafo Region" },
    { value: "Bono", label: "Bono Region" },
    { value: "Bono East", label: "Bono East Region" },
    { value: "Central", label: "Central Region" },
    { value: "Greater Accra", label: "Greater Accra Region" },
    { value: "Volta", label: "Volta Region" },
    { value: "Oti", label: "Oti Region" },
    { value: "Northern", label: "Northern Region" },
    { value: "Savannah", label: "Savannah Region" },
    { value: "North East", label: "North East Region" },
    { value: "Upper East", label: "Upper East Region" },
  ];
  const onSubmit = async (data) => {
    console.log(data);
    try {
      await axiosPrivate.post("/laboratory/create-branch/", data);
      queryClient.invalidateQueries(["userbranches"]);
      toast.success(`New branch - ${data?.branch_name} added`, {
        position: "top-center",
        duration: 5000,
      });
      if (!keepOpen) setOpen(false);
      form.reset();
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
        className={className}
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormBuilder name={"branch_name"} label={"Branch name"}>
          <Input type="text" placeholder="branch name" />
        </FormBuilder>
        <FormBuilder name={"branch_email"} label={"Branch Email"}>
          <Input type="email" placeholder="branch email" />
        </FormBuilder>
        <FormBuilder name={"branch_phone"} label={"Branch Contact"}>
          <PhoneInput defaultCountry="GH" international />
        </FormBuilder>
        <FormField
          name="region"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Region</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Region" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {regions?.map((region) => (
                    <SelectItem value={region.value} key={region.value}>
                      {region?.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormBuilder name={"location"} label={"City/Town"}>
          <Input type="text" placeholder="branch location" />
        </FormBuilder>
        <FormBuilder name={"digital_address"} label={"Digital Address"}>
          <Input type="text" placeholder="Digital Address" />
        </FormBuilder>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <span className="flex items-center">
              Branch is being added{" "}
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            </span>
          ) : (
            <span className="flex items-center">
              Add Branch <GitBranchPlus className="ml-2 h-4 w-4" />
            </span>
          )}
        </Button>{" "}
      </form>
    </Form>
  );
};
const AddBranch = () => {
  const [open, setOpen] = useState(false);
  const [keepOpen, setKeepOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const form = useForm({
    resolver: zodResolver(AddBranchSchema),
    defaultValues: {
      branch_name: "",
      branch_email: "",
      branch_phone: "",
      region: "",
      location: "",
      digital_address: "",
    },
  });
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <GitBranchPlus className="mr-2 h-5 w-5" />
            Add new branch
          </Button>
        </DialogTrigger>
        <DialogContent className="px-2 max-w-[36rem]">
          <div className="h-full max-h-[80dvh] overflow-auto">
            <DialogHeader className="z-50 bg-background flex-row justify-between items-start sticky top-0 px-4">
              <div>
                <DialogTitle>Create a new branch</DialogTitle>
                <DialogDescription>
                  Fill in this form to Create a new Branch
                </DialogDescription>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={keepOpen}
                  onCheckedChange={setKeepOpen}
                  id="check"
                />
                <Label htmlFor="check">Keep open after creating branch</Label>
              </div>
            </DialogHeader>
            <BranchForm
              setOpen={setOpen}
              keepOpen={keepOpen}
              form={form}
              className=" test flex flex-col gap-4 overflow-hidden hover:overflow-auto transition-all over p-4"
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button size="icon" variant="outline">
          <Plus className="h-4 w-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="px-2">
        <div className="max-h-[90vh] overflow-auto ">
          <DrawerHeader className="sticky top-0 bg-background">
            <div className="flex flex-col items-start gap-2 sm:flex-row sm:justify-between">
              <DrawerTitle>create a new Branch</DrawerTitle>
              <div className="flex items-center space-x-2 ">
                <Checkbox
                  checked={keepOpen}
                  onCheckedChange={setKeepOpen}
                  id="check"
                />
                <Label htmlFor="check" className="text-xs">
                  Keep open after adding branch
                </Label>
              </div>
            </div>
          </DrawerHeader>
          <BranchForm
            setOpen={setOpen}
            keepOpen={keepOpen}
            form={form}
            className="test flex flex-col gap-4 overflow-hidden hover:overflow-auto transition-all over p-4"
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
export default AddBranch;
