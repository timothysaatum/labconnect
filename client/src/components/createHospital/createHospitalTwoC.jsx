import React from "react";
import { FormBuilder } from "../formbuilder";
import { Input } from "../ui/input";
import BlurFade from "../magicui/blur-fade";
import SelectComponent from "../selectcomponent";
import { regions } from "../../data/data";

const HospitalLocation = ({ form }) => {
  return (
    <BlurFade inView delay={0.45}>
      <div className="flex flex-col gap-4 ">
        <SelectComponent
          name={"region"}
          control={form.control}
          items={regions}
          label={"Region"}
          message={true}
          placeholder={"Region"}
        />
        <FormBuilder
          name={"town"}
          label={"Town"}
          className="flex flex-col gap-3"
          message={true}
        >
          <Input type="text" placeholder="hospital email" />
        </FormBuilder>
        <FormBuilder
          name={"digital_address"}
          label={"Digital Address"}
          className="flex flex-col gap-3"
          message={true}
        >
          <Input type="text" placeholder="digital address" />
        </FormBuilder>
        <FormBuilder
          name={"postal_address"}
          label={"Postal Address"}
          className="flex flex-col gap-3"
          message={true}
        >
          <Input type="text" placeholder="postal address" />
        </FormBuilder>
      </div>
    </BlurFade>
  );
};

export default HospitalLocation;
