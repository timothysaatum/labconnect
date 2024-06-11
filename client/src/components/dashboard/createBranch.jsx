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
import { Spotlight } from "@/components/ui/spotlight";
import { TextGenerateEffect } from "@/components/ui/text-generate";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { GitBranchPlus, Loader2 } from "lucide-react";
import React, { useEffect } from "react";
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

const CreateLab = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

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
      await axiosPrivate.post("/laboratory/create-branch/", data);
      queryClient.invalidateQueries(["userbranches"]);
      toast.success(`New branch - ${data?.name} added`, {
        position: "top-center",
        duration: 5000,
      });
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
    <div className="container max-sm:px-4" id="create-lab">
      <TextGenerateEffect
        words="Create laboratory Branch"
        className="text-lg text-right md:text-2xl my-4 from-[#6366F1] via-[#D946EF] to-[#FB7185] bg-gradient-to-l bg-clip-text text-transparent"
      />
      <Spotlight
        className="-top-40 -left-10 md:-top-20 md:-left-32 h-screen"
        fill="gray"
      />
      <div className="grid lg:grid-cols-2 gap-x-4">
        <div
          className="hidden lg:flex justify-center items-center"
          data-aos="fade-right"
        >
          <h1 className="text-6xl">An image will be here</h1>
        </div>
        <Form {...form}>
          <form
            className="flex flex-col gap-4 lg:p-6 rounded-lg"
            noValidate
            onSubmit={form.handleSubmit(onSubmit)}
            data-aos="zoom-out"
          >
            <FormBuilder name={"name"} label={"Branch name"} message={true}>
              <Input type="text" placeholder="branch name" />
            </FormBuilder>
            <FormField
              name="manager"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assign Branch Manager</FormLabel>
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
                        <SelectItem value={region.value} key={region.value}>
                          {region?.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormBuilder name={"email"} label={"Branch Email"}>
              <Input type="email" placeholder="branch email" />
            </FormBuilder>
            <FormBuilder name={"phone"} label={"Branch Contact"}>
              <PhoneInput defaultCountry="GH" international />
            </FormBuilder>
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
                        <SelectItem value={region.value} key={region.value}>
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
            <FormBuilder name={"digital_address"} label={"Digital Address"}>
              <Input type="text" placeholder="Digital Address" />
            </FormBuilder>
            <Button type="submit" disabled={form.formState.isSubmitting}>
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
            </Button>{" "}
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateLab;
