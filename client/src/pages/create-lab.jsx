import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { FormBuilder } from "@/components/formbuilder";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateLabSchema, SignupSchema } from "@/lib/schema";
import { toast } from "sonner";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { Textarea } from "@/components/ui/textarea";
import { selectCurrentUser } from "@/redux/auth/authSlice";
import { useSelector } from "react-redux";
import { AlertCircle, Loader2 } from "lucide-react";
import AddBranchCreateLab from "@/components/dashboard/addbranch2";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const CreateLab = () => {
  const user = useSelector(selectCurrentUser);
  const axiosPrivate = useAxiosPrivate();
  const [success, setSuccess] = useState(false);
  const [serverErrors, setServerErrors] = useState(null);
  const alertRef = React.useRef(null);

  const [open, setOpen] = useState(true);
  const form = useForm({
    // resolver: zodResolver(CreateLabSchema),
    defaultValues: {
      created_by: user.id,
      name: "",
      main_email: "",
      main_phone: "",
      postal_address: "",
      herfra_id: "",
      description: "",
      website: "",
    },
  });
  const fileref = form.register("logo");
  useEffect(() => {
    if (Object.keys(form.formState.errors).length > 0) {
      const firstErrorField = Object.keys(form.formState.errors)[0];
      document.getElementsByName(firstErrorField)[0]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [form.formState.errors]);
  useEffect(() => {
    console.log(form.formState.errors);
  }, [form.formState.errors]);
  const onSubmit = async (data) => {
    if (data.logo instanceof FileList && data.logo.length > 0) {
      data.logo = data.logo[0];
    }
    let newData = {
      ...data,
      website:
        data?.website && !data.website.startsWith("http")
          ? `http://${data.website}`
          : data.website,
    };
    try {
      const formData = new FormData();

      for (const key in newData) {
        formData.append(key, newData[key]);
      }
      console.log(newData);
      await axiosPrivate.post(
        "laboratory/create/",
        formData,

        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setSuccess(true);
      setOpen(true);
      toast.success("Laboratory Created , Just one more step to get started", {
        position: "top-center",
      });
      setServerErrors(null);
    } catch (error) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        const errorValues = [Object.values(error?.response?.data || {})];
        if (errorValues.length > 0) {
          console.log(errorValues[0]);
          setServerErrors(errorValues[0]);
        }
      } else if (error?.response?.status === 400) {
        setServerErrors("All fields are required");
      } else {
        setServerErrors("Something went wrong, try again");
      }
    }
  };
  useEffect(() => {
    if (serverErrors) {
      alertRef.current.focus();
    }
  }, [serverErrors]);
  return (
    <div className="container py-4 lg:py-10 bg-muted/10">
      {serverErrors && (
        <Alert
          variant="destructive"
          className="max-w-xl mx-auto mb-4"
          ref={alertRef}
        >
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{serverErrors}</AlertDescription>
        </Alert>
      )}
      <Card className="mx-auto  max-w-2xl">
        <CardHeader className="flex flex-col sm:flex-row items-start gap-4">
          <div>
            <CardTitle className="mb-2">Create Laboratory</CardTitle>
            <CardDescription>
              you can create you laboratory here.you can't access the laboratory
              without creating a laboratory
            </CardDescription>
          </div>
          {success && <AddBranchCreateLab open={open} setOpen={setOpen} />}
        </CardHeader>
        <CardContent className="">
          <Form {...form}>
            <form
              className="flex flex-col gap-4 mb-0"
              noValidate
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormBuilder name={"name"} label="First name">
                <Input type="text" placeholder="first name" />
              </FormBuilder>
              <FormBuilder name={"main_email"} label="Laboratory Email">
                <Input type="email" placeholder="last name" />
              </FormBuilder>
              <FormBuilder name={"herfra_id"} label="Herfra Id">
                <Input type="text" placeholder="herfra Id" />
              </FormBuilder>
              <FormBuilder name={"main_phone"} label="Laboratory Phone number">
                <PhoneInput defaultCountry="GH" international />
              </FormBuilder>
              <FormBuilder name={"postal_address"} label="Postal Address">
                <Input type="text" placeholder="Postal address" />
              </FormBuilder>
              <FormBuilder name="website" label="Laboratory Website (Optional)">
                <Input type="text" placeholder="website" />
              </FormBuilder>
              <FormBuilder name={"description"} label="Laboratory Bio">
                <Textarea
                  className="resize-none"
                  placeholder="laboratory description"
                />
              </FormBuilder>
              <FormField
                name="logo"
                render={({}) => (
                  <FormItem>
                    <FormLabel>Choose Logo (Optional)</FormLabel>
                    <FormControl>
                      <Input type="file" {...fileref} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit">
                Create laboratory profile
                {form.formState.isSubmitting && (
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateLab;
