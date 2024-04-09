import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "../ui/checkbox";
import { useEffect, useState } from "react";

export default function SetPasswords() {
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  useEffect(() => {
    console.log(showPassword);
  }, [showPassword]);
  return (
    <>
      <FormField
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Choose your password</FormLabel>
            <FormControl>
              <Input
                {...field}
                type={showPassword ? "text" : "password"}
                placeholder="password..."
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="confirm_password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Confirm password</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="password"
                placeholder="confirm password..."
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex items-center justify-end space-x-2 text-right">
        <Checkbox
          id="showPassword"
          onCheckedChange={handleShowPassword}
          checked={showPassword}
        />
        <label
          htmlFor="showPassword"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Accept terms and conditions
        </label>
      </div>
    </>
  );
}
