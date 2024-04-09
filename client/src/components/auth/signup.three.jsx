import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";

const Facility = () => {
  return (
    <>
      <FormField
        name="staff_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Staff Id</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="text"
                placeholder="Staff Id..."
                autoFocus
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="current_facility"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name of institution</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="text"
                placeholder="name of institution..."
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="emmergency_number"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Enter your phone number for urgent cases</FormLabel>
            <FormControl>
              <PhoneInput
                placeholder="emergency phone number..."
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
        name="digital_address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Digital address</FormLabel>
            <FormControl>
              <Input placeholder="digital address..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default Facility;
