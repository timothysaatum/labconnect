import { Loader2, Plus, TestTubeDiagonal } from "lucide-react";
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
import { useFetchUserBranches } from "@/api/queries";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { forwardRef, useRef, useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddTestSchema } from "@/lib/schema";

const TestForm = forwardRef(({ setOpen, keepOpen, form }, ref) => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  const { isLoading, isError, data: branches } = useFetchUserBranches();
  const onSubmit = async (data) => {
    console.log(data);
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
        <FormBuilder name={"test_code"} label={"Test Code"}>
          <Input />
        </FormBuilder>
        <FormBuilder name={"name"} label={"Test Name"}>
          <Input />
        </FormBuilder>
        <FormBuilder name={"price"} label={"Price (GHS)"}>
          <Input type="number" />
        </FormBuilder>
        <div className="grid grid-cols-6 gap-2">
          <div className="col-span-4">
            <FormBuilder name={"turn_around_time"} label={"Turn around time"}>
              <Input type="number" />
            </FormBuilder>
          </div>
          <FormField
            name="unit"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>unit</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minutes">Minutes</SelectItem>
                      <SelectItem value="hours">Hours</SelectItem>
                      <SelectItem value="Days">Days</SelectItem>
                      <SelectItem value="Weeks">Weeks</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <FormField
          name="branch"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Which branches are you adding the test for</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="choose branch" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isLoading ? (
                    <SelectItem disabled>Loading...</SelectItem>
                  ) : isError ? (
                    <SelectItem disabled>Error loading branches</SelectItem>
                  ) : (
                    branches?.data?.map((branch) => (
                      <SelectItem value={branch.id} key={branch.id}>
                        {branch?.branch_name}
                      </SelectItem>
                    ))
                  )}
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
const AddTest = () => {
  const [open, setOpen] = useState(false);
  const [keepOpen, setKeepOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const form = useForm({
    // resolver: zodResolver(AddTestSchema),
    defaultValues: {
      test_code: "",
      name: "",
      price: "",
      turn_around_time: "",
      patient_preparation: "",
      branch: "",
    },
  });

  const submitRef = useRef();
  const handleClick = () => {
    submitRef.current.click();
  };
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <TestTubeDiagonal className="mr-2 h-5 w-5" />
            Add new Test
          </Button>
        </DialogTrigger>
        <DialogContent className="px-2">
          <div className="h-full max-h-[80dvh] overflow-auto">
            <DialogHeader className="bg-background flex-row justify-between items-start sticky top-0 px-4">
              <div className="flex flex-col gap-2">
                <DialogTitle>Add new test</DialogTitle>
                <div className="flex items-center space-x-2 mb-2">
                  <Checkbox
                    checked={keepOpen}
                    onCheckedChange={setKeepOpen}
                    id="check"
                  />
                  <Label htmlFor="check">Keep open after adding test</Label>
                </div>
              </div>
              <Button
                onClick={handleClick}
                className=""
                disabled={form.formState.isSubmitting}
              >
                <TestTubeDiagonal className="mr-2 h-5 w-5" />
                Add new Test
                {form.formState.isSubmitting && (
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                )}
              </Button>
            </DialogHeader>
            <TestForm
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
            <Button
              onClick={handleClick}
              disabled={form.formState.isSubmitting}
            >
              <TestTubeDiagonal className="mr-2 h-5 w-5" />
              Add new Test
              {form.formState.isSubmitting && (
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              )}
            </Button>
          </DrawerHeader>
          <TestForm
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
export default AddTest;