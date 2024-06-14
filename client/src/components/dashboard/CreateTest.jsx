import { FormBuilder } from "@/components/formbuilder";
import { Button } from "@/components/ui/button";
// importing aos
import AOS from "aos";
import "aos/dist/aos.css";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { ChevronsUpDown, GitBranchPlus, Loader2, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddTestSchema, SampleTypeSchema } from "@/lib/schema";
import { useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Link, useNavigate } from "react-router-dom";
import MultipleSelector from "../ui/multi-select";
import { useFetchUserBranches } from "@/api/queries";
import { Textarea } from "../ui/textarea";
import AddSampleType from "./addsampleType";
import MagicButton from "../ui/magicButton";

const CreateTest = ({ step, setStep }) => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const [branchOptions, setBranchOptions] = useState(null);

  const {
    isLoading,
    isError,
    isPaused,
    data: branches,
  } = useFetchUserBranches();
  useEffect(() => {
    setBranchOptions(
      branches?.data?.map((item) => ({
        label: item.name,
        value: item.id,
      }))
    );
  }, [branches]);
  const form = useForm({
    // resolver: zodResolver(AddTestSchema),
    defaultValues: {
      test_code: "",
      name: "",
      price: "",
      turn_around_time: "",
      patient_preparation: "",
      unit: "",
      branch: "",
      sample_type: [8],
    },
  });

  const sampleTypeOptions = [
    { label: "Whole blood", value: "Whole blood" },
    { label: "Serum", value: "Serum" },
    { label: "Plasma", value: "Plasma" },
    { label: "Sputum", value: "Sputum" },
  ];

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
    AOS.init();
  }, []);

  const onSubmit = async (data) => {
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
          data.branch.length < 2 ? "" : `to ${data.branches.length} Branches`
        } successfully`,
        {
          position: "top-center",
        }
      );
      form.reset();
    } catch (error) {
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        const errorValues = [Object.values(error?.response?.data || {})];
        if (errorValues.length > 0) {
          toast.error(errorValues[0], {
            position: "top-center",
          });
        }
      } else if (error?.response?.status === 400) {
        toast.error("All fields are required", {
          position: "top-center",
        });
      } else {
        toast.error(
          "Something went went, try again, report if error persisit",
          {
            position: "top-center",
          }
        );
      }
    }
  };
  return (
    <div
      className={`container relative max-sm:px-4 overflow-x-hidden`}
      id="create-test"
    >
      <div className="max-w-6xl mx-auto">
        <h3 className="text-lg font-semibold tracking-wider py-4 md:text-xl from-[#6366F1] to-[#D946EF] bg-gradient-to-l bg-clip-text text-transparent drop-shadow-2xl">
          Add a test
        </h3>
        <p className="text-sm text-muted-foreground">
          Add atleast one test to continue{" "}
        </p>
        <Form {...form}>
          <form
            className="p-3 lg:p-6 grid md:grid-cols-2 gap-10 rounded-lg border-2  "
            noValidate
            onSubmit={form.handleSubmit(onSubmit)}
            data-aos="fade-right"
          >
            <div className="col-span-3 lg:col-span-2 grid md:grid-cols-2 gap-10 ">
              <div className="flex flex-col gap-4">
                <FormField
                  name="branch"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="-mb-2">
                      <FormLabel>
                        Which branches are you adding the test for
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MultipleSelector
                            options={branchOptions}
                            placeholder="What branches are you this test to"
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
                            <MultipleSelector
                              options={sampleTypeOptions}
                              placeholder="Accepted sample types"
                              hidePlaceholderWhenSelected
                              creatable
                              emptyIndicator={
                                <p className="text-center text-md text-muted-foreground">
                                  create a custom sample type
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
                  <Input placeholder="Test name" />
                </FormBuilder>
                <FormBuilder
                  name={"price"}
                  label={"Price (GHS)"}
                  description={"Discounts can be applied to tests later"}
                >
                  <Input type="number" placeholder="price of Tests" />
                </FormBuilder>
              </div>
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-6 gap-2">
                  <div className="col-span-4">
                    <FormBuilder
                      name={"turn_around_time"}
                      label={"Turn around time"}
                    >
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
                <FormBuilder
                  name={"patient_preparation"}
                  label={"Patient Preparation required"}
                  control={form.control}
                >
                  <Textarea placeholder="Patient Preparation" />
                </FormBuilder>
                <MagicButton
                  type="submit"
                  title={"Proceed"}
                  disabled={form.formState.isSubmitting}
                  icon={
                    form.formState.isSubmitting ? (
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    ) : null
                  }
                  position={"right"}
                />
              </div>
            </div>
          </form>
          <div className="flex justify-end my-6">
            <Link to="/dashboard">
              <MagicButton title={"Proceed to dashboard"} />
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CreateTest;
