import React, { useEffect } from "react";
import { Form, FormField, FormItem, FormLabel } from "../ui/form";
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
import { selectCurrenttoken, setCredentials } from "@/redux/auth/authSlice";

const UserProfile = () => {
  const dispatch = useDispatch();
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
      id_number: "",
      gender: "",
      digital_address: "",
    },
  });
  const onSubmit = async (data) => {
    try {
      const response = await axiosPrivate.put(
        `user/update-account/${userdata?.id}/`,
        data
      );
      toast.success("Profile updated successfully");
      dispatch(
        setCredentials({
          accessToken,
          data: response.data.data,
        })
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
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
          <FormBuilder name={"first_name"} label={"First name"}>
            <Input type="text" placeholder="first name" />
          </FormBuilder>
          <FormBuilder name={"last_name"} label={"Last name"}>
            <Input type="text" placeholder="last name" />
          </FormBuilder>
          <FormBuilder name={"email"} label={"User email"}>
            <Input type="text" placeholder="email" disabled />
          </FormBuilder>
          <FormBuilder name={"phone_number"} label={"Phone number"}>
            <PhoneInput defaultCountry="GH" />
          </FormBuilder>
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <SelectComponent
                  items={gender}
                  field={field}
                  placeholder={"choose your gender"}
                />
              </FormItem>
            )}
          />
          <FormBuilder name={"id_number"} label={"Id number"}>
            <Input type="text" placeholder="Id number" />
          </FormBuilder>
          <FormBuilder name={"digital_address"} label={"Digital aadress"}>
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
