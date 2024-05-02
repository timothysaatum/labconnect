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
import FormWrapper from "../FormWrapper";

export default function accountType({ form, errors }) {
  return (
    <FormWrapper>
      <FormField
        control={form.control}
        name="account_type"
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
                <SelectItem value="Clinician">As a clinician</SelectItem>
                <SelectItem value="Laboratory">As a Laboratory</SelectItem>
                <SelectItem value="Delivery">As a delivery Agent</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription className="flex gap-2 items-center">
              <AlertCircle className="self-center" /> Note that this field can
              not be changed later
            </FormDescription>
          </FormItem>
        )}
      />
    </FormWrapper>
  );
}
