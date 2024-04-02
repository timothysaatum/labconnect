import {Label, TextInput } from "flowbite-react";

const StepFour = ({ form }) => {
  const { register, validate, getValues } = form;
  return (
    <div className="flex flex-col gap-3">
      <div>
        <Label htmlFor="password" value="Choose a strong password" />
        <TextInput
          shadow
          type="text"
          id="password"
          {...register("password", {
            required: "This field is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters long",
            },
          })}
        />
      </div>
      <div>
        <Label htmlFor="password" value="confirm password" />
        <TextInput
          type="text"
          id="confirmPassword"
          {...register("password_confirmation", {
            required: "This field is required",
            validate: (value) =>
              value === getValues("password") || "The passwords do not match",
          })}
        />
      </div>
    </div>
  );
};

export default StepFour;
