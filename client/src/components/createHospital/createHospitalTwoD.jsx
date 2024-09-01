import React from "react";
import { FormBuilder } from "../formbuilder";
import { Input } from "../ui/input";
import BlurFade from "../magicui/blur-fade";
import SelectComponent from "../selectcomponent";
import { regions } from "../../data/data";

const HospitalBank = ({ form }) => {
  return (
    <BlurFade inView delay={0.45}>
      <div className="flex flex-col gap-4 ">
        <SelectComponent
          name={"bank"}
          control={form.control}
          items={regions}
          label={"Choose Bank"}
          message={true}
          placeholder={"Choose bank"}
        />
        <FormBuilder
          name={"account_number"}
          label={"Account Number"}
          className="flex flex-col gap-3"
          message={true}
        >
          <Input type="text" placeholder="account number" />
        </FormBuilder>
      </div>
    </BlurFade>
  );
};

export default HospitalBank;
