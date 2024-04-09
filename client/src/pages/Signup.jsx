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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DevTool } from "@hookform/devtools";
import { useRef, useState } from "react";
import { AlertCircle, CircleChevronLeft, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import AccountType from "@/components/auth/signup.one";
import Personal from "@/components/auth/signup.two";
import { isValidPhoneNumber } from "react-phone-number-input";
import Facility from "@/components/auth/signup.three";
import SetPasswords from "@/components/auth/signup.four";

const SignupSchema = z.object({
  AccountType: z.string().min(1, "Please select an account type"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone_number: z.string().refine(isValidPhoneNumber, "Invalid phone number"),
  gender: z.string().min(1, "please select a gender"),
  staff_id: z.string().min(1, "Staff ID is required"),
  facility_affiliated_with: z.string().min(1, "Facility is required"),
  emmergency_number: z
    .string()
    .refine(isValidPhoneNumber, "Invalid phone number"),
  digital_address: z.string().min(1, "Digital address is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirm_password: z
    .string()
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"],
});

export default function Signup() {
  const [serverErrors] = useState(null);
  const [step, setStep] = useState(4); // 1 for account type, 2 for personal details

  const form = useForm({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      AccountType: "",
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      gender: "",
      staff_id: "",
      facility_affiliated_with: "",
      emmergency_number: "",
      digital_address: "",
      password: "",
      confirm_password: "",
    },
  });

  const {
    trigger,
    formState: { errors, isSubmitting },
  } = form;
  function onSubmit(data) {
    console.log(data);
  }
  const loginbtnref = useRef();

  const handlenextStep = async () => {
    let fieldsToValidate;

    switch (step) {
      case 1:
        fieldsToValidate = ["AccountType"];
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
          "facility_affiliated_with",
          "emmergency_number",
          "digital_address",
        ];
        break;
      case 4:
        fieldsToValidate = ["password", "confirm_password"];
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
        return <AccountType form={form} errors={errors} />;
      case 2:
        return <Personal form={form} errors={errors} />;
      case 3:
        return <Facility form={form} errors={errors} />;
      case 4:
        return <SetPasswords form={form} errors={errors} />;
      default:
        return <AccountType form={form} errors={errors} />;
    }
  };
  return (
    <div className="px-2">
      <Card className="mx-auto max-w-[34rem] mt-10 ">
        <CardHeader className="px-2 sm:px-6">
          <CardTitle className="text-2xl flex gap-2 item-center">
            <CircleChevronLeft
              className="text-gray-400 self-center"
              onClick={handlePrevStep}
            />{" "}
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
            >
              <>{MultistepFormState()}</>
              <Button
                className="hidden"
                ref={loginbtnref}
                type={step === 4 ? "submit" : "button"}
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
              if (step !== 4) {
                handlenextStep();
              }
            }}
            className="w-full"
            disabled={isSubmitting}
          >
            {step === 4 ? "Submit" : "Proceed"}
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
      {/* <DevTool control={form.control} /> */}
    </div>
  );
}
