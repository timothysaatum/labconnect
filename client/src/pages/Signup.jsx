import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { AlertCircle, CircleChevronLeft, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import AccountType from "@/components/auth/signup.one";
import Personal from "@/components/auth/signup.two";
import Facility from "@/components/auth/signup.three";
import SetPasswords from "@/components/auth/signup.four";
import axios from "@/api/axios";
import { TermsandConditions } from "@/components/auth/T&c";
import { SignupSchema } from "@/lib/schema";
import { AnimatePresence } from "framer-motion";

export default function Signup() {
  const [serverErrors] = useState(null);
  const [step, setStep] = useState(1); // 1 for account type, 2 for personal details

  const form = useForm({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      account_type: "",
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      gender: "",
      staff_id: "",
      current_facility: "",
      emmergency_number: "",
      digital_address: "",
      password: "",
      password_confirmation: "",
      tc: false,
    },
  });

  const {
    trigger,
    setError,
    formState: { errors, isSubmitting },
  } = form;
  const fieldToStep = {
    account_type: 1,
    first_name: 2,
    last_name: 2,
    email: 2,
    phone: 2,
    gender: 2,
    staff_id: 3,
    current_facility: 3,
    emmergency_number: 3,
    digital_address: 3,
    password: 4,
    password_confirmation: 4,
    tc: 5,
  };
  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "/api/user/create-account/",
        JSON.stringify(data),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
    } catch (error) {
      for (const field in error.response.data) {
        setError(field, {
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
  const loginbtnref = useRef();

  const handlenextStep = async () => {
    let fieldsToValidate;

    switch (step) {
      case 1:
        fieldsToValidate = ["account_type"];
        break;
      case 2:
        fieldsToValidate = [
          "first_name",
          "email",
          "phone_number",
          "gender",
          "last_name",
        ];
        break;
      case 3:
        fieldsToValidate = [
          "staff_id",
          "current_facility",
          "emmergency_number",
          "digital_address",
        ];
        break;
      case 4:
        fieldsToValidate = ["password", "password_confirmation"];
        break;
      case 5:
        fieldsToValidate = ["tc"];
        break;
      default:
        fieldsToValidate = [];
        break;
      // Add more cases for more steps
    }

    const isValid = await trigger(fieldsToValidate);

    if (isValid) {
      setStep((prev) => prev + 1);
    }
  };
  const handlePrevStep = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };
  const MultistepFormState = () => {
    switch (step) {
      case 1:
        return (
          <AnimatePresence mode="wait">
            <AccountType form={form} errors={errors} />
          </AnimatePresence>
        );
      case 2:
        return (
          <AnimatePresence>
            <Personal form={form} />
          </AnimatePresence>
        );
      case 3:
        return (
          <AnimatePresence>
            <Facility form={form} />
          </AnimatePresence>
        );
      case 4:
        return <SetPasswords form={form} />;
      case 5:
        return <TermsandConditions form={form} errors={errors} />;
      default:
        return <AccountType form={form} errors={errors} />;
    }
  };
  return (
    <div className="px-2">
      <Card className="mx-auto max-w-[34rem] mt-10 ">
        <CardHeader className="px-2 sm:px-6">
          <CardTitle className="text-2xl flex gap-2 item-center">
            {step !== 1 && (
              <CircleChevronLeft
                className="text-gray-400 self-center"
                onClick={handlePrevStep}
              />
            )}{" "}
            Create Account
          </CardTitle>
          <CardDescription>
            Enter your details below to create an account
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2 sm:px-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid gap-4  overflow-y-auto pb-4 px-2"
              noValidate
            >
              <>{MultistepFormState()}</>
              <Button
                className="hidden"
                ref={loginbtnref}
                type={step === 5 ? "submit" : "button"}
              ></Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex-col bg-muted/50 pt-5 my-auto !px-2 sm:px-6">
          <Button
            onClick={() => {
              if (loginbtnref.current) {
                loginbtnref.current.click();
              }
              if (step !== 5) {
                handlenextStep();
              }
            }}
            className="w-full"
            disabled={isSubmitting}
          >
            {step === 5 ? "Submit" : "Proceed"}
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          </Button>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link to="/sign-in" className="underline">
              Sign in
            </Link>
          </div>
          {serverErrors && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{serverErrors}</AlertDescription>
            </Alert>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
