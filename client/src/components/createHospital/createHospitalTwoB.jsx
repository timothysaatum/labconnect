import React from "react";
import { FormBuilder } from "../formbuilder";
import { Input } from "../ui/input";
import BlurFade from "../magicui/blur-fade";
import SelectComponent from "../selectcomponent";
import { PhoneInput } from "../ui/phone-input";

const types = [
  { label: "Public Hospital", value: "Public" },
  { label: "Private Hospital", value: "Private" },
];
const HospitalName = ({ form }) => {
  return (
    <BlurFade inView delay={0.45}>
      <div className="flex flex-col gap-4 ">
        <FormBuilder
          name={"name"}
          label={"Name of your Hospital?"}
          className="flex flex-col gap-3"
          message={true}
        >
          <Input type="text" placeholder="Hospital Name" />
        </FormBuilder>
        <SelectComponent
          name={"hospital_type"}
          control={form.control}
          items={types}
          label={"Choose Hospital Type"}
          message={true}
          placeholder={"Choose hospital type"}
        />
        <FormBuilder
          name={"email"}
          label={"Hospital Email?"}
          className="flex flex-col gap-3"
          message={true}
        >
          <Input type="email" placeholder="Hospital Email" />
        </FormBuilder>
        <FormBuilder
          name={"phone"}
          label={"Hospital Contact?"}
          className="flex flex-col gap-3"
          message={true}
        >
          <PhoneInput defaultCountry="GH" placeholder="Hospital Contact" />
        </FormBuilder>
      </div>
    </BlurFade>
  );
};

export default HospitalName;
