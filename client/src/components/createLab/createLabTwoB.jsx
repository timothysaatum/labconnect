import React from "react";
import { FormBuilder } from "../formbuilder";
import { Input } from "../ui/input";
import BlurFade from "../magicui/blur-fade";

const LabName = () => {
  return (
    <BlurFade inView delay={0.45}>
        <FormBuilder
          name={"name"}
          label={"What is the name of your laboratory?"}
          labelClassName={"font-semibold text-lg text-center mb-1"}
        message={true}
        className="flex items-center flex-col"
        >
          <Input type="text" placeholder="Laboratory name"  className="py-10 text-lg"/>
        </FormBuilder>
    </BlurFade>
  );
};

export default LabName;
