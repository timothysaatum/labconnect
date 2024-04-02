import { Alert, Button, Toast } from "flowbite-react";
import { useEffect, useState } from "react";
import StepTwo from "../components/clinician/StepTwo.signup";
import StepThree from "../components/clinician/StepThree.signup";
import StepFour from "../components/clinician/stepFour.signup";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { DevTool } from "@hookform/devtools";
import { useForm } from "react-hook-form";
import StepOne from "../components/clinician/stepOne.signup";
import { AnimatePresence, motion } from "framer-motion";
import Motion from "../components/motion";

export default function SignUp() {
  const [notify, setNotify] = useState(false);
  
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
  
    const fieldToStep = {
      has_laboratory: 1,
      first_name: 2,
      last_name: 2,
      email: 2,
      gender: 2,
      phone_number: 2,
      facility_affiliated_with: 3,
      staff_id: 3,
      emmergency_number: 3,
      digital_address: 3,
      password: 4,
      password_confirmation: 4,
    };

  const onSubmit = async (data) => {
    let has_laboratory = false;
    let is_clinician = false;
    let is_delivery = false;

    // Set the selected field to true
    switch (data.has_laboratory) {
      case "laboratory":
        has_laboratory = true;
        break;
      case "clinician":
        is_clinician = true;
        break;
      case "delivery":
        is_delivery = true;
        break;
    }

    // Add the fields to the data
    data = { ...data, has_laboratory, is_clinician, is_delivery };
    try {
      console.log(data)
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
      } else {
        // If the response is not ok (status code is not 2xx), set the error messages
        for (const field in result) {
          setError(field, {
            type: "manual",
            message: result[field][0],
          });
          // Look up the step associated with the field and set the current step
          const step = fieldToStep[field];
          if (step !== undefined) {
            setStep(step);
            break; // Exit the loop after finding the first error
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const has_laboratory = watch("has_laboratory");
  const handlenextStep = async () => {
    let fieldsToValidate;

    switch (step) {
      case 1:
        fieldsToValidate = ["has_laboratory"];
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
    <Motion className=" signup min-h-dvh mt-12">
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
              className="text-4xl  cursor-pointer "
              onClick={() => setStep((prevStep) => prevStep - 1)}
            />
          )}
          <AnimatePresence>
            <motion.form
              className="flex flex-col gap-4 mt-2 max-h-[30rem] overflow-y-auto pr-8"
              noValidate
              onSubmit={handleSubmit(onSubmit)}
            >
              {step === 1 && <StepOne form={form} />}
              {has_laboratory === "clinician" && step === 2 && (
                <StepTwo form={form} />
              )}
              {has_laboratory === "clinician" && step === 3 && (
                <StepThree form={form} />
              )}
              {step === 4 && <StepFour form={form} />}
              <Button
                gradientDuoTone="greenToBlue"
                onClick={step ===4 ? undefined : handlenextStep}
                type={step === 4 ? "submit" : "button"}
                isProcessing={isSubmitting}
                disabled={isSubmitting}
              >
                {step === 4 ? "Submit" : "Proceed"}
              </Button>
            </motion.form>
          </AnimatePresence>
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
    </Motion>
  );
}
