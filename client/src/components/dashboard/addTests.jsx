import { ChevronsUpDown, Loader2, Plus } from "lucide-react";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
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
import {
  useFetchSampleTypes,
  useFetchUserBranches,
  useFetchUserLab,
} from "@/api/queries";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddTestSchema } from "@/lib/schema";
import MultipleSelector from "@/components/ui/multi-select";
import AddSampleType from "./addsampleType";
import { useSelector } from "react-redux";
import { selectSampleTypes } from "@/redux/samples/sampleTypeSlice";
import MultipleSelectorWithHover from "../ui/multiSelectWithHover";

const TestForm = ({ setOpen, keepOpen, form }) => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  const [sampleTypes, setSampleTypes] = useState(null);
  const [uniqueSampleTypesState, setUniqueSampleTypesState] = useState([]);

  const addedSampleType = useSelector(selectSampleTypes);

  const {
    data: lab,
    isError: laberror,
    isFetching: labfetching,
  } = useFetchUserLab();
  const {
    data: sample_type,
    isError: sample_type_error,
    isFetching: sample_type_fetching,
  } = useFetchSampleTypes(lab?.data[0]?.id);

  useEffect(() => {
    if (Object.keys(form.formState.errors).length > 0) {
      const firstErrorField = Object.keys(form.formState.errors)[0];
      document.getElementsByName(firstErrorField)[0]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [form.formState.errors]);
  const {
    isLoading,
    isError,
    isPaused,
    data: branches,
  } = useFetchUserBranches();

  const onSubmit = async (data) => {
    console.log(data);
    const branchvalue = data?.branch
      ? data.branch.map((branch) => branch.value)
      : [];
    const SampleTypevalue = data?.sample_type
      ? data.sample_type.map((sample_type) => sample_type.value)
      : [];

    const turnAroundTimeWithUnit = data?.turn_around_time + " " + data?.unit;

    const finalData = {
      ...data,
      turn_around_time: turnAroundTimeWithUnit,
      branch: branchvalue,
      sample_type: SampleTypevalue,
    };

    // Remove the unit field from the finalData object
    delete finalData.unit;
    console.log(finalData);
    try {
      await axiosPrivate.post("/laboratory/test/add/", finalData);
      queryClient.invalidateQueries(["tests", data?.branch]);
      toast.success(
        `New test- ${data?.name} added ${
          data.branch.length < 2
            ? `${data.branch[0].label}`
            : `to ${data.branch.length} branches`
        } successfully`,
        {
          position: "top-center",
        }
      );
      queryClient.invalidateQueries(["tests"]);
      if (!keepOpen) setOpen(false);
      // form.reset();
    } catch (error) {
      console.error(error);
    }
  };
  const [branchOptions, setBranchOptions] = useState(null);
  useEffect(() => {
    setBranchOptions(
      branches?.data?.map((item) => ({
        label: item.name,
        value: item.id,
      }))
    );
  }, [branches]);
  useEffect(() => {
    if (sample_type_fetching || sample_type_error) return;
    let combinedSampleTypes = [
      ...(sample_type?.data || []),
      ...(addedSampleType || []),
    ];
    let uniqueSampleTypes = [];

    combinedSampleTypes.forEach((item) => {
      if (!uniqueSampleTypes.some((uniqueItem) => uniqueItem.id === item.id)) {
        uniqueSampleTypes.push(item);
      }
    });

    setUniqueSampleTypesState(uniqueSampleTypes);

    const transformedSampleTypes = uniqueSampleTypes.map((item) => ({
      label: item?.sample_name,
      value: item?.id,
    }));

    setSampleTypes(transformedSampleTypes);
  }, [sample_type, addedSampleType]);
  return (
    <Form {...form}>
      <form
        className=" test flex flex-col gap-4 overflow-hidden hover:overflow-auto transition-all over p-4"
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          name="branch"
          control={form.control}
          render={({ field }) => (
            <FormItem className="-mb-2">
              <FormLabel>Which branches are you adding the test for</FormLabel>
              <FormControl>
                <div className="relative">
                  <MultipleSelector
                    options={branchOptions}
                    placeholder="Select branches to add test to"
                    hidePlaceholderWhenSelected
                    emptyIndicator={
                      <p className="text-center text-md text-muted-foreground">
                        {isPaused
                          ? "Check your internet Connection and try again"
                          : isLoading
                          ? "loading..."
                          : isError
                          ? "Error loading Branches"
                          : branches?.data?.length < 1
                          ? "Lab has no branches create a branch to before adding tests"
                          : `No more branches available`}
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
        <div className="flex items-end gap-2">
          <FormField
            name="sample_type"
            control={form.control}
            render={({ field }) => (
              <FormItem className="-mb-2 flex-1">
                <FormLabel>Accepted Sample Types</FormLabel>
                <FormControl>
                  <div className="relative">
                    <MultipleSelectorWithHover
                      options={sampleTypes}
                      title="sample"
                      detailedContent={uniqueSampleTypesState}
                      placeholder="Accepted sample types"
                      hidePlaceholderWhenSelected
                      emptyIndicator={
                        <p className="text-center text-md text-muted-foreground">
                          Click the plus sign to add a new sample type
                        </p>
                      }
                      {...field}
                    />
                    <ChevronsUpDown className="-z-10  absolute top-2.5 right-0 mr-2 h-4 w-4 shrink-0 opacity-50" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <AddSampleType>
            <Button variant="outline" size="icon" className="mt-2">
              <Plus className="h-4 w-4" />
            </Button>
          </AddSampleType>
        </div>
        <FormBuilder name={"test_code"} label={"Test Code"}>
          <Input placeholder="Test code" />
        </FormBuilder>
        <FormBuilder name={"name"} label={"Test Name"}>
          <Input placeholder="Name of test" />
        </FormBuilder>
        <FormBuilder name={"price"} label={"Price (GHS)"}>
          <Input type="number" placeholder="Price of test" />
        </FormBuilder>
        <div className="grid grid-cols-6 gap-2">
          <div className="col-span-4">
            <FormBuilder name={"turn_around_time"} label={"Turn around time"}>
              <Input type="number" placeholder="Turn around time of test" />
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
        <FormBuilder
          name={"patient_preparation"}
          label={"Patient Preparation required"}
          control={form.control}
        >
          <Textarea placeholder="Patient preration required for this test" />
        </FormBuilder>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <span className="flex items-center">
              Test is being added{" "}
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            </span>
          ) : (
            <span className="flex items-center">
              Add Test <Plus className="ml-2 h-4 w-4" />
            </span>
          )}
        </Button>
      </form>
    </Form>
  );
};
const AddTest = () => {
  const [open, setOpen] = useState(false);
  const [keepOpen, setKeepOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const form = useForm({
    resolver: zodResolver(AddTestSchema),
    defaultValues: {
      test_code: "",
      name: "",
      price: "",
      turn_around_time: "",
      patient_preparation: "",
      unit: "",
      branch: "",
      sample_type: [],
    },
  });

  useEffect(() => {
    !open && form.reset();
  }, [open]);
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Plus className="mr-2 h-5 w-5" />
            Add new Test
          </Button>
        </DialogTrigger>
        <DialogContent className="px-2 max-w-[36rem]">
          <div className="h-full max-h-[80dvh] overflow-auto">
            <DialogHeader className="z-50 bg-background flex-row justify-between items-start sticky top-0 px-4 left-0">
              <div>
                <DialogTitle>Add new test</DialogTitle>
                <DialogDescription>
                  Fill in this form to add a new test
                </DialogDescription>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={keepOpen}
                  onCheckedChange={setKeepOpen}
                  id="check"
                />
                <Label htmlFor="check">Keep open after adding test</Label>
              </div>
            </DialogHeader>
            <TestForm setOpen={setOpen} keepOpen={keepOpen} form={form} />
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
          <DrawerHeader className="z-50 sticky top-0 bg-background">
            <div className="flex justify-between gap-2 flex-col">
              <div>
                <DrawerTitle>Add new test</DrawerTitle>
                <DrawerDescription>
                  Keep open after adding test
                </DrawerDescription>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <Checkbox
                  checked={keepOpen}
                  onCheckedChange={setKeepOpen}
                  id="check"
                />
                <Label htmlFor="check">Keep open after adding test</Label>
              </div>
            </div>
          </DrawerHeader>
          <TestForm setOpen={setOpen} keepOpen={keepOpen} form={form} />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
export default AddTest;
