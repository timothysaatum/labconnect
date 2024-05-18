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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { FormBuilder } from "../formbuilder";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
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
import { forwardRef, useRef, useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { PhoneInput } from "../ui/phone-input";
import AddManager from "./addManager";

const BranchForm = forwardRef(({ setOpen, keepOpen, form }, ref) => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

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
    try {
      await axiosPrivate.post("/laboratory/create-branch/", data);
      queryClient.invalidateQueries(["tests", data?.branch]);
      toast.success(`New branch- ${data?.branch_name} added`, {
        position: "top-center",
      });
      if (!keepOpen) setOpen(false);
      form.reset();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Form {...form}>
      <form
        className="test flex flex-col gap-2 overflow-hidden hover:overflow-auto transition-all p-4"
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          name="branch_manager"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Branch Manager</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <div className="flex items-center overflow-hidden gap-2 p-1">
                    <SelectTrigger>
                      <SelectValue placeholder="Branch Manager" />
                    </SelectTrigger>
                    <AddManager />
                  </div>
                </FormControl>
                <SelectContent>
                  <SelectItem>fetch managers</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormBuilder name={"branch_name"} label={"Branch name"}>
          <Input />
        </FormBuilder>
        <FormBuilder name={"branch_email"} label={"Branch Email"}>
          <Input />
        </FormBuilder>
        <FormBuilder name={"branch_phone"} label={"Branch Contact"}>
          <PhoneInput defaultCountry="GH" international />
        </FormBuilder>
        <FormField
          name="Region"
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
        <FormBuilder
          name={"patient_preparation"}
          label={"Patient Preparation required"}
          control={form.control}
        >
          <Textarea />
        </FormBuilder>
        <Button type="submit" ref={ref} className="hidden">
          Add New Test
        </Button>
      </form>
    </Form>
  );
});
const AddBranch = () => {
  const [open, setOpen] = useState(false);
  const [keepOpen, setKeepOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

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
          <div className="h-full max-h-[80dvh] overflow-auto ">
            <DialogHeader className="bg-background flex-row justify-between items-start sticky top-0 px-4">
              <div className="flex flex-col gap-2">
                <DialogTitle>Add new branch</DialogTitle>
                <div className="flex items-center space-x-2 mb-2">
                  <Checkbox
                    checked={keepOpen}
                    onCheckedChange={setKeepOpen}
                    id="check"
                  />
                  <Label htmlFor="check">Keep open after adding branch</Label>
                </div>
              </div>
              <Button
                onClick={handleClick}
                disabled={form.formState.isSubmitting}
              >
                <GitBranchPlus className="mr-2 h-5 w-5" /> Add new branch{" "}
                {form.formState.isSubmitting && (
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                )}
              </Button>
            </DialogHeader>
            <BranchForm
              setOpen={setOpen}
              keepOpen={keepOpen}
              ref={submitRef}
              form={form}
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
            <div className="flex justify-between gap-2 py-2">
              <DrawerTitle>Add new Branch</DrawerTitle>
              <div className="flex items-center space-x-2 mb-2">
                <Checkbox
                  checked={keepOpen}
                  onCheckedChange={setKeepOpen}
                  id="check"
                />
                <Label htmlFor="check">Keep open after adding branch</Label>
              </div>
            </div>
            <Button
              onClick={handleClick}
              disabled={form.formState.isSubmitting}
            >
              <GitBranchPlus className="mr-2 h-5 w-5" />
              Add new Test
              {form.formState.isSubmitting && (
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              )}
            </Button>
          </DrawerHeader>
          <BranchForm
            setOpen={setOpen}
            ref={submitRef}
            keepOpen={keepOpen}
            form={form}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
export default AddBranch;
