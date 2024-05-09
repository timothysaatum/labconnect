import { Plus } from "lucide-react";
import { Button } from "../ui/button";
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

const TestForm = () => {
  const axiosPrivate = useAxiosPrivate();
  const form = useForm({
    defaultValues: {
      test_code: "",
      name: "",
      price: "",
      turn_around_time: "",
      patient_preparation: "",
    },
  });
  const onSubmit = async (data) => {
    try {
      const response = await axiosPrivate.post("/laboratory/test/add/", data);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4 max-h-[70dvh] overflow-auto px-4 over scrollbar-thin"
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormBuilder name={"test_code"} label={"Test Code"}>
          <Input />
        </FormBuilder>
        <FormBuilder name={"test_name"} label={"Test Name"}>
          <Input />
        </FormBuilder>
        <FormBuilder name={"price"} label={"Price (GHS)"}>
          <Input type="number" />
        </FormBuilder>
        <FormBuilder name={"turn_around_time"} label={"Turn around time"}>
          <Input />
        </FormBuilder>
        <FormField
          name="branch"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Which branches are you adding the test for</FormLabel>
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="choose branch" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
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
        <Button>Add New Test</Button>
      </form>
    </Form>
  );
};
const AddTest = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  if (isDesktop) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button size="icon" variant="outline">
            <Plus className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add new test</DialogTitle>
            <DialogDescription>
              Fill in the form below to add a new test to your database
            </DialogDescription>
          </DialogHeader>
          <TestForm />
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button size="icon" variant="outline">
          <Plus className="h-4 w-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add new test</DrawerTitle>
          <DrawerDescription>
            Fill in the form below to add a new test to your database
          </DrawerDescription>
        </DrawerHeader>
        <TestForm />
      </DrawerContent>
    </Drawer>
  );
};
export default AddTest;
