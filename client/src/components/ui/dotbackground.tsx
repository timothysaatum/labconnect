import React, { Children } from "react";

export function DotBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className=" w-full  dark:bg-dot-white/[0.03] bg-dot-black/[0.08] relative overflow-hidden">
      {/* Radial gradient for the container to give a faded look */}
      <div className="absolute pointer-events-none dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      {children}
    </div>
  );
}
