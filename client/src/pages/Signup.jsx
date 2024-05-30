import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupSchema } from "@/lib/schema";
import { FormBuilder } from "@/components/formbuilder";
import { Input } from "@/components/ui/input";
import { Form, FormMessage } from "@/components/ui/form";
import { DevTool } from "@hookform/devtools";
import {
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { PhoneInput } from "@/components/ui/phone-input";
import { ScrollArea } from "@/components/ui/scroll-area";
import SelectComponent from "@/components/selectcomponent";
import { TermsandConditions } from "@/components/auth/T&c";
import axios from "@/api/axios";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Signup() {
  const form = useForm({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      account_type: "",
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      id_number:"",
      gender: "",
      digital_address: "",
      password: "",
      password_confirmation: "",
      tc: false,
    },
  });
  const navigate = useNavigate();
  const accounts = [
    { value: "Laboratory", label: "Laboratory Services" },
    { value: "Health Worker", label: "Health Service Provider" },
    { value: "Delivery", label: "Delivery Agent" },
  ];
  const gender = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
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
  
  const onSubmit = async (data) => {
    try {
      await axios.post("/user/create-account/", data, {
        headers: {
          "Content-Type": "application/Json",
        },
      });
      navigate("/verify-email");
      toast.success("confirm email with otp sent to your email", {
        position: "top-center",
      });
    } catch (error) {
      for (const field in error?.response?.data) {
        form.setError(field, {
          type: "manual",
          message: error.response.data[field][0],
        });
      }
    }
  };
  return (
    <div className="px-2">
      <Card className="mx-auto max-w-[34rem] mt-10 ">
        <CardHeader className="px-2 sm:px-6">
          <CardTitle className="text-2xl flex gap-2 item-center">
            Create Account
          </CardTitle>
          <CardDescription>
            Enter your personal details below to create an account with
            labConnect
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Form {...form}>
            <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
              <ScrollArea className="h-[320px] 2xl:h-[450px]">
                <div className="flex flex-col gap-5 px-4">
                  <FormField
                    control={form.control}
                    name="account_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          How do you intend to use our services
                        </FormLabel>
                        <SelectComponent
                          items={accounts}
                          field={field}
                          placeholder={"Choose your account type"}
                        />
                        <FormMessage />
                        <FormDescription>
                          Note that this field can not be changed later
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  <FormBuilder
                    label={"First name"}
                    name={"first_name"}
                    message={true}
                  >
                    <Input type="text" placeholder="first name" />
                  </FormBuilder>
                  <FormBuilder
                    label={"Last name"}
                    name={"last_name"}
                    message={true}
                  >
                    <Input type="text" placeholder="last name" />
                  </FormBuilder>
                  <FormBuilder label={"Email"} name={"email"} message={true}>
                    <Input type="email" placeholder="email" />
                  </FormBuilder>
                  <FormBuilder
                    label={"National ID number"}
                    name={"id_number"}
                    message={true}
                  >
                    <Input type="text" placeholder="id number" />
                  </FormBuilder>
                  <FormBuilder label={"Phone number"} name={"phone_number"}>
                    <PhoneInput defaultCountry="GH" international />
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormBuilder
                    label={"Digital Address"}
                    name={"digital_address"}
                    message={true}
                  >
                    <Input type="text" placeholder="digital address" />
                  </FormBuilder>
                  <FormBuilder
                    label={"Password"}
                    name={"password"}
                    message={true}
                  >
                    <Input type="password" placeholder="Choose a password" />
                  </FormBuilder>
                  <FormBuilder
                    label={"Confirm Password"}
                    name={"password_confirmation"}
                    message={true}
                  >
                    <Input type="password" placeholder="Confirm Password" />
                  </FormBuilder>
                </div>
              </ScrollArea>
              <TermsandConditions control={form.control} />
              <div className="p-4">
                <Button className="w-full">
                  Sign Up{" "}
                  {form.formState.isSubmitting && (
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  )}
                </Button>
                <div className="mt-4 text-center text-sm">
                  Already have an account?{" "}
                  <Link to="/sign-in" className="underline">
                    Sign in
                  </Link>
                </div>
              </div>
            </form>
            <DevTool control={form.control} />
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
