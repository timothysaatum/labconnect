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
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddTestSchema } from "@/lib/schema";
import { toast } from "sonner";

const ManagerForm = ({ form }) => {
  const axiosPrivate = useAxiosPrivate();
  const onSubmit = async (data) => {
    try {
      await axiosPrivate.post("/laboratory/test/add/", data);
      form.reset();
      toast.success("Invite Sent", {
        position: "top-center",
      });
    } catch (error) {
      console.log(error);
      toast.error("Error Sending Invite try again", {
        position: "top-center",
      });
    }
  };
  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 p-4"
      >
        <FormBuilder
          name={"email"}
          label={"Email"}
          message={true}
          className="flex flex-col gap-3"
          description={
            "An invitation Email will be sent to this user with instructions to complete their profile after which they can be added as branch managers"
          }
        >
          <Input />
        </FormBuilder>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          Send Invite
        </Button>
      </form>
    </Form>
  );
};
const AddManager = () => {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const form = useForm({
    resolver: zodResolver(AddTestSchema),
    defaultValues: {
      email: "",
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
            <span className="sr-only">send manger invite</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader className=" flex-row justify-between items-start">
            <DialogTitle>Send Invite</DialogTitle>
            <UserPlus className="h-5 w-5 mr-2 text-muted-foreground" />
          </DialogHeader>
          <ManagerForm setOpen={setOpen} form={form} />
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
          <span className="sr-only">send manager invite</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Send Invite</DrawerTitle>
        </DrawerHeader>
        <ManagerForm setOpen={setOpen} form={form} />
      </DrawerContent>
    </Drawer>
  );
};
export default AddManager;
