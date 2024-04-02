import { Label, TextInput } from "flowbite-react";

export default function StepThree({ form }) {

  const handleInputChange = (e) => {
    const { name } = e.target;
    clearErrors(name);
  };
  const { register,formState:{errors},clearErrors } = form;
  return (
    <div className="flex flex-col gap-3">
          <div>
            <Label htmlFor="facilty" value="name of current facility" />
            <TextInput
              type="text"
              id="facilty"
              {...register("facility_affiliated_with", {
                required: "This field is required",
              })}
              onChange={handleInputChange}
              color={errors.facility_affiliated_with && "failure"}
              helperText={<small>{errors.facility_affiliated_with?.message}</small>}
            />
          </div>
      <div>
        <Label htmlFor="staffId" value="please enter your staff id" />
        <TextInput
          type="text"
          id="staffId"
          {...register("staff_id", {
            required: "This field is required",
          })}
          onChange={handleInputChange}
          color={errors.staff_id && "failure"}
          helperText={<small>{errors.staff_id?.message}</small>}
        />
      </div>
      <div>
        <Label
          htmlFor="emergency"
          value="Please enter your emergency contact"
        />
        <TextInput
          type="tel"
          id="emergency"
          addon="+233"
          {...register("emmergency_number", {
            required: "This field is required",
          })}
          onChange={handleInputChange}
          color={errors.emmergency_number && "failure"}
          helperText={<small>{errors.emmergency_number?.message}</small>}
        />
      </div>
      <div>
        <Label htmlFor="address" value="Please enter your Digital Address" />
        <TextInput
          type="text"
          id="address"
          {...register("digital_address", {
            required: "This field is required",
          })}
          onChange={handleInputChange}
          color={errors.digital_address && "failure"}
          helperText={<small>{errors.digital_address?.message}</small>}
        />
      </div>
    </div>
  );
}
