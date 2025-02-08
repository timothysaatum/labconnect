import { Eye, EyeOff } from "lucide-react";
import { FormBuilder } from "../formbuilder";
import { Input } from "../ui/input";
import { useState } from "react";
import { TermsandConditions } from "./T&c";
import FormWrapper from "../FormWrapper";

const Passwords = ({ form }) => {
  return (
    <FormWrapper>
      <FormBuilder label={"Password"} name={"password"} message={true}>
        <Input type="password" placeholder="Choose a password" autoFocus/>
      </FormBuilder>
      <FormBuilder
        label={"Confirm password"}
        name={"password_confirmation"}
        message={true}
      >
        <Input type="password" placeholder="Confirm password" />
      </FormBuilder>

      <TermsandConditions control={form.control} />
    </FormWrapper>
  );
};

export default Passwords;
