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
import { useEffect, useMemo, useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddTestSchema } from "@/lib/schema";
import MultipleSelector from "@/components/ui/multi-select";
import AddSampleType from "./addsampleType";
import { useSelector } from "react-redux";
import { selectSampleTypes } from "@/redux/samples/sampleTypeSlice";
import MultipleSelectorWithHover from "../ui/multiSelectWithHover";
import { useAddTest } from "@/lib/formactions";

const TestForm = ({ setOpen, keepOpen, form }) => {
  const onAddTest = useAddTest(keepOpen, setOpen, form);

  const [sampleTypes, setSampleTypes] = useState(null);
  const [uniqueSampleTypesState, setUniqueSampleTypesState] = useState([]);

  const addedSampleType = useSelector(selectSampleTypes);

  const { data: lab } = useFetchUserLab();
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

  const [branchOptions, setBranchOptions] = useState(null);
  useEffect(() => {
    setBranchOptions(
      branches?.data?.map((item) => ({
        label: item?.branch_name ? item?.branch_name : item.town + " Branch",
        value: item.id,
      }))
    );
    form.setValue("branch", branchOptions);
  }, [branches]);

  useEffect(() => {
    form.setValue("branch", branchOptions?.slice(0, 5));
  }, [branchOptions]);

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
    form.setValue("sample_type", transformedSampleTypes);
  }, [sample_type, addedSampleType]);
  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4 p-4 overflow-hidden transition-all test hover:overflow-auto over"
        noValidate
        onSubmit={form.handleSubmit(onAddTest)}
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
              <FormItem className="flex-1 -mb-2">
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
              <Plus className="w-4 h-4" />
            </Button>
          </AddSampleType>
        </div>
        <FormBuilder name={"name"} label={"Test Name"}>
          <Input placeholder="Name of test" autoFocus />
        </FormBuilder>
        <FormBuilder name={"test_code"} label={"Test Code"}>
          <Input placeholder="Test code" />
        </FormBuilder>
        <div className="grid grid-cols-[2fr_1fr] gap-2">
          <FormBuilder name={"price"} label={`Price (GH${`\u20B5`})`}>
            <Input type="number" placeholder="Price of test" />
          </FormBuilder>
          <FormBuilder
            name={"discount_price"}
            label={`Discount (GH${`\u20B5`}) (optional) `}
            className="whitespace-nowrap"
          >
            <Input type="number" placeholder="Price of test" />
          </FormBuilder>
        </div>
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
                <FormLabel>Unit</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Unit" />
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
          label={"Patient Preparation (Optional)"}
          control={form.control}
        >
          <Textarea placeholder="Patient preration needed for this test" />
        </FormBuilder>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <span className="flex items-center">
              Test is being added{" "}
              <Loader2 className="w-4 h-4 ml-2 animate-spin" />
            </span>
          ) : (
            <span className="flex items-center">
              Add Test <Plus className="w-4 h-4 ml-2" />
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
  const { data: userbranches, isError, isLoading } = useFetchUserBranches();
  const [branches, setBranches] = useState(null);

  const form = useForm({
    resolver: zodResolver(AddTestSchema),
    defaultValues: {
      test_code: "",
      name: "",
      price: "",
      turn_around_time: "",
      patient_preparation: "",
      unit: "",
      branch: branches,
      discount_price: "",
      sample_type: [],
    },
  });
  useEffect(() => {
    if (isLoading) return;
    if (isError) return;
    if (userbranches?.data) {
      setBranches(
        userbranches?.data?.map((branch) => ({
          label: branch?.branch_name ? branch.branch_name : branch.town + " Branch",
          value: branch.id,
        }))
      );
    }
  }, [userbranches]);

  useEffect(() => {
    !open && form.reset();
  }, [open]);
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Plus className="w-5 h-5 mr-2" />
            Add new Test
          </Button>
        </DialogTrigger>
        <DialogContent className="px-2 max-w-[36rem]">
          <div className="h-full max-h-[80dvh] overflow-auto">
            <DialogHeader className="sticky top-0 left-0 z-50 flex-row items-start justify-between px-4 bg-background">
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
        <Button size={"sm"} variant="outline">
          <Plus className="w-4 h-4" /> Add new Test
        </Button>
      </DrawerTrigger>
      <DrawerContent className="px-2">
        <div className="max-h-[90vh] overflow-auto ">
          <DrawerHeader className="sticky top-0 z-50 bg-background">
            <div className="flex flex-col justify-between gap-2">
              <div>
                <DrawerTitle>Add new test</DrawerTitle>
                <DrawerDescription>
                  Keep open after adding test
                </DrawerDescription>
              </div>
              <div className="flex items-center mb-2 space-x-2">
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
