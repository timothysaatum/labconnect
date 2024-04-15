import { z } from "zod";
import { isValidPhoneNumber } from "react-phone-number-input";

export const SignupSchema = z
  .object({
    account_type: z.string().min(1, "Please select an account type"),
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone_number: z.string().refine(isValidPhoneNumber, "Invalid phone number"),
    gender: z.string().min(1, "please select a gender"),
    staff_id: z.string().min(1, "Staff ID is required"),
    current_facility: z.string().min(1, "Facility is required"),

    emmergency_number: z
      .string()
      .refine(isValidPhoneNumber, "Invalid phone number"),
    digital_address: z.string().min(1, "Digital address is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirmation: z.string(),
    tc: z.boolean(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  })
  .refine((data) => data.tc === true, {
    message: "you must agree to the terms and conditions to continue",
    path: ["tc"],
  });

  export const SigninSchema = z.object({
    email: z.string().email({ message: "Invalid email" }),
    password: z.string().min(1, { message: "Password is required" }),
  });


export const labRequestSchema = z.object({
  name_of_patient: z.string().min(1, "Patient name is required"),
  patient_age: z.coerce.number().min(1, "age is required"),
  patient_sex: z.string().min(1, "Sex is required"),
  // sample_type: z.string().min(1, "Sample type is required"),
  // sample_container: z.string().min(1, "Sample container is required"),
  // delivery: z.string().min(1, "Delivery Service is required"),
  // lab: z.string().min(1, "Lab is required"),
  // hospital: z.string().min(1, "Hospital is required"),
  // ward: z.string().min(1, "Ward is required"),
  // brief_description: z.string().min(1, "Brief description is required"),
  // attachment: z.string().nullable(),
  // tests: z.array(z.string()).nonempty("Please select at least one test"),
});
export const OTPSchema = z.object({
  code: z.string().min(10, {
    message: "Your one-time password must be 10 characters.",
  }),
});
