import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import FormWrapper from "../FormWrapper";

const Personal = ({ form }) => {
  return (
    <FormWrapper>
      <div className="grid md:grid-cols-2 md:gap-2">
        <FormField
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Firstname</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder="firstname..."
                  autoFocus
                  
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lastname</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder="Lastname..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Enter your email</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="email"
                placeholder="email..."
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid md:grid-cols-2 md:gap-2">
        <FormField
          name="phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter your phone number</FormLabel>
              <FormControl>
                <PhoneInput
                  placeholder="phone number..."
                  {...field}
                  defaultCountry="GH"
                  international
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem className="mt-3 md:mt-0">
              <FormLabel>Choose your gender</FormLabel>
              <Select
              onValueChange={(newValue) => {
                field.onChange(newValue);
                form.clearErrors("gender");
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
      </div>
    </FormWrapper>
  );
};

export default Personal;
