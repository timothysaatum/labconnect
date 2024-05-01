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
const testsSchema = z.object({
  label: z.string(),
  value: z.number(),
});

//send sample schema
export const labRequestSchema = z.object({
  name_of_patient: z.string().min(1, "Patient name is required"),
  patient_age: z.date({
    required_error: "Date of birth is required",
    invalid_type_error: "Enter a valid date format YYY-MM-DD",
  }),
  patient_sex: z.string().min(1, "Sex is required"),
  sample_type: z.string().min(1, "Sample type is required"),
  sample_container: z.string().min(1, "Sample container is required"),
  delivery: z.number({
    invalid_type_error: "enter valid data",
  }),
  lab: z.number({
    required_error: "lab is required",
    invalid_type_error: "enter valid data",
  }),
  tests: z.array(testsSchema).min(1),
  brief_description: z.string(),
  attachment: z.instanceof(FileList),
});
export const OTPSchema = z.object({
  code: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

export const ResetPassEmailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const ResetPassSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });
