import React from "react";
import { FormBuilder } from "../formbuilder";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import BlurFade from "../magicui/blur-fade";

const Others = ({ form }) => {
  return (
    <BlurFade inView delay={0.45}>
      <h4 className="text-xl font-semibold mb-5">Others</h4>
      <div className="flex flex-col gap-6">
        <FormBuilder
          name={"website"}
          label={"Does your lab have a website?"}
          message
        >
          <Input type="text" placeholder="Website" />
        </FormBuilder>
        <FormBuilder
          control={form.control}
          name={"description"}
          label={"Give a brief description of your lab"}
          message
        >
          <Textarea
            placeholder="Description"
            className="resize-none"
            rows={10}
            maxLength={300}
          />
        </FormBuilder>
      </div>
    </BlurFade>
  );
};

export default Others;
