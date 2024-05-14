import { z } from "zod";
import { isValidPhoneNumber } from "react-phone-number-input";

export const SignupSchema = z
  .object({
    account_type: z.string().min(1, "Please select an account type"),
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    id_number: z.string().min(1, "Id is required"),
    email: z.string().email("Invalid email address"),
    phone_number: z.string().refine(isValidPhoneNumber, "Invalid phone number"),
    gender: z.string().min(1, "please select a gender"),
    digital_address: z.string().min(1, "Digital address is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirmation: z
      .string()
      .min(1, "Password confirmation is required"),
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
  value: z.string().min(1),
});

//send sample schema
export const healthWorkerRequestSchema = z.object({
  name_of_patient: z.string().min(1, "Patient name is required"),
  patient_age: z.date({
    required_error: "Date of birth is required",
    invalid_type_error: "Enter a valid date format YYY-MM-DD",
  }),
  patient_sex: z.string().min(1, "Sex is required"),
  sample_type: z.string().min(1, "Sample type is required"),
  hospital: z.number({
    required_error: "hospital is required",
    invalid_type_error: "enter valid data",
  }),
  lab: z.number({
    required_error: "lab is required",
    invalid_type_error: "enter valid data",
  }),
  tests: z.array(testsSchema).min(1),
  brief_description: z.string(),
  attachment: z.instanceof(FileList).optional,
});
export const labRequestSchema = z.object({
  name_of_patient: z.string().min(1, "Patient name is required"),
  patient_age: z.date({
    required_error: "Date of birth is required",
    invalid_type_error: "Enter a valid date format YYY-MM-DD",
  }),
  patient_sex: z.string().min(1, "Sex is required"),
  sample_type: z.string().min(1, "Sample type is required"),
  from_lab: z.string().min(1, "laboratory is required"),
  to_lab: z.string().min(1, "laboratory is required"),
  tests: z.array(testsSchema).min(1),
  brief_description: z.string(),
  // attachment: z.instanceof(FileList),
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

export const AddTestSchema = z.object({
  test_code: z.string().min(1, "Test code is required"),
  name: z.string().min(1, "Test name is required"),
  // price: z.number({
  //   invalid_type_error:"invalid"
  // }).positive("price must be a positive number"),
});
