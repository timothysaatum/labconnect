import React from "react";
import { FormBuilder } from "../formbuilder";
import { Input } from "../ui/input";
import BlurFade from "../magicui/blur-fade";

const LabName = () => {
  return (
    <BlurFade inView delay={0.45}>
      <div className="flex flex-col gap-4 ">
        <FormBuilder
          name={"name"}
          label={"What is the name of your laboratory?"}
          className="flex flex-col gap-3"
          labelClassName={"text-xl text-center font-semibold capitalize mb-5"}
          message={true}
        >
          <Input type="text" placeholder="Laboratory name" />
        </FormBuilder>
      </div>
    </BlurFade>
  );
};

export default LabName;
