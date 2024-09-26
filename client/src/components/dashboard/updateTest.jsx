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
import { zodResolver } from "@hookform/resolvers/zod";
import AddSampleType from "./addsampleType";
import { useSelector } from "react-redux";
import { selectSampleTypes } from "@/redux/samples/sampleTypeSlice";
import MultipleSelectorWithHover from "../ui/multiSelectWithHover";
import { useUpdateTest } from "@/lib/formactions";
import { AddTestSchema, UpdateTestSchema } from "@/lib/schema";

const TestForm = ({ setOpen, form, test }) => {
  const onUpdateTest = useUpdateTest(setOpen, form, test?.id);
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
        className="flex flex-col gap-4 p-4 overflow-hidden transition-all test hover:overflow-auto over"
        noValidate
        onSubmit={form.handleSubmit(onUpdateTest)}
      >
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
        <FormBuilder name={"test_code"} label={"Test Code"}>
          <Input placeholder="Test code" />
        </FormBuilder>
        <FormBuilder name={"name"} label={"Test Name"}>
          <Input placeholder="Name of test" />
        </FormBuilder>
        <div className="grid grid-cols-[2fr_1fr] gap-2">
          <FormBuilder name={"price"} label={`Price (GH${`\u20B5`})`}>
            <Input type="number" placeholder="Price of test" />
          </FormBuilder>
          <FormBuilder
            name={"discount_price"}
            label={`Discount (GH${`\u20B5`}) (optional) `}
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
              <Loader2 className="w-4 h-4 ml-2 animate-spin" />
            </span>
          ) : (
            <span className="flex items-center">
              Update Test <Plus className="w-4 h-4 ml-2" />
            </span>
          )}
        </Button>
      </form>
    </Form>
  );
};
const UpdateTest = ({ branch, test }) => {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { data: userbranches, isPending } = useFetchUserBranches();

  const sampleType = useMemo(() => {
    if (test.sample_type) {
      return test.sample_type.map((sampletype) => {
        return { label: sampletype.sample_name, value: sampletype.id };
      });
    }
    return [];
  }, [userbranches, test.branch]);

  const branches = useMemo(() => {
    if (userbranches?.data) {
      return test.branch.map((branch) => {
        const findBranch = userbranches.data.find(
          (userBranch) => branch === userBranch.id
        );
        return {
          label: findBranch?.branch_name || findBranch.town + "Branch",
          value: findBranch.id,
        };
      });
    }
    return [];
  }, [userbranches, test.branch]);
  console.log(branches);

  const form = useForm({
    resolver: zodResolver(AddTestSchema),
    defaultValues: {
      test_code: test.test_code,
      name: test.test_name,
      price: `${test.price}`,
      turn_around_time: test.turn_around_time.split(" ")[0],
      patient_preparation: test.patient_preparation,
      unit: test.turn_around_time.split(" ")[1],
      discount_price: `${test.discount_price}`,
      sample_type: sampleType,
      branch: branches,
    },
  });

  useEffect(() => {
    !open && form.reset();
  }, [open]);
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <span className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent">
            {branch}
          </span>
        </DialogTrigger>
        <DialogContent className="px-2 max-w-[36rem]">
          <div className="h-full max-h-[80dvh] overflow-auto">
            <DialogHeader className="sticky top-0 left-0 z-50 flex-row items-start justify-between px-4 bg-background">
              <div>
                <DialogTitle>Update {test.test_name}</DialogTitle>
                <DialogDescription>
                  You can make changes to the current test
                </DialogDescription>
              </div>
            </DialogHeader>
            <TestForm setOpen={setOpen} test={test} form={form} />
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <span className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent">
          {branch}
        </span>
      </DrawerTrigger>
      <DrawerContent className="px-2">
        <div className="max-h-[90vh] overflow-auto ">
          <DrawerHeader className="sticky top-0 z-50 flex flex-col items-center justify-center gap-2 bg-background">
            <DrawerTitle>Update {test.test_name}</DrawerTitle>
            <DrawerDescription>Keep open after adding test</DrawerDescription>
          </DrawerHeader>
          <TestForm setOpen={setOpen} test={test} form={form} />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
export default UpdateTest;
