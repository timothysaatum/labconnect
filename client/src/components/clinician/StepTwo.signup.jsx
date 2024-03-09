import { Label, TextInput } from "flowbite-react";
import Oauth from "../Oauth";

export default function StepTwo({ form }) {
  const { register } = form;
  return (
    <div className="flex flex-col gap-3">
      <div>
        <Label htmlFor="firstname" value="firstname" />
        <TextInput
          type="text"
          id="firstname"
          {...register("firstname", {
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
          {...register("lastname", {
            required: "This field is required",
            pattern: /^[A-Za-z]+$/i,
          })}
        />
      </div>
      <div>
        <Label htmlFor="email" value="email" />
        <TextInput type="email" id="email" />
      </div>
      <div>
        <Label htmlFor="phone" value="phone number" />
        <TextInput type="text" id="phone" addon='+233'/>
      </div>
      <Oauth />
    </div>
  );
}
