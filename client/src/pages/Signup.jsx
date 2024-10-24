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
import { Form } from "@/components/ui/form";

import { useState } from "react";
import { toast } from "sonner";
import AccountType from "@/components/auth/signupOne";
import UserDetails from "@/components/auth/signUpTwo";
import Passwords from "@/components/auth/signupThree";
import { ChevronLeft, Loader2 } from "lucide-react";
import axios from "@/api/axios";
import { DotBackground } from "@/components/ui/dotbackground";

export default function Signup() {
  const [step, setStep] = useState(0);
  const form = useForm({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      account_type: "",
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      id_number: "",
      digital_address: "",
      password: "",
      password_confirmation: "",
      tc: false,
    },
  });
  const fieldToStep = {
    account_type: 0,
    first_name: 1,
    last_name: 1,
    email: 1,
    phone: 1,
    password: 2,
    password_confirmation: 2,
    tc: 2,
  };
  const navigate = useNavigate();

  const handleNextStep = async () => {
    let fieldToValidate;

    switch (step) {
      case 0:
        fieldToValidate = ["account_type"];
        break;
      case 1:
        fieldToValidate = ["first_name", "last_name", "email", "phone_number"];
        break;
      case 2:
        fieldToValidate = ["password", "password_confirmation", "tc"];
        break;
      default:
        fieldToValidate = [];
    }

    const isValid = await form.trigger(fieldToValidate);

    if (isValid) {
      setStep((prevStep) => prevStep + 1);
    }
  };
  const handlePrevSTep = () => {
    if (step > 0) {
      setStep((prevStep) => prevStep - 1);
    }
  };
  const onSubmit = async (data) => {
    try {
      await axios.post("/user/create-account/", data, {
        headers: {
          "Content-Type": "application/Json",
        },
      });
      navigate("/verify-email");
      toast(
        "A one-time password has been sent to your email, enter it below.",
        {
          position: "top-center",
        }
      );
    } catch (error) {
      console.log(error);
      for (const field in error?.response?.data) {
        form.setError(field, {
          type: "manual",
          message: error.response.data[field][0],
        });
        // Look up the step associated with the field and set the current step
        const step = fieldToStep[field];
        if (step !== undefined) {
          setStep(step);
          break; // Exit the loop after finding the first error
        }
      }
    }
  };
  const formStep = () => {
    switch (step) {
      case 0:
        return <AccountType form={form} />;
      case 1:
        return <UserDetails />;
      case 2:
        return <Passwords form={form} />;
      default:
        return null;
    }
  };
  return (
    <DotBackground>
      <Card className="mx-auto max-w-lg mt-10">
        <CardHeader>
          <CardTitle className="text-xl ">Create Account</CardTitle>
          <CardDescription>
            Enter your personal details below to create an account with
            labConnect
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-2">{formStep()}</div>
              <div className="mt-5">
                <div className="flex justify-between items-center">
                  {step > 0 && (
                    <Button
                      onClick={handlePrevSTep}
                      type="button"
                      variant="outline"
                      size="icon"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  )}
                  {step < 2 ? (
                    <Button onClick={handleNextStep} type="button" size="lg">
                      Proceed
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={
                        form.formState.isSubmitting ||
                        form.watch("password") === "" ||
                        form.watch("password_confirmation") === ""
                      }
                    >
                      {form.formState.isSubmitting ? (
                        <span className="flex items-center">
                          Creating Account
                          <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                        </span>
                      ) : (
                        <span className="flex items-center">
                          Create account
                        </span>
                      )}
                    </Button>
                  )}
                </div>
                <div className="mt-4 text-center text-sm">
                  Already have an account?{" "}
                  <Link to="/sign-in" className="underline">
                    Sign in
                  </Link>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </DotBackground>
  );
}
