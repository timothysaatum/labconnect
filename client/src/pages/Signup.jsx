import { Button, Label, Select, TextInput } from "flowbite-react";
import { useState } from "react";
import StepTwo from "../components/clinician/StepTwo.signup";
import StepThree from "../components/clinician/StepThree.signup";
import { IoArrowBackCircleOutline } from "react-icons/io5";

const StepOne = () => {
  return (
    <div>
      <Label htmlFor="account" value="How do you intend to use our services" />
      <Select id="account" className="mt-4">
        <option value="clinician">As a clinician</option>
        <option value="laboratory">As a laboratory</option>
      </Select>
    </div>
  );
};
const StepFour = () => {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <Label htmlFor="password" value="Choose a strong password" />
        <TextInput type="password" id="password" />
      </div>
      <div>
        <Label htmlFor="password" value="confirm password" />
        <TextInput type="password" id="password" />
      </div>
    </div>
  );
};

export default function SignUp() {
  const [step, setStep] = useState(1);

  // awaiting backend
  const currentUser = "clinician";
  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };
  return (
    <div className="min-h-dvh mt-16">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row gap-5 md:items-center">
        <div className="flex-1">
          <h2 className="text-5xl text-green-400 font-semibold drop-shadow-xl"></h2>
          <p className="text-sm text-gray-400">
            Sign up the continue using our services
          </p>
        </div>
        <div className="flex-1">
          {step !== 1 && <IoArrowBackCircleOutline
            className="text-4xl text-green-400 cursor-pointer"
            onClick={() => setStep((prevStep) => prevStep - 1)}
          />}
          <form className="flex flex-col gap-4 mt-2">
            {step === 1 && <StepOne />}
            {currentUser === "clinician" && step === 2 && <StepTwo />}
            {currentUser === "clinician" && step === 3 && <StepThree />}
            {step === 4 && <StepFour/>}
            <Button gradientDuoTone="greenToBlue" onClick={handleNextStep}>
              Proceed
            </Button>
          </form>
        </div>
      </div>
      <div></div>
    </div>
  );
}
