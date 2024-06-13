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
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function GettingStartedLab() {
  const { theme } = useTheme();
  const [labcreated, setLabcreated] = useState(false);
  const [progress, setProgress] = useState(33);

  return (
    <>
      <GridBackground>
        <Spotlight
          className="-top-40 -left-10 md:-top-20 md:-left-32 h-screen"
          fill={theme === "light" ? "gray" : "white"}
        />
        <Spotlight className="top-28 left-80  h-[80dvh] w-[50vw]" fill="blue" />
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
              and at least one branch. you can add multiple branches later in
              your dashboard
            </p>
            <a
              href={"#create-lab"}
              className="mt-10 w-full inline-flex items-center justify-center"
            >
              <MagicButton title={"Get Started"} otherClasses={"self-center"} />
            </a>
          </div>
        </div>
      </GridBackground>
      <TracingBeam className="">
        <Spotlight
          className="-top-40 -left-10 md:-top-20 md:-left-32 h-screen"
          fill={theme === "light" ? "gray" : "white"}
        />
        <Spotlight className="top-28 left-80  h-[80dvh] w-[50vw]" fill="blue" />
        <div className="relative">
          <CreateLab
            labcreated={labcreated}
            setLabcreated={setLabcreated}
            progress={progress}
            setProgress={setProgress}
          />
          <CreateBranch
            labcreated={labcreated}
            setLabcreated={setLabcreated}
            progress={progress}
            setProgress={setProgress}
          />
          <CreateTest
            labcreated={labcreated}
            setLabcreated={setLabcreated}
            progress={progress}
            setProgress={setProgress}
          />
        </div>
      </TracingBeam>
    </>
  );
}
