import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { PhoneInput } from "../ui/phone-input";
import { Textarea } from "../ui/textarea";

const SettingProfile = () => {
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
    },
  });
  return (
    <Form {...form}>
      <form>
        <div className="mb-10 border-b pb-4">
          <h3 className="text-2xl font-medium">Profile </h3>
          <CardDescription>Update your laboratory information</CardDescription>
        </div>
        <div className="flex flex-col gap-8 mb-4">
          <FormField
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Laboratory name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <CardDescription>
                  The name of your laboratory as it will appear on your reports
                </CardDescription>
              </FormItem>
            )}
          />
          <FormField
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Laboratory Email</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <CardDescription>
                  The email address associated with your laboratory. Important
                  notifications will be sent to this address
                </CardDescription>
              </FormItem>
            )}
          />
          <div>
            <FormField
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone number</FormLabel>
                  <FormControl>
                    <PhoneInput defaultCountry="GH" international {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button variant="outline" className="mt-4" type="button">
              Add Another Number
            </Button>
          </div>
          <FormField
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea {...field} maxLength={250} />
                </FormControl>
              </FormItem>
            )}
          />
          <Accordion collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-md font-mono">
                Has the location of your laboratory changed? click to update
                location
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4">
                <FormField
                  name="Region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Region</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="town"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Town/City</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="digital_address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Digital Address</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <Button type="submit" className="w-40">
          Update Profile
        </Button>
      </form>
    </Form>
  );
};

export default SettingProfile;
