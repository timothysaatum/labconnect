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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Textarea } from "@/components/ui/textarea";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { selectCurrentUser } from "@/redux/auth/authSlice";
import { Loader2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateLabSchema } from "@/lib/schema";
import LabLogo from "/images/defaultlabLogo.jpg";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { useFetchUserLab } from "@/api/queries";
import MagicButton from "@/components/ui/magicButton";

const CreateLab = ({ step, setStep }) => {
  const user = useSelector(selectCurrentUser);
  const axiosPrivate = useAxiosPrivate();
  const [imagefile, setImagefile] = useState(null);
  const [imagefileUrl, setImagefileUrl] = useState(null);

  const form = useForm({
    resolver: zodResolver(CreateLabSchema),
    defaultValues: {
      created_by: user.id,
      name: "",
      main_email: "",
      main_phone: "",
      herfra_id: "",
      description: "",
      postal_address: "",
      website: "",
    },
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

  const { data: userlab, isError, isFetching } = useFetchUserLab();

  useEffect(() => {
    if (userlab?.data?.length > 0) {
      form.setValue("name", userlab?.data[0]?.name);
      form.setValue("main_email", userlab?.data[0]?.main_email);
      form.setValue("main_phone", userlab?.data[0]?.main_phone);
      form.setValue("herfra_id", userlab?.data[0]?.herfra_id);
      form.setValue("description", userlab?.data[0]?.description);
      form.setValue("website", userlab?.data[0]?.website);
      form.setValue("postal_address", userlab?.data[0]?.postal_address);
      form.setValue("logo", userlab?.data[0]?.logo);
      setImagefileUrl(userlab?.data[0]?.logo);
    }
  }, [userlab]);

  const filePickeRef = useRef();
  const handleImageChange = (e) => {
    const file = e.target.files;
    if (file) {
      setImagefile(file);
      setImagefileUrl(URL.createObjectURL(file[0]));
    }
    form.clearErrors("logo");
  };
  useEffect(() => {
    console.log(imagefile);
    form.setValue("logo", imagefile);
  }, [imagefile]);

  const onSubmit = async (data) => {
    console.log(data);
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
      toast.success("Laboratory Created , Just one more step to get started", {
        position: "top-center",
      });
      setStep(2);
    } catch (error) {
      for (const field in error?.response?.data) {
        form.setError(field, {
          type: "manual",
          message: error.response.data[field][0],
        });
      }
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
      className={`container relative max-sm:px-4 overflow-x-hidden pt-4 md:pt-10`}
      id="create-lab"
    >
      <div className="max-w-6xl mx-auto">
        <h3 className="text-lg lg:hidden md:text-2xl lg:text-4xl my-4 from-[#6366F1] to-[#D946EF] bg-gradient-to-l bg-clip-text text-transparent drop-shadow-2xl">
          Create laboratory
        </h3>
        <Form {...form}>
          <form
            className="p-3 lg:p-6 grid md:grid-cols-3 gap-10 rounded-lg border-2  "
            noValidate
            onSubmit={form.handleSubmit(onSubmit)}
            data-aos="zoom-out"
          >
            <div className="col-span-3 lg:col-span-2 grid md:grid-cols-2 gap-10">
              <div className="flex flex-col gap-4">
                <FormBuilder name={"name"} label="Laboratory name">
                  <Input type="text" placeholder="laboratory name" />
                </FormBuilder>
                <FormBuilder name={"main_email"} label="Laboratory Email">
                  <Input type="email" placeholder="laboratory email" />
                </FormBuilder>
                <FormBuilder
                  name={"main_phone"}
                  label="Laboratory Phone number"
                >
                  <PhoneInput defaultCountry="GH" placeholder="Phone number" />
                </FormBuilder>
              </div>
              <div className="flex flex-col gap-4">
                <FormBuilder
                  name={"postal_address"}
                  label="Laboratory Postal Address"
                >
                  <Input type="text" placeholder="laboratory postal address" />
                </FormBuilder>
                <FormBuilder name={"herfra_id"} label="Herfra Id" message>
                  <Input type="text" placeholder="herfra Id" />
                </FormBuilder>
                <FormBuilder
                  name="website"
                  label="Laboratory Website (Optional)"
                  message={true}
                >
                  <Input type="text" placeholder="website" />
                </FormBuilder>
              </div>
              <FormBuilder
                name={"description"}
                label="Laboratory Bio"
                className="md:col-span-2"
              >
                <Textarea
                  className="resize-none"
                  placeholder="laboratory description"
                />
              </FormBuilder>
              <FormField
                name="logo"
                render={({}) => (
                  <FormItem className="lg:hidden md:col-span-2">
                    <FormLabel>Choose Logo (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        {...fileref}
                        accept="image/*"
                        onChange={handleImageChange}
                        ref={filePickeRef}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <MagicButton
                type="submit"
                title={"Proceed"}
                disabled={form.formState.isSubmitting}
                btnClasses={"col-span-1 "}
                icon={
                  form.formState.isSubmitting ? (
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  ) : null
                }
                position={"right"}
              />
            </div>
            <div className="hidden  lg:flex justify-center items-center flex-col gap-6">
              <h3 className="text-lg text-center md:text-2xl lg:text-4xl my-4 from-[#6366F1] to-[#D946EF] bg-gradient-to-l bg-clip-text text-transparent drop-shadow-2xl">
                Create laboratory
              </h3>
              <p
                className={`text-xl font-bold tracking-widest  ${
                  form?.formState?.errors?.logo
                    ? "text-destructive/75"
                    : "text-muted-foreground"
                }`}
              >
                Choose your logo
              </p>
              <BackgroundGradient className="rounded-full">
                <img
                  src={imagefileUrl || LabLogo}
                  alt="laboratory logo"
                  onClick={() => filePickeRef.current.click()}
                  className="rounded-full w-72 h-72 object-center cursor-pointer"
                />
              </BackgroundGradient>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateLab;
