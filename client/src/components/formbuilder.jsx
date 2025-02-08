import { cn } from "@/lib/utils";
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
  messageClassName,
  descriptionClassName,
  labelClassName,
  ...rest
}) => {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem {...rest}>
          <FormLabel htmlFor={name} className={cn("", labelClassName)}>
            {label}
          </FormLabel>
          <FormControl>{React.cloneElement(children, field)}</FormControl>
          {message && <FormMessage className={cn("", messageClassName)} />}
          {description && (
            <FormDescription className={cn("", descriptionClassName)}>
              {description}
            </FormDescription>
          )}
        </FormItem>
      )}
    />
  );
};
