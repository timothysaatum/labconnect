import React from "react";

export function GridBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden max-w-full w-full dark:bg-grid-white/[0.03] bg-grid-black/[0.04] relative flex items-center justify-center">
      {/* Radial gradient for the container to give a faded look */}
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      {children}
    </div>
  );
}
