import React from "react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { useForm } from "react-hook-form";
import { labRequestSchema } from "@/lib/schema";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import MultipleSelector from "../ui/multi-select";

const RequestForm = () => {
  const form = useForm({
    // resolver: zodResolver(labRequestSchema),
    defaultValues: {
      name_of_patient: "",
      patient_age: "",
      patient_sex: "",
      sample_type: "",
      sample_container: "",
      delivery: "",
      lab: "",
      hospital: "",
      ward: "",
      brief_description: "",
      attachment: "",
      tests: [],
    },
  });
  const OPTIONS = [
    { label: "Full Blood Count (FBC)", value: "fbc" },
    { label: "Urinalysis (U/A)", value: "urinalysis" },
    { label: "Blood Glucose", value: "bloodGlucose" },
    { label: "Electrolytes", value: "electrolytes" },
    { label: "Liver Function Tests (LFTs)", value: "lft" },
    { label: "Kidney Function Tests (KFTs)", value: "kft" },
    { label: "Lipid Profile", value: "lipidProfile" },
    { label: "HIV Test", value: "hivTest" },
    { label: "Malaria Parasite Detection", value: "malariaParasite" },
    { label: "Hepatitis B Test", value: "hepatitisB" },
    { label: "Hepatitis C Test", value: "hepatitisC" },
    { label: "Urinalysis Culture", value: "urineCulture" },
    { label: "Stool Occult Blood", value: "stoolOccultBlood" },
    { label: "Sputum Culture", value: "sputumCulture" },
    { label: "Widal Test", value: "widalTest" },
  ];

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const onSubmit = (data) => {
    console.log(data);
  }
  return (
    <section>
      <Form {...form}>
        <form
          className={`${
            isDesktop ? "grid grid-cols-2 gap-x-8 gap-y-10" : ""
          } px-4 py-2`}
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            name="name_of_patient"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name of Patient</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Name of patient" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="patient_age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Patient's Age</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Patient's age" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="patient_sex"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name of Patient</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Patient's Sex" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="sample_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sample Type</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Sample type"
                    {...field}
                    size="small"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="sample_container"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sample Container</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Sample container"
                    {...field}
                    size="small"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="delivery"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Delivery Service <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Delivery Service"
                    {...field}
                    size="small"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="lab"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Laboratory</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Laboratory"
                    {...field}
                    size="small"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="hospital"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hospital</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Hospital"
                    {...field}
                    size="small"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="ward"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ward</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Ward"
                    {...field}
                    size="small"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="attachment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Attachment</FormLabel>
                <FormControl>
                  <Input type="file" placeholder="Attachment" {...field}  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="tests"
            control={form.control}
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Tests</FormLabel>
                <FormControl>
                  <MultipleSelector
                    value={field.value}
                    onChange={field.onChange}
                    defaultOptions={OPTIONS}
                    hidePlaceholderWhenSelected
                    placeholder="Select frameworks you like..."
                    emptyIndicator={
                      <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                        no results found.
                      </p>
                    }
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
          control={form.control}
            name="brief_description"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Brief Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Brief description"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" className="col-span-2">
            Submit Request
          </Button>
        </form>
      </Form>
    </section>
  );
};

export default RequestForm;

//   name_of_patient: z.string().min(1, "Patient name is required"),
//   patient_age: z.coerce.number().min(1, "age is required"),
//   patient_sex: z.string().min(1, "Sex is required"),
//   sample_type: z.string().min(1, "Sample type is required"),
//   sample_container: z.string().min(1, "Sample container is required"),
//   delivery: z.string().min(1, "Delivery Service is required"),
//   lab: z.string().min(1, "Lab is required"),
//   hospital: z.string().min(1, "Hospital is required"),
//   ward: z.string().min(1, "Ward is required"),
//   brief_description: z.string().min(1, "Brief description is required"),
//   attachment: z.string().nullable(),
//   tests: z.array(z.string()).nonempty("Please select at least one test"),
