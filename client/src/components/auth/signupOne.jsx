import React from "react";
import {
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import SelectComponent from "../selectcomponent";

const accounts = [
  { value: "Laboratory", label: "Provide Laboratory Services" },
  { value: "Hospital", label: "As a hospital" },
  { value: "Delivery", label: "Delivery Agent" },
];
const AccountType = ({ form }) => {
  return (
    <SelectComponent
      items={accounts}
      name="account_type"
      control={form.control}
      description={" Note that this field can not be changed later"}
      message={true}
      label={"How do you intend to use our services"}
      placeholder={"Choose your account type"}
    />
  );
};

export default AccountType;
