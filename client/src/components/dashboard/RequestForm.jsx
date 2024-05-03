import React, { useEffect, useState } from "react";
import { format } from "date-fns";

import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { useForm } from "react-hook-form";
import { labRequestSchema } from "@/lib/schema";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import MultipleSelector from "../ui/multi-select";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
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
  useFetchAllLabs,
  useFetchLabTests,
} from "@/api/queries";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { FormBuilder } from "../formbuilder";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useQueries, useQueryClient } from "@tanstack/react-query";

const RequestForm = React.forwardRef((props, ref) => {
  const queryClient = useQueryClient();
  const form = useForm({
    resolver: zodResolver(labRequestSchema),
    defaultValues: {
      name_of_patient: "",
      patient_age: "",
      patient_sex: "",
      sample_type: "",
      sample_container: "",
      delivery: "",
      lab: "",
      hospital: "",
      ward: "",
      brief_description: "",
      tests: [],
    },
  });
  const axiosPrivate = useAxiosPrivate();
  const fileRef = form.register("attachment");

  // fetching deliveries
  const {
    data: deliveries,
    isLoading: deliveriesLoading,
    isError: deliveriesError,
  } = useFetchAllDeliveries(); //used deliveries to prevent naming conflicts

  //fetching labs
  const {
    data: labs,
    isError: labsError,
    isLoading: labsLoading,
  } = useFetchAllLabs();

  const onSubmit = async (data) => {
    const testvalue = data?.tests ? data.tests.map((test) => test.value) : [];
    const newData = {
      ...data,
      patient_age: format(data?.patient_age, "yyyy-MM-dd"),
      tests: testvalue,
    };
    if (
      newData.attachment instanceof FileList &&
      newData.attachment.length > 0
    ) {
      newData.attachment = newData.attachment[0];
    }
    console.log(data);

    try {
      const formData = new FormData();

      for (const key in newData) {
        formData.append(key, newData[key]);
      }
      const response = await axiosPrivate.post(
        "/hospital/clinician/sample/add/",
        formData,

        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      queryClient.invalidateQueries("Requests");
      toast.success("Sample Sent", {
        position: "top-center",
      });
    } catch (error) {
      console.log(error.data);
    }
  };
  const [id, setId] = useState(null);
  const {
    data: tests,
    isError: testsError,
    isLoading: testsLoading,
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

  //hospitals
  const {
    isLoading: hospitalsLoading,
    isError: hospitalsError,
    data: hospitals,
  } = useFetchAllHospitals();
  // id of lab to fetch tests for
  useEffect(() => {
    const value = form.watch("lab");
    setId(Number(value));
  }, [form.watch("lab")]);
  return (
    <section>
      <Form {...form}>
        <form
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2 py-10"
          onSubmit={form.handleSubmit(onSubmit)}
        >
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
          <FormField
            name="sample_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sample Type</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Sample type"
                    {...field}
                    size="small"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormBuilder name={"sample_container"} label={"Sample Container"}>
            <Input type="text" placeholder="Sample container" />
          </FormBuilder>
          <FormField
            control={form.control}
            name="delivery"
            render={({ field }) => (
              <FormItem className="flex flex-col justify-end">
                <FormLabel>Choose Delivery Service (Optional)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? deliveries.data?.find(
                              (option) => option.id === field.value
                            )?.name
                          : "choose delivery service"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-popover-content-width-same-as-its-trigger max-h-pop">
                    <Command>
                      <CommandInput placeholder="Search delivery service..." />
                      <CommandEmpty>
                        {deliveriesLoading
                          ? "Loading..."
                          : deliveriesError
                          ? "Error loading delivery services"
                          : "No Delivery Services Available"}
                      </CommandEmpty>
                      <CommandGroup>
                        <CommandList>
                          {deliveries?.data?.map((delivery) => (
                            <CommandItem
                              value={delivery.id}
                              key={delivery.id}
                              onSelect={() => {
                                form.setValue("delivery", delivery.id);
                                form.clearErrors("delivery");
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  delivery.id === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {delivery.name}
                            </CommandItem>
                          ))}
                        </CommandList>
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hospital"
            render={({ field }) => (
              <FormItem className="flex flex-col justify-end">
                <FormLabel>Choose Current hospital</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? hospitals?.data?.find(
                              (option) => option.id === field.value
                            )?.name
                          : "Choose Current Hospital"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-popover-content-width-same-as-its-trigger max-h-pop">
                    <Command>
                      <CommandInput placeholder="Search delivery service..." />
                      <CommandEmpty>
                        {hospitalsLoading
                          ? "Loading..."
                          : hospitalsError
                          ? "Error loading Hospitals"
                          : "No Hospitals found"}
                      </CommandEmpty>
                      <CommandGroup>
                        <CommandList>
                          {hospitals?.data?.map((hospital) => (
                            <CommandItem
                              value={hospital.id}
                              key={hospital.id}
                              onSelect={() => {
                                form.setValue("hospital", hospital.id);
                                form.clearErrors("hospital");
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  hospital.id === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {hospital.name}
                            </CommandItem>
                          ))}
                        </CommandList>
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lab"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Choose Labortory</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? labs?.data?.find(
                                (option) => option.id === field.value
                              )?.branch_name
                            : "choose laboratory"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-popover-content-width-same-as-its-trigger max-h-popover-content-width-same-as-its-trigger p-0">
                      <Command className="shadow-lg">
                        <CommandInput placeholder="Search laboratory..." />
                        <CommandEmpty>
                          {labsLoading
                            ? "Loading..."
                            : labsError
                            ? "Error loading labs"
                            : "No laboratories found"}
                        </CommandEmpty>
                        <CommandGroup>
                          <CommandList>
                            {labs?.data.map((lab) => (
                              <CommandItem
                                value={lab.id}
                                key={lab.id}
                                onSelect={() => {
                                  form.setValue("lab", lab.id);
                                  form.clearErrors("lab");
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    lab.id === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {lab.branch_name}
                              </CommandItem>
                            ))}
                          </CommandList>
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tests"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tests</FormLabel>
                <FormControl>
                  <div className="relative">
                    <MultipleSelector
                      disabled={!tests?.data}
                      placeholder="select tests to request"
                      value={field.value.value}
                      onChange={field.onChange}
                      options={Options}
                      emptyIndicator={
                        <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                          {testsLoading
                            ? "Loading..."
                            : testsError
                            ? "Error loading Tests"
                            : "No laboratories found"}
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
          <FormField
            name="attachment"
            render={() => (
              <FormItem>
                <FormLabel>Attachment (Optional)</FormLabel>
                <FormControl>
                  <Input type="file" placeholder="Attachment" {...fileRef} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="brief_description"
            render={({ field }) => (
              <FormItem className="md:col-span-2 lg:col-span-3">
                <FormLabel>Brief Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Brief description"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" ref={ref} className="hidden"></Button>
        </form>
      </Form>
    </section>
  );
});

export default RequestForm;
