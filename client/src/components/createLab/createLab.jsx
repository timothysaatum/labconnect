import React, { useState } from "react";
import CreateLabOne from "./createLabOne";
import CreateLabTwo from "./createLabTwo";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LogOut } from "lucide-react";
import useLogout from "@/hooks/uselogout";
import ThemeToggler from "../ThemeToggler";

const CreateLab = () => {
  const logout = useLogout();
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

  return (
    <div>
      <div className="fixed z-50 left-0 top-0 h-full flex justify-end gap-4 p-4 flex-col">
        <ThemeToggler />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span
                onClick={() => logout()}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <LogOut className="h-5 w-5" />
                <span className="sr-only">logout</span>
              </span>
            </TooltipTrigger>
            <TooltipContent side="right">Log out</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {LabStep()}
    </div>
  );
};

export default CreateLab;
