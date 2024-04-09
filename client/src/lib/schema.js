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
  }).refine(data => data.tc===true, {
    message: "you must agree to the terms and conditions to continue",
    path: ["tc"],
  });