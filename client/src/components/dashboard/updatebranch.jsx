import { ChevronsUpDown, Loader2, Plus } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useEffect, useState } from "react";
import { PhoneInput } from "../ui/phone-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddBranchSchema } from "@/lib/schema";
import { regions } from "@/data/data";
import { useBranchAdd, useBranchUpdate } from "@/lib/formactions";
import {
  useFetchLabManagers,
  useFetchUserBranches,
  useFetchUserLab,
} from "@/api/queries";
import { toast } from "sonner";
import SelectComponent from "../selectcomponent";
import AddManager from "./addManager";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/auth/authSlice";
import MultipleSelector from "@/components/ui/multi-select";

export const BranchForm = ({ setOpen, form, className, id }) => {
  const [currentBranchManager, setCurrentBranchManager] = useState(null);
  const [branchToUpdate, setBranchToUpdate] = useState(null);
  //form submission
  const onBranchAdd = useBranchUpdate(form, setOpen, id);
  const { data: userlab, isError: labError } = useFetchUserLab();
  const { data: managers, isError } = useFetchLabManagers(userlab?.data[0]?.id);
  const { data: userbranches, isError: branchError } = useFetchUserBranches();
  const [selectData, setSelectData] = useState([]);
  const user = useSelector(selectCurrentUser);

  if (isError || labError || branchError) {
    toast.error("An error occurred");
  }

  useEffect(() => {
    if (userbranches?.data) {
      setBranchToUpdate(userbranches?.data?.find((branch) => branch.id === id));
    }
  }, [userbranches]);

  useEffect(() => {
    if (managers) {
      setSelectData(
        managers?.data?.map((manager) => ({
          label: `${manager.first_name} ${manager.last_name}`,
          value: manager.id,
        }))
      );
      if (branchToUpdate) {
        setCurrentBranchManager(
          managers?.data?.find(
            (manager) => manager.id === branchToUpdate?.manager_id
          )
        );
      }
    }
  }, [branchToUpdate, managers]);
  useEffect(() => {
    if (currentBranchManager) {
      form.setValue("branch_manager", [
        {
          label: `${currentBranchManager.first_name} ${currentBranchManager.last_name}`,
          value: currentBranchManager.id,
        },
      ]);
    }
  }, [currentBranchManager]);

  return (
    <Form {...form}>
      <form
        className={className}
        noValidate
        onSubmit={form.handleSubmit(onBranchAdd)}
      >
        {user?.is_admin && (
          <div className="flex gap-2 items-end">
            <FormField
              name="branch_manager"
              control={form.control}
              render={({ field }) => (
                <FormItem className="-mb-2 flex-1">
                  <FormLabel>Branch Manager</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MultipleSelector
                        options={selectData}
                        placeholder="Select Branch Manager"
                        hidePlaceholderWhenSelected
                        className="-z-0"
                        
                        emptyIndicator={
                          <p className="text-center text-md text-muted-foreground">
                            {isError
                              ? "Error loading managers"
                              : managers?.data?.length < 1
                                ? "No Managers available"
                                : "No managers available"}
                          </p>
                        }
                        {...field}
                      />
                      <ChevronsUpDown className="-z-10  absolute top-2.5 right-0 mr-2 h-4 w-4 shrink-0 opacity-50" />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <AddManager branchId={id}>
              <Button variant="ghost" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </AddManager>
          </div>
        )}
        <FormBuilder name={"email"} label={"Branch Email"}>
          <Input type="email" placeholder="branch email" />
        </FormBuilder>
        <FormBuilder name={"phone"} label={"Branch Contact"}>
          <PhoneInput defaultCountry="GH" />
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
        <FormBuilder name={"town"} label={"City/Town"}>
          <Input type="text" placeholder="branch location" />
        </FormBuilder>
        <FormBuilder name={"postal_address"} label={"Postal Address"}>
          <Input type="text" placeholder="Postal address" />
        </FormBuilder>
        <FormBuilder name={"digital_address"} label={"Digital Address"}>
          <Input type="text" placeholder="Digital Address" />
        </FormBuilder>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <span className="flex items-center">
              Branch is being updated{" "}
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            </span>
          ) : (
            <span className="flex items-center">Update branch</span>
          )}
        </Button>{" "}
      </form>
    </Form>
  );
};
const UpdateBranch = ({ branchId }) => {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { data: userbranches } = useFetchUserBranches();

  const branch = userbranches?.data?.find((branch) => branch.id === branchId);

  const form = useForm({
    resolver: zodResolver(AddBranchSchema),
    defaultValues: {
      email: "",
      phone: "",
      region: "",
      postal_address: "",
      town: "",
      digital_address: "",
      branch_manager: "",
    },
  });

  useEffect(() => {
    if (branch) {
      form.setValue("email", branch.email);
      form.setValue("phone", branch.phone);
      form.setValue("region", branch.region);
      form.setValue("postal_address", branch.postal_address);
      form.setValue("town", branch.town);
      form.setValue("digital_address", branch.digital_address);
    }
  }, [branch]);
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <span className="relative gap-2 flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent">
            Update branch
          </span>
        </DialogTrigger>
        <DialogContent className="px-2 max-w-[36rem]">
          <div className="h-full max-h-[80dvh] overflow-auto">
            <DialogHeader className="z-50 bg-backgroun sticky top-0 px-4">
              <DialogTitle>Update Branch</DialogTitle>
              <DialogDescription>
                Make changes to the branch details
              </DialogDescription>
            </DialogHeader>
            <BranchForm
              setOpen={setOpen}
              form={form}
              className=" test flex flex-col gap-4 overflow-hidden hover:overflow-auto transition-all over p-4"
              id={branchId}
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <span className="relative gap-2 flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent">
          Update branch
        </span>
      </DrawerTrigger>
      <DrawerContent className="px-2">
        <div className="max-h-[90vh] overflow-auto ">
          <DrawerHeader className="sticky top-0 bg-background items-center flex justify-center flex-col z-50">
            <DrawerTitle>Update Branch</DrawerTitle>
            <DialogDescription>
              Make changes to the branch details
            </DialogDescription>
          </DrawerHeader>
          <BranchForm
            setOpen={setOpen}
            form={form}
            className="test flex flex-col gap-4 overflow-hidden hover:overflow-auto transition-all over p-4"
            id={branchId}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
export default UpdateBranch;
