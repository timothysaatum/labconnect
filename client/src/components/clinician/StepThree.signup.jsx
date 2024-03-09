import { Label, TextInput } from "flowbite-react";

export default function StepThree({ form }) {
  const { register } = form;
  return (
    <div className="flex flex-col gap-3">
      <div>
        <Label htmlFor="staffId" value="please enter your staff id" />
        <TextInput
          type="text"
          id="staffId"
          {...register("staff_id", {
            required: "This field is required",
          })}
        />
      </div>
      <div>
        <Label htmlFor="facilty" value="name of current facility" />
        <TextInput
          type="text"
          id="facilty"
          {...register("facility_affiliated_with", {
            required: "This field is required",
          })}
        />
      </div>
      <div>
        <Label
          htmlFor="emergency"
          value="Please enter your emmergency contact"
        />
        <TextInput
          type="tel"
          id="emergency"
          addon="+233"
          {...register("emmergency_number", {
            required: "This field is required",
          })}
        />
      </div>
      <div>
        <Label
          htmlFor="address"
          value="Please enter your Digital Address"
        />
        <TextInput
          type="text"
          id="address"
          {...register("digital_address", {
            required: "This field is required",
          })}
        />
      </div>
    </div>
  );
}
