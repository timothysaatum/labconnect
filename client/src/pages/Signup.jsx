import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupSchema } from "@/lib/schema";
import { FormBuilder } from "@/components/formbuilder";
import { Input } from "@/components/ui/input";
import { Form } from "@/components/ui/form";
import { DevTool } from "@hookform/devtools";
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
import { PhoneInput } from "@/components/ui/phone-input";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Signup() {
  const form = useForm({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      account_type: "",
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      gender: "",
      digital_address: "",
      password: "",
      password_confirmation: "",
      tc: false,
    },
  });
  const accounts = [
    { value: "Laboratory", label: "Laboratory Services" },
    { value: "Clinician", label: "Health Service Provider" },
    { value: "Delivery", label: "Delivery Agent" },
  ];
  return (
    <div className="px-2">
      <Card className="mx-auto max-w-[34rem] mt-10 ">
        <CardHeader className="px-2 sm:px-6">
          <CardTitle className="text-2xl flex gap-2 item-center">
            Create Account
          </CardTitle>
          <CardDescription>
            Enter your personal details below to create an account with
            labConnect
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form>
              <ScrollArea className="h-[400px] px-4">
                <FormField
                  control={form.control}
                  name="account_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        How do you intend to use our services
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="choose account type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {accounts.map((type) => (
                            <SelectItem value={type.value} key={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Note that this field can not be changed later
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <FormBuilder label={"First name"} name={"first_name"}>
                  <Input type="text" placeholder="first name" />
                </FormBuilder>
                <FormBuilder label={"Last name"} name={"last_name"}>
                  <Input type="text" placeholder="last name" />
                </FormBuilder>
                <FormBuilder label={"Email"} name={"email"}>
                  <Input type="email" placeholder="email" />
                </FormBuilder>
                <FormBuilder label={"Phone number"} name={"phone"}>
                  <PhoneInput />
                </FormBuilder>
                <FormBuilder label={"Email"} name={"email"}>
                  <Input type="email" placeholder="email" />
                </FormBuilder>
              </ScrollArea>
              <Button>
                
              </Button>
            </form>
            <DevTool control={form.control} />
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
