"use client";
import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function accountType({ form, errors }) {
  return (
    <FormField
      control={form.control}
      name="AccountType"
      render={({ field }) => (
        <FormItem>
          <FormLabel>How do you intend to use our services</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="choose account type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="clinician">As a clinician</SelectItem>
              <SelectItem value="laboratory">As a Laboratory</SelectItem>
              <SelectItem value="delivery">As a delivery Agent</SelectItem>
            </SelectContent>
          </Select>
          <FormDescription className="flex gap-2 items-center">
            <AlertCircle className="self-center" /> Note that this field can not
            be changed later
          </FormDescription>
          {/* <FormMessage /> */}
          {errors?.AccountType && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errors?.AccountType.message}</AlertDescription>
            </Alert>
          )}
        </FormItem>
      )}
    />
  );
}
