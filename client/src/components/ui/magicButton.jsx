import { cn } from "@/lib/utils";
import React from "react";

const MagicButton = ({
  title,
  icon = null,
  position = null,
  otherClasses = null,
  btnClasses = null,
  ...rest
}) => {
  return (
    <button
      className={`relative inline-flex h-12 overflow-hidden rounded-lg p-[2px] focus:outline-none ${btnClasses}`}
      {...rest}
    >
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
      <span className="inline-flex h-full hover:bg-neutral-50 dark:hover:text-slate-900  transition-all w-full cursor-pointer  bg-card items-center justify-center rounded-lg px-3 py-1 text-sm font-medium backdrop-blur-3xl">
        {position === "left" && icon}
        {title}
        {position === "right" && icon}
      </span>
    </button>
  );
};

export default MagicButton;
