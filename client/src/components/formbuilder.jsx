import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import React from "react";

export const FormBuilder = ({
  name,
  label,
  children,
  description = null,
  message = null,
  control = undefined,
  ...rest
}) => {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem {...rest}>
          <FormLabel>{label}</FormLabel>
          <FormControl>{React.cloneElement(children, field)}</FormControl>
          {message && <FormMessage />}
          {description && <FormDescription>{description}</FormDescription>}
        </FormItem>
      )}
    />
  );
};
