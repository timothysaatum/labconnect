import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useForm } from "react-hook-form";
import { Form } from "../ui/form";
import { FormBuilder } from "../formbuilder";
import { Input } from "../ui/input";
import { PhoneInput } from "../ui/phone-input";
import { Button } from "../ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupSchema } from "@/lib/schema";
import axios from "@/api/axios";
import { toast } from "sonner";

const BranchManagerProfileComplete = () => {
  const form = useForm({
    // resolver: zodResolver(SignupSchema),
    defaultValues: {
      account_type: "",
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      id_number: "",
      gender: "",
      digital_address: "",
      password: "",
      password_confirmation: "",
      tc: false,
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
  const onSubmit = async (data) => {
    try {
      await axios.post("user/create-account/", data);
      toast.success("Invitation accepted", {
        position: "top-center",
      });
    } catch (error) {
      console.error(error);
      for (const field in error?.response?.data) {
        form.setError(field, {
          type: "manual",
          message: error.response.data[field][0],
        });
      }
    }
  };
  useEffect(() => {
    form.setValue("account_type", "Laboratory");
    form.setValue("tc", true);
  }, []);
  return (
    <div className="container py-4 lg:py-10 bg-muted/40">
      <Card className="mx-auto  max-w-4xl">
        <CardHeader>
          <CardTitle>Complete Profile</CardTitle>
          <CardDescription>
            you have been invited by (Laboratory name) to be a user. complete
            your profile so they can add you
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="flex flex-col gap-4 mb-0"
              noValidate
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormBuilder name={"first_name"} label="First name">
                <Input type="text" placeholder="first name" />
              </FormBuilder>
              <FormBuilder name={"last_name"} label="last name">
                <Input type="text" placeholder="last name" />
              </FormBuilder>
              <FormBuilder name={"email"} label="Email">
                <Input type="email" placeholder="email" />
              </FormBuilder>
              <FormBuilder name={"phone_number"} label="Phone number">
                <PhoneInput defaultCountry="GH" placeholder="Phone number" />
              </FormBuilder>
              <FormBuilder name={"id_number"} label="National Id">
                <Input type="text" placeholder="National Id" />
              </FormBuilder>
              <FormBuilder name={"digital_address"} label="Digital address">
                <Input type="text" placeholder="digital address" />
              </FormBuilder>
              <FormBuilder name={"gender"} label="Gender">
                <Input type="text" placeholder="firstname" />
              </FormBuilder>
              <FormBuilder name={"password"} label="password">
                <Input type="password" placeholder="password" />
              </FormBuilder>
              <FormBuilder
                name={"password_confirmation"}
                label="confirm Password"
              >
                <Input type="password" placeholder="confirm password" />
              </FormBuilder>
              <Button type="submit">Create Profile</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BranchManagerProfileComplete;
