import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { OTPSchema } from "@/lib/schema";
import axios from "@/api/axios";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

export function OTPInput() {
  const form = useForm({
    resolver: zodResolver(OTPSchema),
    defaultValues: {
      code: "",
    },
  });

  const navigate = useNavigate();

  const {
    formState: { isSubmitting, isSubmitSuccessful },
    reset,
  } = form;

  useEffect(() => {
    reset();
  }, [isSubmitSuccessful]);
  const onSubmit = async (data) => {
    try {
      const response = await axios.post("/user/verify-email/", data);
      console.log(response);
      if (response.status === 200) {
        toast.success(response?.data?.message);
        navigate("/sign-in");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const [seconds, setSeconds] = useState(180);

  useEffect(() => {
    if (seconds > 0) {
      const interval = setInterval(() => {
        setSeconds(seconds - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [seconds]);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 flex flex-col gap-6"
      >
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>One-Time Password</FormLabel>
              <FormControl>
                <InputOTP
                  maxLength={6}
                  {...field}
                  disabled={isSubmitting}
                  containerClassName=" flex justify-between drop-shadow-lg"
                  autoFocus
                  onComplete={form.handleSubmit(onSubmit)}
                >
                  <InputOTPSlot
                    index={0}
                    className="shadow-sm dark:shadow-gray-700"
                  />
                  <InputOTPSlot
                    index={1}
                    className="border-l shadow-sm dark:shadow-gray-700"
                  />
                  <InputOTPSlot
                    index={2}
                    className="border-l shadow-sm dark:shadow-gray-700"
                  />
                  <InputOTPSlot
                    index={3}
                    className="border-l shadow-sm dark:shadow-gray-700"
                  />
                  <InputOTPSlot
                    index={4}
                    className="border-l shadow-sm dark:shadow-gray-700"
                  />
                  <InputOTPSlot
                    index={5}
                    className="border-l rounded-r-md shadow-sm dark:shadow-gray-700"
                  />
                </InputOTP>
              </FormControl>
              <FormDescription>
                Please enter the one-time password sent to your email.
                <br />
                {seconds > 0 ? (
                  <p className="text-muted-foreground/75 text-right cursor-pointer tabular-nums">
                    you can request a new code in:{" "}
                    <span className="text-primary">
                      {minutes}:
                      {remainingSeconds < 10
                        ? `0${remainingSeconds}`
                        : remainingSeconds}
                    </span>
                  </p>
                ) : (
                  <p className="text-muted-foreground/75 text-right cursor-pointer">
                    Get a new code
                  </p>
                )}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {" "}
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit
        </Button>
      </form>
    </Form>
  );
}

export default function VerifyEmail() {
  return (
    <Card className="mx-auto max-w-sm mt-10">
      <CardHeader>
        <CardTitle className="text-2xl">Verify Email</CardTitle>
        <CardDescription>
          Enter the code sent to your email to verify your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <OTPInput />
      </CardContent>
    </Card>
  );
}
