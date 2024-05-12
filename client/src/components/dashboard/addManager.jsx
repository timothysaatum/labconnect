import { Plus, UserPlus } from "lucide-react";
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
import { Form } from "../ui/form";
import { FormBuilder } from "../formbuilder";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { forwardRef, useRef, useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddTestSchema } from "@/lib/schema";
import { PhoneInput } from "../ui/phone-input";

const ManagerForm = forwardRef(({ setOpen, keepOpen, form }, ref) => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const onSubmit = async (data) => {
    try {
      await axiosPrivate.post("/laboratory/test/add/", data);
      queryClient.invalidateQueries(["tests", data?.branch]);
      toast.success(
        `New test- ${data?.name} added to ${
          branches?.data?.find((branch) => branch.id === data.branch)
            .branch_name
        } successfully`,
        {
          position: "top-center",
        }
      );
      if (!keepOpen) setOpen(false);
      form.reset();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Form {...form}>
      <form
        className=" test flex flex-col gap-4 overflow-hidden hover:overflow-auto transition-all over p-4"
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormBuilder name={"first_name"} label={"First name"}>
          <Input />
        </FormBuilder>
        <FormBuilder name={"last_name"} label={"Last name"}>
          <Input />
        </FormBuilder>
        <FormBuilder name={"email"} label={"Email"}>
          <Input type="email" />
        </FormBuilder>
        <FormBuilder name={"phone"} label={"Phone number"}>
          <PhoneInput international defaultCountry="GH" />
        </FormBuilder>
        <Button type="submit" ref={ref} className="hidden">
          Add New Branch
        </Button>
      </form>
    </Form>
  );
});
const AddManager = () => {
  const [open, setOpen] = useState(false);
  const [keepOpen, setKeepOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const submitRef = useRef();
  const handleClick = () => {
    submitRef.current.click();
  };
  const form = useForm({
    resolver: zodResolver(AddTestSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      account_type: "Laboratory",
    },
  });
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="overflow-hidden"
            aria-label="add manager"
          >
            <Plus className="h-5 w-5 text" />
            <span className="sr-only">add manager</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="px-2">
          <div className="h-full max-h-[80dvh] overflow-auto">
            <DialogHeader className="bg-background flex-row justify-between items-start sticky top-0 px-4">
              <div className="flex flex-col gap-2">
                <DialogTitle>Add new Manager</DialogTitle>
                <div className="flex items-center space-x-2 mb-2">
                  <Checkbox
                    checked={keepOpen}
                    onCheckedChange={setKeepOpen}
                    id="check"
                  />
                  <Label htmlFor="check">Keep open after adding manager</Label>
                </div>
              </div>
              <Button onClick={handleClick} className="">
                <UserPlus className="h-5 w-5 mr-2" /> Add manager
              </Button>
            </DialogHeader>
            <ManagerForm
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
        <Button
          variant="outline"
          size="icon"
          className="overflow-hidden"
          aria-label="add manager"
        >
          <Plus className="h-5 w-5 text" />
          <span className="sr-only">add manager</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="px-2">
        <div className="max-h-[90vh] overflow-auto ">
          <DrawerHeader className="sticky top-0 bg-background">
            <div className="flex justify-between gap-2 py-2">
              <DrawerTitle>Add new test</DrawerTitle>
              <div className="flex items-center space-x-2 mb-2">
                <Checkbox
                  checked={keepOpen}
                  onCheckedChange={setKeepOpen}
                  id="check"
                />
                <Label htmlFor="check">Keep open after adding test</Label>
              </div>
            </div>
            <Button onClick={handleClick}>Add new Test</Button>
          </DrawerHeader>
          <ManagerForm
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
export default AddManager;
