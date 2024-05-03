import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import React from "react";

export const FormBuilder = ({
  name,
  label,
  children,
  description = null,
  message = null,
}) => {

  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>{React.cloneElement(children, field)}</FormControl>
          {message && <FormMessage/>}
          {description && <FormDescription>{description}</FormDescription>}
        </FormItem>
      )}
    />
  );
};


