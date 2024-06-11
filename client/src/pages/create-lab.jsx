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
import { Textarea } from "@/components/ui/textarea";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { selectCurrentUser } from "@/redux/auth/authSlice";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateLabSchema } from "@/lib/schema";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const CreateLab = ({ labcreated }) => {
  const user = useSelector(selectCurrentUser);
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(CreateLabSchema),
    defaultValues: {
      created_by: user.id,
      name: "",
      main_email: "",
      main_phone: "",
      herfra_id: "",
      description: "",
      website: "",
    },
    disabled: labcreated,
  });
  const fileref = form.register("logo");
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

  useEffect(() => {
    console.log(form.formState.errors);
  }, [form.formState.errors]);
  const onSubmit = async (data) => {
    if (data.logo instanceof FileList && data.logo.length > 0) {
      data.logo = data.logo[0];
    }
    let newData = {
      ...data,
      website:
        data?.website && !data.website.startsWith("http")
          ? `http://${data.website}`
          : data.website,
    };
    try {
      const formData = new FormData();

      for (const key in newData) {
        formData.append(key, newData[key]);
      }
      console.log(newData);
      await axiosPrivate.post(
        "laboratory/create/",
        formData,

        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      queryClient.invalidateQueries(["Laboratory"]);
      const element = document.getElementById("create-branch");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      toast.success("Laboratory Created , Just one more step to get started", {
        position: "top-center",
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
    <div
      className={`container max-sm:px-4 ${
        labcreated ? "pointer-events-none opacity-0.2" : ""
      }`}
      id="create-lab"
    >
      <TextGenerateEffect
        words="Create laboratory"
        className="text-lg md:text-2xl my-4 from-[#6366F1] via-[#D946EF] to-[#FB7185] bg-gradient-to-r bg-clip-text text-transparent"
      />
      <Spotlight
        className="-top-40 -left-10 md:-top-20 md:-left-32 h-screen"
        fill="gray"
      />
      <div className="grid lg:grid-cols-2 gap-x-4">
        <Form {...form}>
          <form
            className="flex flex-col gap-4 lg:p-6 rounded-lg"
            noValidate
            onSubmit={form.handleSubmit(onSubmit)}
            data-aos="zoom-out"
            aria-disabled
          >
            <FormBuilder name={"name"} label="Laboratory name">
              <Input type="text" placeholder="laboratory name" />
            </FormBuilder>
            <FormBuilder name={"main_email"} label="Laboratory Email">
              <Input type="email" placeholder="laboratory email" />
            </FormBuilder>
            <FormBuilder name={"main_phone"} label="Laboratory Phone number">
              <PhoneInput defaultCountry="GH" international />
            </FormBuilder>
            <FormBuilder
              name={"postal_address"}
              label="Laboratory Postal Address"
            >
              <Input type="text" placeholder="laboratory postal address" />
            </FormBuilder>
            <FormBuilder name={"herfra_id"} label="Herfra Id">
              <Input type="text" placeholder="herfra Id" />
            </FormBuilder>
            <FormBuilder name="website" label="Laboratory Website (Optional)">
              <Input type="text" placeholder="website" />
            </FormBuilder>
            <FormBuilder name={"description"} label="Laboratory Bio">
              <Textarea
                className="resize-none"
                placeholder="laboratory description"
              />
            </FormBuilder>
            <FormField
              name="logo"
              render={({}) => (
                <FormItem>
                  <FormLabel>Choose Logo (Optional)</FormLabel>
                  <FormControl>
                    <Input type="file" {...fileref} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit">
              Create laboratory profile
              {form.formState.isSubmitting && (
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              )}
            </Button>
          </form>
        </Form>
        <div
          className="hidden lg:flex justify-center items-center"
          data-aos="fade-left"
        >
          <h1 className="text-6xl">An image will be here</h1>
        </div>
      </div>
    </div>
  );
};

export default CreateLab;
