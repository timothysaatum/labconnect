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
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ManagerInviteSchema } from "@/lib/schema";
import { useAddManager } from "@/lib/formactions";

const ManagerForm = ({ form, setOpen }) => {
  const onAddManager = useAddManager(form, setOpen);
  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={(e) => {
          e.stopPropagation();
          return form.handleSubmit(onAddManager)(e);
        }}
        className="flex flex-col gap-4 p-4"
      >
        <FormBuilder
          name={"receiver_email"}
          label={"Email"}
          message={true}
          className="flex flex-col gap-3"
          description={
            "An invitation Email will be sent to this user with instructions to complete their profile. The invitee will be have access to the branch they've been assigned to"
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
const AddManager = ({ branchId, children }) => {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const form = useForm({
    resolver: zodResolver(ManagerInviteSchema),
    defaultValues: {
      receiver_email: "",
      branch: "",
    },
  });
  form.setValue("branch", branchId);
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
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
      <DrawerTrigger asChild>{children}</DrawerTrigger>
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
