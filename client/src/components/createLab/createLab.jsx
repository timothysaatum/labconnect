import React, { useState } from "react";
import CreateLabOne from "./createLabOne";
import CreateLabTwo from "./createLabTwo";

const CreateLab = () => {
  const [step, setStep] = useState(1);


  const LabStep = () => {
    switch (step) {
      case 1:
        return <CreateLabOne setStep={setStep} />;
      case 2:
        return <CreateLabTwo setStep={setStep} />;
      case 3:
        return (
          <div>
            <h1>Step 3</h1>
            <button onClick={() => setStep(1)}>Next</button>
          </div>
        );
      default:
        return null;
    }
  };

  return <div>{LabStep()}</div>;
};

export default CreateLab;
