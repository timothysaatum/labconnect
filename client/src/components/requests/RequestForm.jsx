import React from "react";
import { Form } from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { labRequestSchema } from "../../lib/schema";
import { AnimatePresence } from "framer-motion";
import PatientDetails from "./patient.form";
import { Button } from "../ui/button";
import { DevTool } from "@hookform/devtools";

const RequestForm = ({ step,setStep }) => {
    const [label, setLabel] = React.useState("Years(s)");

  const form = useForm({
    resolver: zodResolver(labRequestSchema),
    defaultValues: {
      name_of_patient: "",
      patient_age: "",
      patient_sex: "",
    },
  });
  const onSubmit = (data) => {
    try {
      const formData= {...data,patient_age: data.patient_age + label};
      console.log(formData);
    } catch (error) {
      console.log(error);
    }
  };

  const requestFormRender = () => {
    switch (step) {
      case 1:
        return (
          <AnimatePresence>
            <PatientDetails form={form} label={label} setLabel={setLabel} />
          </AnimatePresence>
        );
    }
  };
  return (
    <Form {...form}>
      <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="pb-10">
        {requestFormRender()}
        <Button className="w-full mt-4" type="submit" >Proceed</Button>
      </form>
      <DevTool control={form.control} />
    </Form>
  );
};

export default RequestForm;
