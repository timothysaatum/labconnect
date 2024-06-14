import React, { useState } from "react";
import { Spotlight } from "@/components/ui/spotlight";
import { TextGenerateEffect } from "@/components/ui/text-generate";
import { GridBackground } from "@/components/ui/gridboxes";
import CreateLab from "./create-lab";
import MagicButton from "@/components/ui/magicButton";
import CreateBranch from "@/components/dashboard/createBranch";
import { useTheme } from "@/components/themeProvider";
import { TracingBeam } from "@/components/ui/tracingbeam";
import CreateTest from "@/components/dashboard/CreateTest";
import { Progress } from "@/components/ui/progress";

const Hero = ({ setStep }) => {
  return (
    <GridBackground>
      <div className="h-[95dvh] w-full flex md:items-center md:justify-center antialiased relative overflow-hidden">
        <div className=" flex mt-20 flex-col justify-center items-center  mx-auto relative z-10  w-full">
          <TextGenerateEffect
            time={1}
            words="Just one last step"
            className="uppercase tracking-widest text-xs text-center max-w-80"
          />
          <TextGenerateEffect
            time={2}
            color
            words="You are Almost done."
            className=" text-2xl  md:text-4xl lg:text-6xl leading-7 tracking-widest text-slate-700 dark:text-neutral-50"
          />

          <p className="mt-4 font-normal  text-muted-foreground max-w-lg text-center mx-auto">
            you are almost done. we will guide you here to add your laboratory
            and at least one branch. you can add multiple branches later in your
            dashboard
          </p>
          <div className="mt-10 w-full inline-flex items-center justify-center">
            <MagicButton
              title={"Get Started"}
              otherClasses={"self-center"}
              onClick={() => setStep(1)}
            />
          </div>
        </div>
      </div>
    </GridBackground>
  );
};

const StepToView = ({ step, setStep }) => {
  switch (step) {
    case 0:
      return (
        <div>
          <Hero setStep={setStep} />
        </div>
      );
    case 1:
      return (
        <div>
          <TracingBeam>
            <CreateLab step={step} setStep={setStep} />
          </TracingBeam>
        </div>
      );
    case 2:
      return (
        <div>
          <TracingBeam>
            <CreateBranch step={step} setStep={setStep} />
          </TracingBeam>
        </div>
      );
    case 3:
      return (
        <div>
          <TracingBeam>
            <CreateTest step={step} setStep={setStep} />
          </TracingBeam>
        </div>
      );
    default:
      return null;
  }
};
export default function GettingStartedLab() {
  const [step, setStep] = useState(0);

  const { theme } = useTheme();
  return (
    <div className="relative">
      <Progress
        value={(step / 4) * 100}
        className="absolute top-0 left-0 h-[2px]"
      />

      <Spotlight
        className="-top-40 -left-10 md:-top-20 md:-left-32 h-screen"
        fill={theme === "light" ? "gray" : "white"}
      />
      <Spotlight className="top-28 left-80  h-[80dvh] w-[50vw]" fill="blue" />
      <StepToView step={step} setStep={setStep} />
    </div>
  );
}
