import React from "react";

const Stepper = () => {
  return (
    <div className="flex items-center my-2">
      <div className="flex-grow border-t border-muted"></div>
      <span className="mx-2 text-muted-foreground text-sm">or</span>
      <div className="flex-grow border-t border-muted"></div>
    </div>
  );
};

export default Stepper;
