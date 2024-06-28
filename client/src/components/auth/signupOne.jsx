import React from 'react'
import { FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import SelectComponent from '../selectcomponent';


  const accounts = [
    { value: "Laboratory", label: "Provide Laboratory Services" },
    { value: "Hospital", label: "As a hospital" },
    { value: "Delivery", label: "Delivery Agent" },
  ];
const AccountType = ({form}) => {
  return (
    <FormField
      control={form.control}
      name="account_type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>How do you intend to use our services</FormLabel>
          <SelectComponent
            items={accounts}
            field={field}
            placeholder={"Choose your account type"}
        
          />
          <FormMessage />
          <FormDescription>
            Note that this field can not be changed later
          </FormDescription>
        </FormItem>
      )}
    />
  );
}

export default AccountType