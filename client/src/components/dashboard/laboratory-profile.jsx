import React, { useEffect } from "react";
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

const LaboratoryProfile = () => {
  const { data: userlab } = useFetchUserLab();
  const axiosPrivate = useAxiosPrivate();
  const form = useForm({
    defaultValues: {
      laboratory_name: "",
      main_email: "",
      main_phone: "",
      website: "",
      description: "",
      hefra_id: "",
    },
  });
  useEffect(() => {
    if (userlab) {
      form.setValue("laboratory_name", userlab?.data[0]?.laboratory_name);
      form.setValue("main_email", userlab?.data[0]?.main_email);
      form.setValue("main_phone", userlab?.data[0]?.main_phone);
      form.setValue("hefra_id", userlab?.data[0]?.herfra_id);
      form.setValue("description", userlab?.data[0]?.description);
      form.setValue("website", userlab?.data[0]?.website);
    }
  }, [userlab]);
  const onSubmit = async (data) => {
    try {
      await axiosPrivate.patch();
    } catch (error) {
      toast.error("An error occured, unable to update lab");
    }
  };
  return (
    <Form {...form}>
      <form className="flex-1" onSubmit={form.handleSubmit(onSubmit)}>
        <h3 className="pb-2 pt-4 border-b text-lg md:text-xl font-medium">
          Laboratory Profile{" "}
        </h3>
        <div className="flex flex-col gap-4 mb-4 py-2">
          <FormBuilder
            name={"laboratory_name"}
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
            <PhoneInput defaultCountry="GH"/>
          </FormBuilder>
          <FormBuilder name={"hefra_id"} label={"HEFRA ID"}>
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
          <FormBuilder
            name={"description"}
            label={"Laboratory Bio"}
            description={"enter a brief overview of your laboratory here"}
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
