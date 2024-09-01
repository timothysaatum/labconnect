import { Button } from "@/components/ui/button";
import BoxReveal from "@/components/magicui/box-reveal";
import { ArrowRight } from "lucide-react";

export default function CreateHospitalOne({ setStep }) {
  return (
    <div className="min-h-dvh w-full flex items-center justify-center flex-col p-4 text-xs sm:text-sm">
      <BoxReveal boxColor={"#5046e6"} duration={0.5}>
        <p className="text-2xl font-bold">Let's Add Your Hospital</p>
      </BoxReveal>

      <BoxReveal duration={0.5}>
        <h2 className="mt-2 font-medium text-center">
          Join The Network of Laboratories in{" "}
          <span className="text-chart1">
            {" "}
            <br />
            LabConnect
          </span>
        </h2>
      </BoxReveal>

      <BoxReveal duration={0.5}>
        <div className="mt-4">
          <p className="leading-8">
            <ArrowRight className="w-4 h-4 inline mr-2" /> Connect with other
            laboratories and hospitals across the country. <br />
            <ArrowRight className="w-4 h-4 inline mr-2" />
            Add Your Hospital laboratory to receive samples and manage samples
            sent from your hospiatl from a single Dashboard
            <br />
            <ArrowRight className="w-4 h-4 inline mr-2" />
            Add Tests and Manage Efficiently with ability to
            <span className="font-semibold text-chart1"> Add Discounts </span>,
            <span className="font-semibold text-chart1">
              {" "}
              Update Test AnyTime{" "}
            </span>
            ,
            <span className="font-semibold text-chart1">
              Outline Required Patient Preparation
            </span>
            . <br />
            <ArrowRight className="w-4 h-4 inline mr-2" />
            High End Analytics to help you understand your Laboratory better
          </p>
        </div>
      </BoxReveal>

      <BoxReveal duration={0.5}>
        <Button className="w-56 mt-6" onClick={() => setStep(2)}>
          Create Hospital
        </Button>
      </BoxReveal>
    </div>
  );
}
