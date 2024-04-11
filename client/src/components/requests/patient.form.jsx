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

const PatientDetails = ({ form }) => {
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
        <FormField
          name="patient_age"
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel>Patient Age</FormLabel>
              <FormControl>
                <Input type="text" placeholder="patient age" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </FormWrapper>
  );
};

export default PatientDetails;
