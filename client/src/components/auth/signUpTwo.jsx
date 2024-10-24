import React from "react";
import { FormBuilder } from "../formbuilder";
import { Input } from "../ui/input";
import { PhoneInput } from "../ui/phone-input";
import FormWrapper from "../FormWrapper";

const UserDetails = () => {
  return (
    <FormWrapper>
      <FormBuilder label={"First name"} name={"first_name"} message={true}>
        <Input type="text" placeholder="first name" autoFocus/>
      </FormBuilder>
      <FormBuilder label={"Last name"} name={"last_name"} message={true}>
        <Input type="text" placeholder="last name" />
      </FormBuilder>
      <FormBuilder label={"Email"} name={"email"} message={true}>
        <Input type="email" placeholder="email" />
      </FormBuilder>

      <FormBuilder label={"Phone number"} name={"phone_number"} message={true}>
        <PhoneInput defaultCountry="GH" />
      </FormBuilder>
      <FormBuilder label={"Ghana Card Number"} name={"id_number"} message={true}>
        <Input type="text" />
      </FormBuilder>
      <FormBuilder label={"Digital Address"} name={"digital_address"} message={true}>
        <Input type="text" />
      </FormBuilder>
    </FormWrapper>
  );
};

export default UserDetails;
