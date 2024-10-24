import { cn } from "@/lib/utils";
import React from "react";

export function GridBackground({
  children,
  className,
  blurClassName,
}: {
  children: React.ReactNode;
  className: String;
  blurClassName: String;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden max-w-full w-full dark:bg-grid-white/[0.02] bg-grid-black/[0.02] relative flex items-center justify-center",
        className
      )}
    >
      {/* Radial gradient for the container to give a faded look */}
      <div
        className={cn(
          "absolute pointer-events-none inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]",
          blurClassName
        )}
      />
      {children}
    </div>
  );
}
