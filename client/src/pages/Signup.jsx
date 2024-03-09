import { Button, Label, Select, TextInput } from "flowbite-react";
import { useState } from "react";
import StepTwo from "../components/clinician/StepTwo.signup";
import StepThree from "../components/clinician/StepThree.signup";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { DevTool } from "@hookform/devtools";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
const StepOne = ({ form }) => {
  const { register } = form;
  return (
    <div>
      <Label htmlFor="account" value="How do you intend to use our services" />
      <Select
        id="account"
        className="mt-4"
        {...register("accountType", {
          required: "This field is required",
        })}
        shadow
        defaultValue={"clinician"}
      >
        <option value="clinician">As a clinician</option>
        <option value="laboratory">As a laboratory</option>
        <option value="delivery">As a delivery Agent</option>
      </Select>
    </div>
  );
};
const StepFour = ({ form }) => {
  const { register, validate, getValues } = form;
  return (
    <div className="flex flex-col gap-3">
      <div>
        <Label htmlFor="password" value="Choose a strong password" />
        <TextInput
          shadow
          type="password"
          id="password"
          {...register("password", {
            required: "This field is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters long",
            },
          })}
        />
      </div>
      <div>
        <Label htmlFor="password" value="confirm password" />
        <TextInput
          type="password"
          id="confirmPassword"
          {...register("password_confirmation", {
            required: "This field is required",
            validate: (value) =>
              value === getValues("password") || "The passwords do not match",
          })}
        />
      </div>
    </div>
  );
};

export default function SignUp() {
  const [step, setStep] = useState(1);
  const form = useForm();
  const { control, handleSubmit } = form;
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await fetch("http://localhost:8000/users/create-account/", {
        method: "POST",
        headers: { "content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      console.log(result);
      if (res.ok) {
        navigate("/sign-in");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // awaiting backend
  const currentUser = "clinician";
  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };
  return (
    <div className="min-h-dvh mt-12">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row gap-5 md:items-center">
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
            {currentUser === "clinician" && step === 2 && (
              <StepTwo form={form} />
            )}
            {currentUser === "clinician" && step === 3 && (
              <StepThree form={form} />
            )}
            {step === 4 && <StepFour form={form} />}
            <Button
              gradientDuoTone="greenToBlue"
              onClick={step === 4 ? undefined : handleNextStep}
              type={step === 4 ? "submit" : "button"}
            >
              {step === 4 ? "Submit" : "Proceed"}
            </Button>
          </form>
          <DevTool control={control} placement="top-left"/>
        </div>
      </div>
      <div></div>
    </div>
  );
}
