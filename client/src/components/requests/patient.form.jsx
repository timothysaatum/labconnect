import FormWrapper from "../FormWrapper";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LabelDropdown from "../labeldropdown";
import React from "react";

const labels = ["Year(s)", "Month(s)", "Day(s)"];
const PatientDetails = ({ form,label,setLabel }) => {

  return (
    <FormWrapper>
      <FormField
        name="name_of_patient"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Patient Name</FormLabel>
            <FormControl>
              <Input type="text" placeholder="patient name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="patient_sex"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Patient gender</FormLabel>
              <Select
                onValueChange={(newValue) => {
                  field.onChange(newValue);
                  form.clearErrors("patient_sex");
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your Gender" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="col-span-1 grid place-items-end">
          <LabelDropdown
            labels={labels}
            label={label}
            menusize={"100px"}
            setLabel={setLabel}
            name="patient_age"
            formlabel={'Patient age'}
            placeholder={'Age'}
          />
        </div>
      </div>
    </FormWrapper>
  );
};

export default PatientDetails;
