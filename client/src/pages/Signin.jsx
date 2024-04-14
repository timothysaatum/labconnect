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
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import axios from "./../api/axios";
import { SigninSchema } from "@/lib/schema";
import { setCredentials } from "@/redux/auth/authSlice";
import { useLoginMutation } from "@/redux/auth/authApiSlice";

export default function Signin() {
  const [showPassword, setShowPassword] = useState(false);

  const [serverErrors, setServerErrors] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const from = location.state?.from?.pathname || "/";

  const togglePassword = () => setShowPassword((prev) => !prev);

  const form = useForm({
    resolver: zodResolver(SigninSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [login] = useLoginMutation(); //{is loading} is posible}

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data) => {
    try {
      const userData = await login(data).unwrap();
      dispatch(setCredentials({ ...userData, token: userData.access_token }));
    } catch (error) {
      console.log(error);
      if (error?.status === 401 || error?.status === 403) {
        const errorValues = [Object.values(error?.data || {})];
        if (errorValues.length > 0) {
          console.log(errorValues[0]);
          setServerErrors(errorValues[0]);
        }
      } else if (error?.status === 400) {
        setServerErrors("All fields are required");
      } else {
        setServerErrors("An error occurred, please try again later");
      }
    }
  };
  // const onSubmit = async (data) => {
  //   try {
  //     setServerErrors(null);
  //     const response = await axios.post(
  //       "/api/user/login/",
  //       JSON.stringify(data),
  //       {
  //         withCredentials: true,
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     // console.log(JSON.stringify(response))
  //     const accessToken = response?.data?.data?.access_token;
  //     console.log(response.data)
  //     const user = {
  //       accountType: response?.data?.data?.account_type || null,
  //       isAdmin_: response?.data?.data?.is_admin || null,
  //       isVerified_: response?.data?.data?.is_verified || null,
  //       isStaff: response?.data?.data?.is_staff || null,
  //       isActive_: response?.data?.data?.is_active || null,
  //     };
  //     form.reset();
  //     navigate(from, { replace: true });
  //   } catch (error) {
  //     const errorValues = [Object.values(error?.response?.data || {})];
  //     if (errorValues.length > 0) {
  //       console.log(errorValues[0]);
  //       setServerErrors(errorValues[0]);
  //     }
  //   }
  // };

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
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4"
            noValidate
          >
            <FormField
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter your email</FormLabel>
                  <FormControl>
                    <Input
                      autoFocus
                      {...field}
                      type="email"
                      placeholder="email..."
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
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="password..."
                      />

                      {showPassword ? (
                        <EyeOff
                          className="absolute right-0 top-0 h-full mr-2 cursor-pointer"
                          onClick={togglePassword}
                        />
                      ) : (
                        <Eye
                          className="absolute right-0 top-0 h-full mr-2 cursor-pointer"
                          onClick={togglePassword}
                        />
                      )}
                    </div>
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
