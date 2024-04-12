import { Link } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import FormWrapper from "../FormWrapper";

export function TermsandConditions({ form, errors }) {
  return (
    <FormWrapper>
      <FormField
        control={form.control}
        name="tc"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Accept terms and conditions</FormLabel>
              <FormDescription>
                by toggling the checkbox above you agree to our{" "}
                <Link>terms and conditions.</Link> Please read them carefully. A
                violation of our terms and conditions may result in the
                termination of your account. a copy of our terms and conditions
                will be sent to your email.
              </FormDescription>
              {errors?.tc && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{errors?.tc.message}</AlertDescription>
                </Alert>
              )}
            </div>
          </FormItem>
        )}
      />
    </FormWrapper>
  );
}
