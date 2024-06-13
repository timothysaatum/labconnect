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
import { PhoneInput } from "@/components/ui/phone-input";

import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { GitBranchPlus, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddBranchSchema } from "@/lib/schema";
import { useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { regions } from "@/data/data";
import { useNavigate } from "react-router-dom";

const CreateBranch = ({ labcreated }) => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [branchcreated, setBranchcreated] = useState(false);

  const form = useForm({
    resolver: zodResolver(AddBranchSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      region: "",
      postal_address: "",
      town: "",
      digital_address: "",
    },
  });

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
    try {
      setBranchcreated(false);
      await axiosPrivate.post("/laboratory/create-branch/", data);
      queryClient.invalidateQueries(["userbranches"]);
      toast.success(`New branch - ${data?.name} added`, {
        position: "top-center",
        duration: 5000,
      });
      setBranchcreated(true);
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
  useEffect(() => {
    if (branchcreated) {
      const element = document.getElementById("create-test");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [branchcreated]);
  if (labcreated)
    return (
      <div
        className={`container relative max-sm:px-4 overflow-hidden my-10`}
        id="create-branch"
      >
        <div className="max-w-6xl mx-auto">
          <h3 className="text-lg font-semibold tracking-wider  md:text-2xl  my-4 from-[#6366F1] to-[#D946EF] bg-gradient-to-l bg-clip-text text-transparent drop-shadow-2xl">
            Add a branch
          </h3>
          <Form {...form}>
            <form
              className="p-3 lg:p-6 grid md:grid-cols-2 gap-10 rounded-lg border-2  "
              noValidate
              onSubmit={form.handleSubmit(onSubmit)}
              data-aos="zoom-out"
            >
              <div className="col-span-3 lg:col-span-2 grid md:grid-cols-2 gap-10 ">
                <div className="flex flex-col gap-4">
                  <FormBuilder
                    name={"name"}
                    label={"Branch name"}
                    message={true}
                  >
                    <Input type="text" placeholder="branch name" />
                  </FormBuilder>
                  <FormBuilder name={"email"} label={"Branch Email"}>
                    <Input type="email" placeholder="branch email" />
                  </FormBuilder>
                  <FormBuilder name={"phone"} label={"Branch Contact"}>
                    <PhoneInput defaultCountry="GH" international />
                  </FormBuilder>
                </div>
                <div className="flex flex-col gap-4">
                  <FormField
                    name="region"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Region</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Region" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {regions?.map((region) => (
                              <SelectItem
                                value={region.value}
                                key={region.value}
                              >
                                {region?.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormBuilder name={"town"} label={"City/Town"}>
                    <Input type="text" placeholder="branch location" />
                  </FormBuilder>
                  <FormBuilder name={"postal_address"} label={"Postal Address"}>
                    <Input type="text" placeholder="Postal address" />
                  </FormBuilder>
                  <FormBuilder
                    name={"digital_address"}
                    label={"Digital Address"}
                  >
                    <Input type="text" placeholder="Digital Address" />
                  </FormBuilder>
                </div>
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="md:col-span-2"
                >
                  {form.formState.isSubmitting ? (
                    <span className="flex items-center">
                      Branch is being added{" "}
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Add Branch <GitBranchPlus className="ml-2 h-4 w-4" />
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    );
};

export default CreateBranch;
