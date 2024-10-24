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
import { useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { PhoneInput } from "../ui/phone-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddBranchSchema } from "@/lib/schema";
import { regions } from "@/data/data";
import { useBranchAdd } from "@/lib/formactions";
import SelectComponent from "../selectcomponent";
import { useFetchLabManagers, useFetchUserLab } from "@/api/queries";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/auth/authSlice";

export const BranchForm = ({ setOpen, keepOpen, form, className }) => {
  const [serverErrors, setServerErrors] = useState(null);
  const { data: userlab, isError: labError } = useFetchUserLab();
  const user = useSelector(selectCurrentUser);
  const { data: managers, isError } = useFetchLabManagers(userlab?.data[0]?.id);

  const Labmanagers = managers?.data
    ?.filter((manager) => manager?.id !== user?.user_id)
    .map((manager) => ({
      label: `${manager?.first_name} ${manager?.last_name}`,
      value: manager?.id,
    }));
  //form submission
  const onBranchAdd = useBranchAdd(
    form,
    keepOpen,
    setOpen,
    serverErrors,
    setServerErrors
  );

  console.log(form.formState.errors)
  return (
    <Form {...form}>
      <form
        className={className}
        noValidate
        onSubmit={form.handleSubmit(onBranchAdd)}
      >
        <SelectComponent
          name={"branch_manager"}
          control={form.control}
          label={"Choose Branch manager"}
          items={Labmanagers}
          placeholder={"Select Branch Manager"}
          className="flex-1"
          description={
            "Choose from Current managers or invite new manager after adding branch"
          }
        />
        <FormBuilder
          name={"branch_name"}
          label={"Custom branch name (Optional)"}
          description={"Defaults to (laboratory name + town)"}
        >
          <Input type="text" placeholder="Custom Branch Name" />
        </FormBuilder>
        <SelectComponent
          items={[
            { label: "Basic", value: "Basic" },
            { label: "Primary", value: "Primary" },
            { label: "Secondary", value: "Secondary" },
            { label: "Tertiary", value: "Tertiary" },
          ]}
          name={"level"}
          label={"Branch Level"}
          placeholder={"Choose Branch Level"}
        />
        <FormBuilder
          name={"accreditation_number"}
          label={"Accreditiation number"}
        >
          <Input type="text" placeholder="Accreditation number" />
        </FormBuilder>
        <FormBuilder name={"email"} label={"Branch Email"}>
          <Input type="email" placeholder="Branch Email" />
        </FormBuilder>
        <FormBuilder name={"phone"} label={"Branch Contact"}>
          <PhoneInput defaultCountry="GH" placeholder="Branch Contact" />
        </FormBuilder>
        <SelectComponent
          name={"region"}
          label={"Region"}
          items={regions}
          placeholder={"Choose Branch Region"}
        />
        <FormBuilder name={"town"} label={"City/Town"}>
          <Input type="text" placeholder="Branch Location" />
        </FormBuilder>
        <FormBuilder name={"postal_address"} label={"Postal Address"}>
          <Input type="text" placeholder="Postal Address" />
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
      email: "",
      phone: "",
      region: "",
      postal_address: "",
      town: "",
      digital_address: "",
      level: "",
      branch_manager: "",
      branch_name: "",
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
