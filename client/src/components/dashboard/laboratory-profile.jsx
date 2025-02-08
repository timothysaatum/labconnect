import React, { useEffect, useMemo, useRef, useState } from "react";
import { Form } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { PhoneInput } from "../ui/phone-input";
import { FormBuilder } from "../formbuilder";
import { Textarea } from "../ui/textarea";
import { useFetchUserLab } from "@/api/queries";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import { useQueryClient } from "@tanstack/react-query";
import { CreateLabSchema } from "../../lib/schema";

const LaboratoryProfile = () => {
  const { data: userlab } = useFetchUserLab();
  const queryClient = useQueryClient();
  const axiosPrivate = useAxiosPrivate();
  const filePickRef = useRef(null);
  const [imageFile, setImagefile] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files;
    if (file) {
      setImagefile(file);
    }
    form.clearErrors("logo");
  };

  useEffect(() => {
    const validateLogo = async () => {
      const isValid = await form.trigger("logo");
      if (!isValid && imageFile?.length > 0) {
        setImagefile(null);
        form.setValue("logo", undefined);
        toast.error(form.formState.errors.logo.message);
      } else {
        form.setValue("logo", imageFile);
      }
    };
    validateLogo();
  }, [imageFile]);

  const form = useForm({
    resolver: zodResolver(CreateLabSchema),
    defaultValues: {
      name: "",
      main_email: "",
      main_phone: "",
      website: "",
      description: "",
      herfra_id: "",
      postal_address: "",
    },
  });
  const fileref = form.register("logo");

  useEffect(() => {
    if (userlab) {
      form.setValue("name", userlab?.data[0]?.name);
      form.setValue("main_email", userlab?.data[0]?.main_email);
      form.setValue("main_phone", userlab?.data[0]?.main_phone);
      form.setValue("herfra_id", userlab?.data[0]?.herfra_id);
      form.setValue("description", userlab?.data[0]?.description);
      form.setValue("website", userlab?.data[0]?.website);
      form.setValue("postal_address", userlab?.data[0]?.postal_address);
    }
  }, [userlab?.data]);

  const onSubmit = async (data) => {
    let newData = {
      ...data,
      website:
        data?.website && !data.website.startsWith("http")
          ? `http://${data.website}`
          : data.website,
    };
    console.log(newData.logo instanceof FileList);

    if (newData.logo instanceof FileList && newData.logo.length > 0) {
      newData.logo = newData.logo[0];
    } else {
      delete newData.logo;
    }

    try {
      const formData = new FormData();

      for (const key in newData) {
        formData.append(key, newData[key]);
      }
      await axiosPrivate.patch(
        `laboratory/update/${userlab?.data[0]?.id}/`,
        formData,

        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success("Profile updated successfully");
      queryClient.invalidateQueries(["Laboratory"]);
    } catch (error) {
      console.log(error);
      for (const field in error?.response?.data) {
        if (field === "logo") {
          toast.error(error.response.data[field][0]);
        }
        form.setError(field, {
          type: "manual",
          message: error.response.data[field][0],
        });
        // Look up the step associated with the field and set the current step
      }
    }
  };

  return (
    <Form {...form}>
      <form className="flex-1" onSubmit={form.handleSubmit(onSubmit)}>
        <h3 className="pb-2 pt-4 border-b text-lg md:text-xl font-medium">
          Laboratory Profile{" "}
        </h3>
        <div className="flex flex-col items-center gap-4 mb-4 py-2">
          <p
            className={`text-md font-bold tracking-wider  ${
              form?.formState?.errors?.logo ? "text-destructive/75" : ""
            }`}
          >
            Choose your logo
          </p>
          <img
            src={
              imageFile && imageFile[0]
                ? URL.createObjectURL(imageFile[0])
                : userlab?.data[0]?.logo
                  ? userlab?.data[0]?.logo
                  : null
            }
            alt="laboratory logo"
            onClick={() => filePickRef.current.click()}
            className="rounded-full w-44 h-44 object-cover max-h-36 max-w-36 cursor-pointer ring-2 ring-primary drop-shadow-xl shadow-lg"
          />
        </div>

        <div className="flex flex-col gap-4 mb-4 py-2">
          <FormBuilder
            name={"name"}
            description={
              "The name of your laboratory as it will appear on your reports"
            }
            label={"Laboratory name"}
          >
            <Input type="text" />
          </FormBuilder>
          <FormBuilder
            name={"main_email"}
            description={
              "The email address associated with your laboratory. Important notifications will be sent to this address"
            }
            label={"Laboratory email"}
          >
            <Input type="email" />
          </FormBuilder>
          <FormBuilder name={"main_phone"} label={"Laboratory Tel."}>
            <PhoneInput defaultCountry="GH" />
          </FormBuilder>
          <FormBuilder name={"postal_address"} label={"Postal address"}>
            <Input type="text" />
          </FormBuilder>
          <FormBuilder name={"herfra_id"} label={"HEFRA ID"}>
            <Input type="text" />
          </FormBuilder>
          <FormBuilder
            name={"website"}
            label={"Laboratory website (Optional)"}
            description={
              "If your laboratory has a website you want user to check out. add it here "
            }
          >
            <Input type="text" />
          </FormBuilder>
          <FormField
            name="logo"
            render={({}) => (
              <FormItem className="hidden">
                <FormLabel>Update logo</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    {...fileref}
                    accept="image/*"
                    onChange={handleImageChange}
                    ref={filePickRef}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormBuilder
            name={"description"}
            label={"Laboratory Bio"}
            description={"Enter a brief overview of your laboratory here."}
          >
            <Textarea className="resize-none" rows={5} maxLength={250} />
          </FormBuilder>
        </div>

        <Button type="submit" className="w-40">
          Update Profile
        </Button>
      </form>
    </Form>
  );
};

export default LaboratoryProfile;
