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

export const labRequestSchema = z.object({
  name_of_patient: z.string().min(1, "Patient name is required"),
  patient_age: z.number().min(1, "Patient age is required"),
  patient_sex: z.string().min(1, "Sex is required"),
  sample_type: z.string().min(1, "Sample type is required"),
  sample_container: z.string().min(1, "Sample container is required"),
  delivery: z.string().min(1, "Delivery Service is required"),
  lab: z.string().min(1, "Lab is required"),
  hospital: z.string().min(1, "Hospital is required"),
  ward: z.string().min(1, "Ward is required"),
  brief_description: z.string().min(1, "Brief description is required"),
  attachment: z.string().nullable(),
  tests: z.array(z.string()).nonempty("Please select at least one test"),
});


//request model
// 	send_by = models.ForeignKey(user, on_delete=models.CASCADE)
// name_of_patient = models.CharField(max_length=200)
// patient_age = models.PositiveIntegerField()
// patient_sex = models.CharField(max_length=20, choices=SEX)
// sample_type = models.CharField(max_length=200)
// sample_container = models.CharField(max_length=100)
// delivery = models.ForeignKey(Delivery, on_delete=models.CASCADE)
// lab = models.ForeignKey(Laboratory, on_delete=models.CASCADE)
// tests = models.ManyToManyField(Test)
// hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE)
// ward = models.ForeignKey(Ward, on_delete=models.CASCADE)
// brief_description = models.TextField()
// attachment = models.FileField(upload_to='sample/attachments', blank=True, null=True)
// is_received_by_delivery = models.BooleanField(default=False)
// is_delivered_to_lab = models.BooleanField(default=False)
// is_access_by_lab = models.BooleanField(default=False)
// date_created = models.DateField(auto_now_add=True)
// date_modified = models.DateField(auto_now=True)
