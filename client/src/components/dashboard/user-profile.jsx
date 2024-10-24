import React, { useEffect } from "react";
import { Form } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { PhoneInput } from "../ui/phone-input";
import { FormBuilder } from "../formbuilder";
import SelectComponent from "../selectcomponent";
import { useFetchUserDetails } from "@/api/queries";
import { useForm } from "react-hook-form";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrenttoken } from "@/redux/auth/authSlice";
import useRefreshToken from "@/hooks/useRefreshToken";
import { useQueryClient } from "@tanstack/react-query";

const UserProfile = () => {
  const dispatch = useDispatch();
  const refresh = useRefreshToken();
  const queryClient = useQueryClient();
  const gender = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
  ];
  const { data: user } = useFetchUserDetails();
  const accessToken = useSelector(selectCurrenttoken);
  const axiosPrivate = useAxiosPrivate();
  const userdata = user?.data?.data;

  const form = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      gender: "",
      id_number: "",
      digital_address: "",
      emergency_contact: "",
      bio: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await axiosPrivate.patch(
        `user/update-account/${userdata?.id}/`,
        data
      );
      refresh();
      queryClient.invalidateQueries(["User"]);
      toast.success("Profile updated successfully");
    } catch (error) {
      for (const field in error?.response?.data) {
        form.setError(field, {
          type: "manual",
          message: error.response.data[field][0],
        });
      }
    }
  };
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
    if (user) {
      form.setValue("first_name", userdata?.first_name);
      form.setValue("last_name", userdata?.last_name);
      form.setValue("email", userdata?.email);
      form.setValue("phone_number", userdata?.phone_number);
      form.setValue("gender", userdata?.gender);
      form.setValue("id_number", userdata?.id_number);
      form.setValue("digital_address", userdata?.digital_address);
    }
  }, [user]);
  return (
    <Form {...form}>
      <form
        className="flex-1"
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <h3 className="pb-2 pt-4 border-b text-lg md:text-xl font-medium">
          User Profile
        </h3>
        <div className="flex flex-col gap-4 mb-4 py-2">
          <FormBuilder name={"first_name"} label={"First name"} message={true}>
            <Input type="text" placeholder="first name" />
          </FormBuilder>
          <FormBuilder name={"last_name"} label={"Last name"} message>
            <Input type="text" placeholder="last name" />
          </FormBuilder>
          <FormBuilder name={"email"} label={"User email"} message>
            <Input type="text" placeholder="email" disabled />
          </FormBuilder>
          <FormBuilder name={"phone_number"} label={"Phone number"} message>
            <PhoneInput defaultCountry="GH" />
          </FormBuilder>
          <FormBuilder
            name={`emergency_contact`}
            label={"Emergency contact"}
            message
          >
            <PhoneInput defaultCountry="GH" />
          </FormBuilder>
          <FormBuilder
            name={`id_number`}
            label={"Ghana Card number"}
            message
          >
            <Input type="text" placeholder="Id number" />
          </FormBuilder>
          <FormBuilder
            name={`digital_address`}
            label={"Digital aadress"}
            message
          >
            <Input type="text" placeholder="digital adress" />
          </FormBuilder>
        </div>

        <Button type="submit" className="w-40">
          Update Profile
        </Button>
      </form>
    </Form>
  );
};

export default UserProfile;
