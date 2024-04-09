import { Link, useLocation, useNavigate } from "react-router-dom";

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
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import {  useState } from "react";

import { AlertCircle, Loader2 } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import axios from "axios";
import { setAccess, setAuth } from "@/redux/auth/authSlice";

const SigninSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export default function Signin() {
  const [serverErrors, setServerErrors] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const from = location.state?.from?.pathname || "/";

  const form = useForm({
    resolver: zodResolver(SigninSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async (data) => {
    try {
      setServerErrors(null);
      const response = await axios.post(
        "/api/user/login/",
        JSON.stringify(data),
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      // console.log(JSON.stringify(response))
      const accessToken = response?.data?.data?.access_token;
      dispatch(setAccess(accessToken));
      const user = {
        accountType: response?.data?.data?.account_type || null,
        isAdmin_: response?.data?.data?.is_admin || null,
        isVerified_: response?.data?.data?.is_verified || null,
        isStaff: response?.data?.data?.is_staff || null,
        isActive_: response?.data?.data?.is_active || null,
      };
      setServerErrors(null);
      dispatch(setAuth(user));
      form.reset();
      navigate(from, { replace: true });
    } catch (error) {
      const errorValues = [Object.values(error?.response?.data || {})];
      if (errorValues.length > 0) {
        console.log(errorValues[0]);
        setServerErrors(errorValues[0]);
      }
    }
  };

  return (
    <Card className="mx-auto max-w-sm mt-16">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
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
                      error={errors?.email}
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter your password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="password..."
                      error={errors?.password}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              Login
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
            </Button>
            <Button
              variant="outline"
              className="w-full"
              disabled={isSubmitting}
            >
              Login with Google
            </Button>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="#" className="underline">
                Sign up
              </Link>
            </div>
          </form>
        </Form>
        {serverErrors && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{serverErrors}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
