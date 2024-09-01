import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LogOut } from "lucide-react";
import useLogout from "@/hooks/uselogout";
import ThemeToggler from "../ThemeToggler";
import CreateHospitalOne from "./createHospitalOne";
import CreateHospitalTwo from "./createHospitalTwo";

const CreateHospital = () => {
  const logout = useLogout();
  const [step, setStep] = useState(1);

  const LabStep = () => {
    switch (step) {
      case 1:
        return <CreateHospitalOne setStep={setStep} />;
      case 2:
        return <CreateHospitalTwo setStep={setStep} />;
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

export default CreateHospital;
