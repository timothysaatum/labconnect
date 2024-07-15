import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "@/api/axios";

import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { DotBackground } from "@/components/ui/dotbackground";
import { useState } from "react";
import UserDetails from "@/components/auth/signUpTwo";
import Passwords from "@/components/auth/signupThree";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2 } from "lucide-react";
import { ManagerAcceptSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";

const branchManagerInviteAccept = () => {
  const [step, setStep] = useState(0);
  const { uidb64, token } = useParams();

  const form = useForm({
    resolver: zodResolver(ManagerAcceptSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      password: "",
      password_confirmation: "",
      tc: false,
    },
  });
  const fieldToStep = {
    first_name: 0,
    last_name: 0,
    email: 0,
    phone: 0,
    password: 1,
    password_confirmation: 1,
    tc: 1,
  };
  const formStep = () => {
    switch (step) {
      case 0:
        return <UserDetails />;
      case 1:
        return <Passwords form={form} />;
      default:
        return null;
    }
  };
  console.log(token);
  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        `/user/branch-manager-accept-invite/${uidb64}/${token}/`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(response?.data?.message, {
        position: "top-center",
      });
      //   navigate("/sign-in", { replace: true });
    } catch (error) {
      console.log(error);
      if (error?.response?.status === 401) {
        toast.error(error.response.data.detail, {
          position: "top-center",
        });
      } else {
        toast.error("An error occurred", {
          position: "top-center",
        });
      }
    }
  };

  const handleNextStep = async () => {
    let fieldToValidate;

    switch (step) {
      case 0:
        fieldToValidate = ["first_name", "last_name", "email", "phone_number"];
        break;
      case 1:
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
  return (
    <DotBackground>
      <div className="px-2 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Branch Manager Invite</CardTitle>
            <CardDescription>
              Fill in the form below to accept the invite
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                {formStep()}
                <div className="flex justify-between items-center mt-5">
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
                  {step < 1 ? (
                    <Button
                      onClick={handleNextStep}
                      type="button"
                      className="w-36"
                    >
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
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </DotBackground>
  );
};

export default branchManagerInviteAccept;
