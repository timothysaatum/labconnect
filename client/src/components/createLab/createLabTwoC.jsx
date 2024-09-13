import React from "react";
import { Form } from "react-router-dom";
import { FormBuilder } from "../formbuilder";
import { Input } from "../ui/input";
import { PhoneInput } from "../ui/phone-input";
import BlurFade from "../magicui/blur-fade";

const CreateLabTwoC = () => {
  return (
    <BlurFade inView delay={0.1}>
      <h4 className="text-xl font-semibold mb-5">How Do We Reach You?</h4>
      <div className="flex gap-4 flex-col">
        <FormBuilder name={"main_email"} label={"Laboratory Email"} message>
          <Input type="email" placeholder="Laboratory email" />
        </FormBuilder>
        <FormBuilder name={"main_phone"} label={"Laboratory Tel."} message>
          <PhoneInput defaultCountry="GH" placeholder="Laboratory Phone" />
        </FormBuilder>
        <FormBuilder name={"postal_address"} label={"Postal Address"} message>
          <Input type="text" placeholder="Postal Address" />
        </FormBuilder>
      </div>
    </BlurFade>
  );
};

export default CreateLabTwoC;
