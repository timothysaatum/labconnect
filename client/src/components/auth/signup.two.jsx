import {
  FormControl,
  FormDescription,
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

const Personal = ({ errors, form }) => {
  return (
    <>
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
                  // error={errors?.first_name}
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
              <FormDescription>
                format: +233 ** *** ****
              </FormDescription>
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
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};

export default Personal;
