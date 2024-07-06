import { z } from "zod";
import { isValidPhoneNumber } from "react-phone-number-input";

//create account schema
export const SignupSchema = z
  .object({
    account_type: z.string().min(1, "Please select an account type"),
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    phone_number: z.string().refine(isValidPhoneNumber, "Invalid phone number"),
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

//sign in schema
export const SigninSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(1, { message: "Password is required" }),
});

//tests schema used in sending sample
const multiSelectSchema = z.object({
  label: z.string(),
  value: z.string(),
});

//send sample by hospital schema
export const hospitalRequestSchema = z.object({
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
  lab: z.string().min(1, "laboratory is required"),
  tests: z.array(multiSelectSchema).min(1),
  brief_description: z.string(),
  attachment: z.instanceof(FileList),
});

//send sample by laboratory schema
export const labRequestSchema = z.object({
  name_of_patient: z.string().min(1, "Patient name is required"),
  patient_age: z.date({
    required_error: "Date of birth is required",
    invalid_type_error: "Enter a valid date format YYY-MM-DD",
  }),
  patient_sex: z.string().min(1, "Sex is required"),
  from_lab: z.string().min(1, "laboratory is required"),
  to_lab: z.string().min(1, "laboratory is required"),
  tests: z.array(multiSelectSchema).min(1),
  brief_description: z.string(),
  // attachment: z.instanceof(FileList),
});

//OTP SCHEMA
export const OTPSchema = z.object({
  code: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

//Email reset scheme
export const ResetPassEmailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

//password reset scheme
export const ResetPassSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

//add discount schema
export const AddDiscountSchema = z
  .object({
    price: z
      .string()
      .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
        message: "must be a positive integer",
      })
      .transform(Number),
    discount_price: z
      .string()
      .optional()
      .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
        message: "must be a positive integer",
      })
      .transform((val) => (val === undefined ? 0 : Number(val))),
  })
  .refine(
    (data) => {
      if (data.discount_price === undefined) return true;
      return data.discount_price <= data.price;
    },
    {
      message: "Discount cannot be greater price",
      path: ["discount_price"],
    }
  );
// addTest Schema
export const AddTestSchema = z
  .object({
    branch: z.array(multiSelectSchema).min(1),
    price: z.string().min(1, "price is required"),
    test_code: z.string().min(1, "Test Code is required"),
    name: z.string().min(1, "Test Name is required"),
    turn_around_time: z.string().min(1, "Turn around time is required"),
    unit: z.string().min(1, "unit for turn around time is required"),
    patient_preparation: z.string(),
    discount_price: z.string(),
    sample_type: z
      .array(
        z.object({
          label: z.string(),
          value: z.number(),
        })
      )
      .min(1),
  })
  .refine((data) => data.discount_price < data.price, {
    message: "Discount cannot be more than price",
  });

//addBranch schema
export const AddBranchSchema = z.object({
  name: z.string().min(1, "Branch name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  phone: z.string().refine(isValidPhoneNumber, "Invalid phone number"),
  digital_address: z.string().min(1, "Digital address is required"),
  town: z.string().min(1, "Location is required"),
  postal_address: z.string().min(1, "Postal address is required"),
  region: z.string().min(1, "Region is required"),
});
export const ManagerInviteSchema = z.object({
  receiver_email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  branch: z.string().min(1, "Branch is required"),
});

//create lab schema
export const CreateLabSchema = z.object({
  created_by: z.any(),
  name: z.string().min(1, "Laboratory name is requires"),
  herfra_id: z.string().min(1, "Herfra Id is required"),
  postal_address: z.string().min(1, "Postal address is required"),
  main_email: z.string().email("Invalid email address"),
  main_phone: z.string().refine(isValidPhoneNumber, "Invalid phone number"),
  website: z.string(),
  description: z.string().min(1, "Description is required"),
  logo: z.instanceof(FileList),
});

//sample type

export const SampleTypeSchema = z.object({
  sample_name: z.string().min(1, "Sample type is required"),
  collection_procedure: z.string().min(1, "Collection procedure is required"),
  collection_time: z.string().min(1, "time is required"),
});

export const ManagerAcceptSchema = z
  .object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    phone_number: z.string().refine(isValidPhoneNumber, "Invalid phone number"),
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
