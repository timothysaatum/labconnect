import React, { useEffect, useState } from "react";
import { format } from "date-fns";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { labRequestSchema } from "@/lib/schema";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import MultipleSelector from "../ui/multi-select";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertCircle,
  CalendarIcon,
  Check,
  ChevronDown,
  ChevronsUpDown,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useFetchAllDeliveries,
  useFetchAllLabs,
  useFetchLabTests,
} from "@/api/queries";
import {
  selectAllDeliveries,
  setDeliveries,
} from "@/redux/deliveries/AlldeliveriesSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAllLabs,
  selectLabTests,
  setLabs,
  setTests,
} from "@/redux/laboratories/AllLabsSlice";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { selectCurrentUser } from "@/redux/auth/authSlice";
import { FormBuilder } from "../formbuilder";
import { DayPicker } from "react-day-picker";
import { calculateAge } from "@/utils";
import { cn } from "@/lib/utils";

const RequestForm = () => {
  const form = useForm({
    // resolver: zodResolver(labRequestSchema),
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
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const fileRef = form.register("attachment");

  const isDesktop = useMediaQuery("(min-width: 768px)");

  // fetching deliveries
  const { data: deliveries, isError, isLoading } = useFetchAllDeliveries(); //used deliveries to prevent naming conflicts

  useEffect(() => {
    if (deliveries) {
      dispatch(setDeliveries([...deliveries?.data]));
    }
  }, [deliveries]);

  const deliveryOptions = useSelector(selectAllDeliveries);

  //fetching labs
  const {
    data: labs,
    isError: labsError,
    isLoading: labsLoading,
  } = useFetchAllLabs();

  useEffect(() => {
    if (labs) {
      dispatch(setLabs([...labs?.data]));
    }
  }, [labs]);

  const LabsOptions = useSelector(selectAllLabs);

  const onSubmit = async (data) => {
    const reformedData = {
      send_by: user.user_id,
      ...data,
      tests: data.tests.map((test) => test.value),
    };

    console.log(reformedData);
    try {
      const formData = new FormData();

      for (const key in reformedData) {
        formData.append(key, reformedData[key]);
      }
      const response = await axiosPrivate.post(
        "/hospital/clinician/sample/add/",
        data,

        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log(response?.data);
    } catch (error) {
      console.log(error.data);
    }
  };
  useEffect(() => {
    const age = calculateAge(form.watch("patient_age"));
    console.log(age);
  }, [form.watch("patient_age")]);
  // fetching lab tests
  const [id, setId] = useState(null);
  const {
    data: tests,
    isError: testsError,
    isLoading: testsLoading,
  } = useFetchLabTests(id);

  useEffect(() => {
    if (tests) {
      dispatch(setTests([...tests?.data]));
    }
  }, [tests]);

  const [Options, setOptions] = useState(null);
  const testOptions = useSelector(selectLabTests);
  useEffect(() => {
    setOptions(
      testOptions?.map((item) => ({
        label: item.name,
        value: item.id,
      }))
    );
    return () => {
      setOptions(null); // This will be executed when the component unmounts
    };
  }, [testOptions]);

  useEffect(() => {
    const value = form.watch("lab");
    setId(Number(value));
  }, [form.watch("lab")]);
  return (
    <section>
      <Form {...form}>
        <form
          className={`${
            isDesktop ? "grid grid-cols-2 gap-x-8 gap-y-10" : ""
          } px-4 py-2`}
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
                <FormLabel>Patient's age</FormLabel>
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
                            format(field.value, "yyyy:mm:dd")
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
                        fromYear={2015}
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
                <FormMessage />
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
                <FormLabel>Choose Delivery Service</FormLabel>
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
                          ? deliveryOptions?.find(
                              (option) => option.id === field.value
                            )?.name
                          : "choose delivery service"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Command>
                      <CommandInput placeholder="Search delivery service..." />
                      <CommandEmpty>
                        {labsLoading?.labs
                          ? "Loading..."
                          : labsError
                          ? "Error loading labs"
                          : "No laboratories found"}
                      </CommandEmpty>
                      <CommandGroup>
                        <CommandList>
                          {deliveryOptions?.map((delivery) => (
                            <CommandItem
                              value={delivery.id}
                              key={delivery.id}
                              onSelect={() => {
                                form.setValue("delivery", delivery.id);
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
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lab"
            render={({ field }) => (
              <FormItem className="flex flex-col justify-end">
                <FormLabel>Choose Labortory</FormLabel>
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
                          ? LabsOptions?.find(
                              (option) => option.id === field.value
                            )?.name
                          : "choose laboratory"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Command>
                      <CommandInput placeholder="Search laboratory..." />
                      <CommandEmpty>
                        {labsLoading?.labs
                          ? "Loading..."
                          : labsError
                          ? "Error loading labs"
                          : "No laboratories found"}
                      </CommandEmpty>
                      <CommandGroup>
                        <CommandList>
                          {LabsOptions?.map((lab) => (
                            <CommandItem
                              value={lab.id}
                              key={lab.id}
                              onSelect={() => {
                                form.setValue("lab", lab.id);
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
                              {lab.name}
                            </CommandItem>
                          ))}
                        </CommandList>
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="attachment"
            render={() => (
              <FormItem>
                <FormLabel>Attachment</FormLabel>
                <FormControl>
                  <Input type="file" placeholder="Attachment" {...fileRef} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tests"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Tests</FormLabel>
                <FormControl>
                  <div className="relative">
                    <MultipleSelector
                      disabled={Options === null}
                      placeholder="select tests to request"
                      value={field.value.value}
                      onChange={field.onChange}
                      options={Options}
                      emptyIndicator={
                        <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                          Test not found
                        </p>
                      }
                    />
                    <ChevronsUpDown className=" absolute top-2.5 right-0 mr-2 h-4 w-4 shrink-0 opacity-50" />
                  </div>
                </FormControl>
                <FormDescription className="flex gap-2 items-center">
                  <AlertCircle className="w-5 h-5" />
                  Choose a lab to view available tests
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="brief_description"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Brief Description</FormLabel>
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
          <Button type="submit" className="col-span-2">
            Submit Request
          </Button>
        </form>
      </Form>
    </section>
  );
};

export default RequestForm;
