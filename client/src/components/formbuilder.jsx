import { useForm } from "react-hook-form";
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "./ui/form";
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
          {message && <FormMessage>{message}</FormMessage>}
          {description && <FormDescription>{description}</FormDescription>}
        </FormItem>
      )}
    />
  );
};


