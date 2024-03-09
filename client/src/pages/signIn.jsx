import { Button, Label, TextInput } from "flowbite-react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";

export default function SignIn() {
  const form = useForm();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = form;
  const onSubmit = (data) => {
    console.log(data);
  };
  return (
    <div className="min-h-dvh mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row gap-5 md:items-center">
        <div className="flex-1">
          <h2 className="text-5xl text-green-400 font-semibold drop-shadow-xl"></h2>
          <p className="text-sm text-gray-400">
            Sign in the continue using our services
          </p>
        </div>
        <div className="flex-1">
          <form
            className="flex flex-col gap-4"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <Label value="Your email" />
              <TextInput
                placeholder="Enter your email"
                color={errors.email && "failure"}
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                    message: "Invalid email address",
                  },
                })}
              />
            </div>
            <div className=" flex flex-col justify-end">
              <Label value="Your password" />
              <TextInput
                placeholder="Enter password"
                color={errors.password && "failure"}
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 6 characters long",
                  },
                })}
              />
              <Link className="text-right text-xs mt-2">forgot password?</Link>
            </div>
            <Button gradientDuoTone="greenToBlue" type="submit">
              Sign In
            </Button>
            <span className="text-xs">
              Don't have an account?{" "}
              <Link to={"/sign-up"} className="text-green-400 hover:underline">
                Sign up here
              </Link>
            </span>
          </form>
          <DevTool control={control} />
        </div>
      </div>
      <div></div>
    </div>
  );
}
