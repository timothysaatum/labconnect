import {Label, Select} from "flowbite-react";

const StepOne = ({ form }) => {
  const { register } = form;
  return (
    <div>
      <Label htmlFor="account" value="How do you intend to use our services" />
      <Select
        id="account"
        className="mt-4"
        {...register("accountType", {
          required: "This field is required",
        })}
        shadow
        defaultValue={"clinician"}
      >
        <option value="clinician">As a clinician</option>
        <option value="laboratory">As a laboratory</option>
        <option value="delivery">As a delivery Agent</option>
      </Select>
    </div>
  );
};

export default StepOne;
