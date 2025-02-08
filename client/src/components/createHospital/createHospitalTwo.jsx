import { Button } from "@/components/ui/button";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateLabSchema } from "@/lib/schema";
import { Form } from "@/components/ui/form";

import { useEffect, useState } from "react";

import { ChevronLeft, Loader2 } from "lucide-react";

import logo from "/images/logo.png";
import BlurFade from "../magicui/blur-fade";
import { useCreateLab } from "@/lib/formactions";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/auth/authSlice";
import HospitalName from "./createHospitalTwoB";
import HospitalLocation from "./createHospitalTwoC";
import HospitalBank from "./createHospitalTwoD";
import { useAddHospital } from "../../lib/formactions";

export default function CreateHospitalTwo() {
  const [step, setStep] = useState(0);
  const form = useForm({
    // resolver: zodResolver(CreateLabSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      postal_address: "",
      digital_address: "",
      hospital_type: "",
      region: "",
    },
  });
  const fieldToStep = {
    name: 0,
    email: 0,
    phone: 0,
    hospital_type: 0,
    postal_address: 1,
    digital_address: 1,
    town: 1,
    region: 1,
  };
  const onHospitalAdd = useAddHospital(form, fieldToStep, setStep);

  const handleNextStep = async () => {
    let fieldToValidate;

    switch (step) {
      case 0:
        fieldToValidate = ["name,phone,email,type"];
        break;
      case 1:
        fieldToValidate = [
          "town",
          "region",
          "postal_address",
          "digital_address",
        ];
        break;
      case 2:
        fieldToValidate = ["bank", "account_number"];
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
        return <HospitalName form={form} />;
      case 1:
        return <HospitalLocation form={form} />;
      case 2:
        return <HospitalBank form={form} />;
      default:
        return null;
    }
  };
  return (
    <div className="flex justify-center items-center min-h-dvh max-md:flex-col gap-5">
      <BlurFade inView delay={0.5}>
        <div>
          <img src={logo} alt="LabConnect's logo" className="w-56 md:w-72" />
        </div>
      </BlurFade>

      <Form {...form}>
        <form noValidate onSubmit={form.handleSubmit(onHospitalAdd)}>
          <div className="flex flex-col gap-2 min-w-[350px]">{formStep()}</div>
          <div className="mt-5">
            <div className="flex justify-between items-center gap-6">
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
              ) : null}
              {step === 2 ? (
                <div className="flex-1">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? (
                      <span className="flex items-center">
                        Adding Your Hospital
                        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      </span>
                    ) : (
                      <span className="flex items-center">Add Hospital</span>
                    )}
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
