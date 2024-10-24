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
import { hospitalRequestSchema, labRequestSchema } from "@/lib/schema";
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
import PopoverSelectwithhover from "@/components/dashboard/popoverselectwithhover";

const RequestForm = React.forwardRef(({ setOpen }, ref) => {
  const user = useSelector(selectCurrentUser);
  const queryClient = useQueryClient();
  const form = useForm({
    // resolver: zodResolver(
    //   user?.account_type === "Laboratory"
    //     ? labRequestSchema
    //     : hospitalRequestSchema
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
            referring_facility: "",
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
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid lg:grid-cols-3 lg:gap-x-10 place-items-start px-2"
        >
          <div className="lg:col-span-2 grid md:grid-cols-2 lg:gap-x-5 w-full md:gap-x-3">
            <div className=" flex flex-col gap-6 max-md:mb-6">
              <p className="text-sm uppercase font-semibold lg:mb-4 md:mb-2">
                Patient details
              </p>
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
            </div>
            <div className=" flex flex-col gap-6">
              <p className="text-sm uppercase font-semibold lg:mb-4 md:mb-2">
                Request details
              </p>

              {user.account_type === "Laboratory" ? (
                <PopoverSelect
                  form={form}
                  name={"referring_facility"}
                  error={branchesError}
                  loading={branchesLoading}
                  items={branches}
                  label={"Which branch are you sending sample from?"}
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
                label={"Which laboratory are you sending sample to?"}
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
                        <Input type="file" {...fileRef} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>

            <div className="md:col-span-2 mb-6 mt-4 flex flex-col gap-4">
              <p className="text-sm uppercase font-semibold">others</p>
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

              <FormBuilder
                name="brief_description"
                label="Patient History (Optional)"
                control={form.control}
                className=""
              >
                <Textarea
                  placeholder="Brief description"
                  className="resize-none"
                />
              </FormBuilder>
            </div>
          </div>
          <div className=" flex flex-col gap-4 max-md:mb-6 w-full">
            <p className="text-sm uppercase font-semibold lg:mb-4 md:mb-2">
              Tests details
            </p>
            <ul className="flex flex-col gap-2">
              {fields.map((item, index) => (
                <li key={item.id} className=" flex gap-2">
                  <div className="border-2 border-dotted rounded-md p-4 flex-1 drop-shadow-">
                    <div>
                      <PopoverSelectwithhover
                        form={form}
                        name={`tests.${index}.test`}
                        error={testsError}
                        loading={testsLoading}
                        items={tests}
                        label={"Choose a test to request"}
                        title={"tests"}
                        search={"Search tests..."}
                      />
                    </div>
                    <div className="flex gap-2 items-end">
                      <div className="flex-1">
                        <Label>Select sample type</Label>
                        <Input
                          {...form.register(`tests.${index}.sample_type`)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between">
                    {index === 0 && (
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => prepend({ test: "", sample_type: "" })}
                      >
                        <Plus />
                      </Button>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => remove(index)}
                    >
                      <Minus />
                    </Button>
                  </div>
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
