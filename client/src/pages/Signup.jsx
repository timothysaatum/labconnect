import { Alert, Button, Toast } from "flowbite-react";
import { useEffect, useState } from "react";
import StepTwo from "../components/clinician/StepTwo.signup";
import StepThree from "../components/clinician/StepThree.signup";
import StepFour from "../components/clinician/stepFour.signup";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { DevTool } from "@hookform/devtools";
import { useForm } from "react-hook-form";
import StepOne from "../components/clinician/stepOne.signup";
import {useDispatch} from 'react-redux'

export default function SignUp() {
  const [notify, setNotify] = useState(false);

  const dispatch = useDispatch()

  const [step, setStep] = useState(1);
  const form = useForm();
  const {
    control,
    handleSubmit,
    trigger,
    watch,
    formState: { isSubmitting, errors, isSubmit },
    setError,
  } = form;

  const onSubmit = async (data) => {
    try {
      const response = await fetch(
        "http://localhost:8000/users/create-account/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const result = await response.json();
      if (response.ok) {
        console.log(result);
        setNotify(true);
         setTimeout(() => {
           setNotify(false); // Hide the alert after 3 seconds
         }, 3000);
         dispa
      } else {
        // If the response is not ok (status code is not 2xx), set the error messages
        for (const field in result) {
          setError(field, {
            type: "manual",
            message: result[field][0],
          });
        }
      }

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log(errors);
  }, [errors]);
  console.log(errors.email?.message);
  // awaiting backend
  const accountType = watch("accountType");
  const handlenextStep = async () => {
    let fieldsToValidate;

    switch (step) {
      case 1:
        fieldsToValidate = ["accountType"];
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
      default:
        fieldsToValidate = [];
        break;
      // Add more cases for more steps
    }

    const isValid = await trigger(fieldsToValidate);

    if (isValid) {
      setStep((prevStep) => prevStep + 1);
    }
  };

  return (
    <div className="min-h-dvh mt-12">
      <div className="flex p-3 max-w-4xl mx-auto flex-col md:flex-row gap-10 md:items-center">
        <div className="flex-1">
          <h2 className="text-5xl text-green-400 font-semibold drop-shadow-xl"></h2>
          <p className="text-sm text-gray-400">
            Sign up the continue using our services
          </p>
        </div>
        <div className="flex-1">
          {step !== 1 && (
            <IoArrowBackCircleOutline
              className="text-4xl text-green-400 cursor-pointer"
              onClick={() => setStep((prevStep) => prevStep - 1)}
            />
          )}
          <form
            className="flex flex-col gap-4 mt-2"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
          >
            {step === 1 && <StepOne form={form} />}
            {accountType === "clinician" && step === 2 && (
              <StepTwo form={form} />
            )}
            {accountType === "clinician" && step === 3 && (
              <StepThree form={form} />
            )}
            {step === 4 && <StepFour form={form} />}
            <Button
              gradientDuoTone="greenToBlue"
              onClick={step === 4 ? undefined : handlenextStep}
              type={step === 4 ? "submit" : "button"}
              isProcessing={isSubmitting}
              disabled={isSubmitting}
            >
              {step === 4 ? "Submit" : "Proceed"}
            </Button>
          </form>
          {notify && (
            <Alert
              color="success"
              className="mt-4"
              onDismiss={() => setNotify(false)}
            >
              <h3>Account created Successfully</h3>
            </Alert>
          )}
          <DevTool control={control} placement="top-left" />
        </div>
      </div>
    </div>
  );
}
