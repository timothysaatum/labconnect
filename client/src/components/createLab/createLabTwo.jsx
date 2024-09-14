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
import { CreateLabSchema, SignupSchema } from "@/lib/schema";
import { Form } from "@/components/ui/form";

import { useEffect, useState } from "react";

import { ChevronLeft, Loader2 } from "lucide-react";

import LabName from "./createLabTwoB";
import logo from "/images/logo.png";
import CreateLabTwoC from "./createLabTwoC";
import BlurFade from "../magicui/blur-fade";
import Herfra from "./createLabTwoD";
import Others from "./createLabTwoE";
import LabLogo from "./labLogo";
import { useCreateLab } from "@/lib/formactions";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/auth/authSlice";

export default function CreateLab() {
  const [step, setStep] = useState(0);
  const user = useSelector(selectCurrentUser);
  const form = useForm({
    resolver: zodResolver(CreateLabSchema),
    defaultValues: {
      created_by: user?.user_id,
      name: "",
      main_phone: "",
      main_email: "",
      phone_number: "",
      postal_address: "",
      herfra_id: "",
      website: "",
    },
  });
  const fieldToStep = {
    name: 0,
    main_email: 1,
    main_phone: 1,
    postal_address: 1,
    herfra_id: 2,
    website: 3,
    description: 3,
    logo: 4,
  };
  const onCreateLab = useCreateLab(form, setStep, fieldToStep);

  const handleNextStep = async () => {
    let fieldToValidate;

    switch (step) {
      case 0:
        fieldToValidate = ["name"];
        break;
      case 1:
        fieldToValidate = ["main_email", "main_phone", "postal_address"];
        break;
      case 2:
        fieldToValidate = ["website", "description", "herfra_id"];
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

  const formStep = () => {
    switch (step) {
      case 0:
        return <LabName form={form} />;
      case 1:
        return <CreateLabTwoC />;
      case 2:
        return <Others form={form} />;
      case 3:
        return <LabLogo form={form} />;
      default:
        return null;
    }
  };
  return (
    <div className="px-14 pb-8">
      <Form {...form}>
        <form
          noValidate
          onSubmit={form.handleSubmit(onCreateLab)}
          className="mx-auto"
        >
          <div className="flex flex-col gap-2 min-w-[350px]">{formStep()}</div>
          <div className="mt-5">
            <div className="flex justify-between items-center gap-3">
              {step > 0 && (
                <Button
                  onClick={handlePrevSTep}
                  type="button"
                  variant="outline"
                  size="icon"
                >
                  <ChevronLeft className="h-4 w-4 " />
                </Button>
              )}
              {step < 3 ? (
                <Button
                  onClick={handleNextStep}
                  type="button"
                  size="lg"
                  className="w-full bg-teal-600 hover:bg-teal-700"
                >
                  Proceed
                </Button>
              ) : undefined}
              {step === 3 ? (
                <div className="flex-1">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-teal-600 hover:bg-teal-700"
                    disabled={form.formState.isSubmitting || step < 3}
                  >
                    {form.formState.isSubmitting ? (
                      <span className="flex items-center">
                        Creating Your Laboratory
                        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      </span>
                    ) : (
                      <span className="flex items-center">
                        Create Laboratory
                      </span>
                    )}
                  </Button>
                </div>
              ) : undefined}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
