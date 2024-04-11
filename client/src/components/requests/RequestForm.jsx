import { Form } from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { labRequestSchema } from "../../lib/schema";
import { AnimatePresence } from "framer-motion";
import PatientDetails from "./patient.form";
import { Button } from "../ui/button";

const RequestForm = ({ step }) => {
  const form = useForm({
    resolver: zodResolver(labRequestSchema),
    defaultValues: {
      name_of_patient: "",
    },
  });
  const onSubmit = (data) => {
    console.log(data);
  };

  const requestFormRender = () => {
    switch (step) {
      case 1:
        return (
          <AnimatePresence>
            <PatientDetails form={form} />
          </AnimatePresence>
        );
    }
  };
  return (
    <Form {...form}>
      <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="pb-10">
        {requestFormRender()}
        <Button className="w-full mt-4">Proceed</Button>
      </form>
    </Form>
  );
};

export default RequestForm;
