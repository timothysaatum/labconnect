import { Label, Select, TextInput } from "flowbite-react";
import Oauth from "../Oauth";

export default function StepTwo({ form }) {
  const { register, formState, clearErrors } = form;
  const { errors } = formState;

  const handleInputChange = (e) => {
    const { name } = e.target;
    clearErrors(name);
  };

  return (
    <div className="flex flex-col gap-3">
      <div>
        <Label htmlFor="firstname" value="first name" />
        <TextInput
        placeholder="Enter your first name"
          type="text"
          id="firstname"
          {...register("first_name", {
            required: "This field is required",
          })}
          onChange={handleInputChange}
          color={errors.first_name && "failure"}
          helperText={errors.first_name?.message} 
          
        />
      </div>
      <div>
        <Label value="last name" htmlFor="lastname" />
        <TextInput
        placeholder="Enter your last name"
          id="lastname"
          {...register("last_name", {
            required: "This field is required",
          })}
          color={errors.last_name && "failure"}
          onChange={handleInputChange}
          helperText={errors.last_name?.message}
        />
      </div>
      <div>
        <Label htmlFor="email" value="email" />
        <TextInput
        placeholder="Enter your email"
          type="email"
          id="email"
          {...register("email", {
            required: "email is required",
            pattern: {
              value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
              message: "Invalid email address",
            },
          })}
          onChange={handleInputChange}
          color={errors.email && "failure"}
          helperText={errors.email?.message}
        />
      </div>
      <div>
        <Label htmlFor="gender" value="Choose your gender" />
        <Select
          id="gender"
          {...register("gender", {
            required: "please select your gender",
          })}
          onChange={handleInputChange}
          color={errors.gender && "failure"}
          helperText={errors.gender?.message}
        >
          <option value="">Select gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </Select>
      </div>
      <div>
        <Label htmlFor="phone" value="phone number" />
        <TextInput
        placeholder="Enter your phone number"
          type="text"
          id="phone"
          {...register("phone_number", {
            required: "phone number is required",
          })}
          onChange={handleInputChange}
          color={errors.phone_number && "failure"}
          helperText={errors.phone_number?.message}
        />
      </div>
    </div>
  );
}
