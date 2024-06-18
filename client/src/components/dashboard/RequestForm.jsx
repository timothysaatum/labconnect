import React, { useEffect, useState } from "react";
import { format } from "date-fns";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { healthWorkerRequestSchema, labRequestSchema } from "@/lib/schema";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import MultipleSelector from "../ui/multi-select";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { CalendarIcon, ChevronsUpDown, Minus, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useFetchAllDeliveries,
  useFetchAllHospitals,
  useFetchAllLabsBranches,
  useFetchLabTests,
  useFetchUserBranches,
} from "@/api/queries";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { FormBuilder } from "../formbuilder";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/auth/authSlice";
import PopoverSelect from "../popoverselect";
import moment from "moment";
import { SheetDescription, SheetTitle } from "../ui/sheet";
import { Label } from "../ui/label";
import MultipleSelectorWithHover from "../ui/multiSelectWithHover";

const RequestForm = React.forwardRef(({ setOpen }, ref) => {
  const user = useSelector(selectCurrentUser);
  const queryClient = useQueryClient();
  const form = useForm({
    // resolver: zodResolver(
    //   user?.account_type === "Laboratory"
    //     ? labRequestSchema
    //     : healthWorkerRequestSchema
    // ),
    defaultValues:
      user.account_type === "Laboratory"
        ? {
            name_of_patient: "",
            patient_age: "",
            patient_sex: "",
            sample_type: "",
            delivery: "",
            to_lab: "",
            from_lab: "",
            brief_description: "",
          }
        : {
            name_of_patient: "",
            patient_age: "",
            patient_sex: "",
            sample_type: "",
            delivery: "",
            lab: "",
            hospital: "",
            brief_description: "",
            tests: [],
          },
  });

  const { fields, prepend, remove } = useFieldArray({
    control: form.control,
    name: "tests",
  });
  const axiosPrivate = useAxiosPrivate();
  const fileRef = form.register("attachment");

  // fetching deliveries
  const {
    data: deliveries,
    isLoading: deliveriesLoading,
    isError: deliveriesError,
  } = useFetchAllDeliveries();
  //fetching labs
  const {
    data: labs,
    isError: labsError,
    isLoading: labsLoading,
  } = useFetchAllLabsBranches();

  const {
    data: branches,
    isError: branchesError,
    isLoading: branchesLoading,
  } = useFetchUserBranches();

  const onSubmit = async (data) => {
    console.log(data);
    const testvalue = data?.tests ? data.tests.map((test) => test.value) : [];
    const newData = {
      ...data,
      tests: testvalue,
      patient_age: moment(data.patient_age).format("YYYY-MM-DD"),
    };
    if (
      newData.attachment instanceof FileList &&
      newData.attachment.length > 0
    ) {
      newData.attachment = newData.attachment[0];
    }
    try {
      const formData = new FormData();

      for (const key in newData) {
        formData.append(key, newData[key]);
      }
      await axiosPrivate.post(
        user.account_type === "Laboratory"
          ? "laboratory/sample/add/"
          : "hospital/health-worker/add/sample/",
        formData,

        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      form.reset();
      queryClient.invalidateQueries(["Requests"]);
      toast.success("Sample Sent", {
        position: "top-center",
      });
      setOpen(false);
    } catch (error) {
      console.log(error.data);
    }
  };
  const [id, setId] = useState(null);

  const {
    data: tests,
    isError: testsError,
    isLoading: testsLoading,
    isPaused: testspaused,
  } = useFetchLabTests(id);

  const [Options, setOptions] = useState(null);
  useEffect(() => {
    setOptions(
      tests?.data?.map((item) => ({
        label: item.name,
        value: item.id,
      }))
    );
  }, [tests]);

  // id of lab to fetch tests for
  useEffect(() => {
    const value = form.watch(
      user.account_type === "Laboratory" ? "to_lab" : "lab"
    );
    setId(value);
    form.setValue("tests", []);
  }, [form.watch(user.account_type === "Laboratory" ? "to_lab" : "lab")]);

  useEffect(() => {
    if (fields.length === 0) {
      prepend({ test: "", sample_type: "" });
    }
  }, [prepend, fields.length]);
  return (
    <section>
      <Form {...form}>
        <form
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2 py-10 place-items-start"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="md:col-span-1 lg:col-span-2 grid gap-3 grid-cols-2  gap-x-5 ">
            <FormBuilder name="name_of_patient" label="Name of patient">
              <Input type="text" placeholder="Name of patient" />
            </FormBuilder>
            <FormField
              name="patient_age"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Patient's Date of birth</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full  text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd-MM-yyyy")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        <DayPicker
                          mode="single"
                          captionLayout="dropdown-buttons"
                          fromYear={1900}
                          toYear={new Date().getFullYear()}
                          selected={field.value}
                          onSelect={field.onChange}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="patient_sex"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Patient gender</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Patient sex" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <PopoverSelect
              form={form}
              name={"delivery"}
              error={deliveriesError}
              loading={deliveriesLoading}
              items={deliveries}
              label={"Choose Delivery Service (Optional)"}
              title={"Deliveries"}
              search={"Search delivery service..."}
            />
            {user.account_type === "Laboratory" ? (
              <PopoverSelect
                form={form}
                name={"from_lab"}
                error={branchesError}
                loading={branchesLoading}
                items={branches}
                label={"Choose Sending Branch"}
                title={"Branches"}
                search={"Search branches..."}
                info={"branch_name"}
              />
            ) : null}

            <PopoverSelect
              form={form}
              name={user.account_type === "Laboratory" ? "to_lab" : "lab"}
              error={labsError}
              loading={labsLoading}
              items={labs}
              label={"Choose Laboratory"}
              title={"Laboratories"}
              search={"Search laboratory..."}
            />
            <FormField
              control={form.control}
              name="attachment"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>upload any relevant files</FormLabel>
                    <FormControl>
                      <Input type="file" placeholder="shadcn" {...fileRef} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormBuilder
              name="brief_description"
              label="Patient History (Optional)"
              control={form.control}
              className="lg:col-span-2"
            >
              <Textarea
                placeholder="Brief description"
                className="resize-none"
              />
            </FormBuilder>
          </div>
          <div className="">
            <SheetDescription className="-mt-4 mb-2">
              Select the tests with their corresponding sample type being sent
            </SheetDescription>
            <ul className="flex flex-col gap-2">
              {fields.map((item, index) => (
                <li key={item.id} className="gap-2">
                  {index === 0 && (
                    <Button
                      size="icon"
                      variant="secondary"
                      className="self-end float-end mb-2 -mt-4"
                      onClick={() => prepend({ test: "", sample_type: "" })}
                    >
                      <Plus />
                    </Button>
                  )}
                  <div className="border-2 border-dotted rounded-md p-4 flex-1 drop-shadow-">
                    <div>
                      <FormField
                        control={form.control}
                        name={`tests.${index}.test`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tests</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <MultipleSelectorWithHover
                                  options={Options}
                                  placeholder="select tests to request"
                                  hidePlaceholderWhenSelected
                                  emptyIndicator={
                                    <p className="text-center text-md text-muted-foreground">
                                      {testspaused
                                        ? "Check your internet Connection and try again"
                                        : testsLoading
                                        ? "loading..."
                                        : testsError
                                        ? "Error loading tests"
                                        : tests?.data?.length < 1
                                        ? "Selected Lab has no tests"
                                        : `No more tests available`}
                                    </p>
                                  }
                                  {...field}
                                />
                                <ChevronsUpDown className=" absolute top-2.5 right-0 mr-2 h-4 w-4 shrink-0 opacity-50" />
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex gap-2 items-end">
                      <div className="flex-1">
                        <Label>Select sample type</Label>
                        <Input {...form.register(`tests.${index}.sample_type`)} />
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => remove(index)}
                      >
                        <Minus />
                      </Button>
                    </div>
                  </div>

                  {/* <Controller
                    render={({ field }) => <input {...field} />}
                    name={`test.${index}.lastName`}
                    control={form.control}
                  )}
                  {/* <Controller
                    render={({ field }) => <input {...field} />}
                    name={`test.${index}.lastName`}
                    control={form.control}
                  /> */}
                </li>
              ))}
            </ul>
          </div>
          <Button type="submit" ref={ref} className="hidden"></Button>
        </form>
      </Form>
    </section>
  );
});

export default RequestForm;
