import React from "react";
import { FormBuilder } from "../formbuilder";
import { Input } from "../ui/input";
import BlurFade from "../magicui/blur-fade";

const Herfra = () => {
  return (
    <BlurFade inView delay={0.45}>
      <h3 className="text-xl font-semibold mb-5">Verify Your Laboratory</h3>
      <div className="flex flex-col gap-4 ">
        <FormBuilder name={"herfra_id"} label={"Herfra Id"} message={true}>
          <Input type="text" placeholder="Herfra Id" />
        </FormBuilder>
      </div>
    </BlurFade>
  );
};

export default Herfra;
