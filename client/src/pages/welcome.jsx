import { Spotlight } from "@/components/ui/spotlight";
import React from "react";

const Welcome = () => {
  return (
    <div className="min-h-dvh w-full dark:bg-black bg-white  dark:bg-grid-white/[0.03]  relative flex items-center justify-center">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      {/* Radial gradient for the container to give a faded look */}
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <p className="text-4xl sm:text-5xl font-bold text-center relative z-20 text-muted-foreground py-8">
        Innovative Laboratory Practice <br /> With{" "}
        <span className="from-[#6366F1] via-[#D946EF] to-[#FB7185] bg-gradient-to-r bg-clip-text text-transparent">
          LabConnect
        </span>
      </p>
    </div>
  );
};

export default Welcome;
