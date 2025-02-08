import axios from "@/api/axios";
import FormWrapper from "@/components/FormWrapper";
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
import { Input } from "@/components/ui/input";
import { ResetPassSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useParams, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";

function NewPassword() {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    resolver: zodResolver(ResetPassSchema),
    defaultValues: {
      password: "",
      password_confirmation: "",
    },
  });

  const navigate = useNavigate();
  const { uidb64, token } = useParams();

  const togglePassword = () => setShowPassword((prev) => !prev);
  const onSubmit = async (data) => {
    try {
      const response = await axios.patch(
        "/user/set-new-password/",
        { ...data, uidb64, token },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(response?.data?.message, {
        position: "top-center",
      });
      navigate("/sign-in", { replace: true });
    } catch (error) {
      console.log(error);
      if (error?.response?.status === 401) {
        toast.error(error.response.data.detail, {
          position: "top-center",
        });
      } else {
        toast.error("An error occurred", {
          position: "top-center",
        });
      }
    }
  };
  return (
    <FormWrapper>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
          noValidate
        >
          <FormField
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      {...field}
                      disabled={form.formState.isSubmitting}
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
          <FormField
            name="password_confirmation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="confirm Password"
                      {...field}
                      disabled={form.formState.isSubmitting}
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
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Reset Password
            {form.formState.isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
          </Button>
        </form>
      </Form>
    </FormWrapper>
  );
}
const ConfirmForgotPassword = () => {
  return (
    <main>
      <Card className="mx-auto max-w-md mt-10">
        <CardHeader>
          <CardTitle className="text-2xl">Forgot password</CardTitle>
          <CardDescription>
            Enter your email address to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NewPassword />
        </CardContent>
      </Card>
    </main>
  );
};

export default ConfirmForgotPassword;
