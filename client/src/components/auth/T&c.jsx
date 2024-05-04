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

export function TermsandConditions({ control,}) {
  return (
    <FormField
      control={control}
      name="tc"
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md  p-4">
          <FormControl>
            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>Accept terms and conditions</FormLabel>
            <FormDescription>
              by toggling the checkbox above you agree to our{" "}
              <Link>terms and conditions.</Link>
            </FormDescription>
          </div>
        </FormItem>
      )}
    />
  );
}
