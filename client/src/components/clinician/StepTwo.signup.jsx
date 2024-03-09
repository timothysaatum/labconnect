import { Label, Select, TextInput } from "flowbite-react";
import Oauth from "../Oauth";

export default function StepTwo({ form }) {
  const { register } = form;
  return (
    <div className="flex flex-col gap-3">
      <div>
        <Label htmlFor="firstname" value="first name" />
        <TextInput
          type="text"
          id="firstname"
          {...register("first_name", {
            required: "This field is required",
            pattern: /^[A-Za-z]+$/i,
          })}
        />
      </div>
      <div>
        <Label htmlFor="lastname" value="lastname" />
        <TextInput
          type="text"
          id="lastname"
          {...register("last_name", {
            required: "This field is required",
            pattern: /^[A-Za-z]+$/i,
          })}
        />
      </div>
      <div>
        <Label htmlFor="email" value="email" />
        <TextInput
          type="email"
          id="email"
          {...register("email", {
            required: "This field is required",
            pattern: {
              value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
              message: "Invalid email address",
            },
          })}
        />
      </div>
      <div>
        <Label
          htmlFor="gender"
          value="Choose your gender"
        />
        <Select
          id="gender"
          className="mt-4"
          {...register("gender",{
            required: "This field is required",
          })}
          shadow
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </Select>
      </div>
      <div>
        <Label htmlFor="phone" value="phone number" />
        <TextInput
          type="text"
          id="phone"
          addon="+233"
          {...register("phone_number", {
            required: "This field is required",
            pattern: /^[0-9]{9}$/i,
          })}
        />
      </div>
      <Oauth />
    </div>
  );
}
