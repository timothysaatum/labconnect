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
import { useEffect, useState, useTransition } from "react";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import axios from "./../api/axios";
import { SigninSchema } from "@/lib/schema";
import { setCredentials } from "@/redux/auth/authSlice";
import { toast } from "sonner";
import { DotBackground } from "@/components/ui/dotbackground";
import useLogout from "@/hooks/uselogout";

export default function Signin() {
  const [showPassword, setShowPassword] = useState(false);

  const [serverErrors, setServerErrors] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logOut = useLogout();

  const from = location.state?.from?.pathname || "/dashboard";

  const togglePassword = () => setShowPassword((prev) => !prev);
  const form = useForm({
    resolver: zodResolver(SigninSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data) => {
    try {
      setServerErrors(null);
      const response = await axios.post("/user/login/", JSON.stringify(data), {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      dispatch(
        setCredentials({
          data: response?.data?.data,
          accessToken: response?.data?.access_token,
        })
      );
      navigate(from, { replace: true });
      toast.success("sign in sucess");
    } catch (error) {
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        const errorValues = [Object.values(error?.response?.data || {})];
        if (errorValues.length > 0) {
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
    logOut().catch((error) => {
      console.log(error);
    });
  }, []);
  return (
    <DotBackground>
      <div className="px-2">
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
                      <FormLabel htmlFor="password">
                        Enter your password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            id="password"
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
                <div className="text-right">
                  <Link to="/forgot-password">
                    <Button
                      variant="link"
                      className="text-sm p-0 h-auto"
                      type="button"
                    >
                      Forgot password?
                    </Button>
                  </Link>
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      Logging in{" "}
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    </span>
                  ) : (
                    "Login"
                  )}
                </Button>
                <div className="mt-4 text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link to="/sign-up" className="underline">
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
      </div>
    </DotBackground>
  );
}
