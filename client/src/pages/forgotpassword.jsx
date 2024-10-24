import axios from "@/api/axios";
import { FormBuilder } from "@/components/formbuilder";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ResetPassEmailSchema, ResetPassSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

function EmailInput() {
  const form = useForm({
    resolver: zodResolver(ResetPassEmailSchema),
    defaultValues: {
      email: "",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("/user/password-reset/", data);
      toast.success(res.data.message, {
        position: "top-center",
        duration: 5000,
      });
      form.reset()
    } catch (error) {
      console.error(error);
      if (error.response.status === 400) {
        toast.error("This account does not exist", {
          position: "top-center",
          duration: 5000,
        });
      }
    }
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
          noValidate
        >
          <FormBuilder
            name={"email"}
            label={"Email"}
            description={"We will send you a link to reset your password."}
          >
            <Input type="email" placeholder="Email" />
          </FormBuilder>
          <Button type="submit" disabled={isSubmitting}>
            Send Link
          </Button>
        </form>
      </Form>
    </div>
  );
}

const ForgotPassword = () => {
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  return (
    <Card className="mx-auto max-w-md mt-10">
      <CardHeader>
        <CardTitle className="text-2xl">Forgot password</CardTitle>
        <CardDescription>
          Enter your email address to reset your password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <EmailInput
          emailSubmitted={emailSubmitted}
          setEmailSubmitted={setEmailSubmitted}
        />
      </CardContent>
    </Card>
  );
};

export default ForgotPassword;
