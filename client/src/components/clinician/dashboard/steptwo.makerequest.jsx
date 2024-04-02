import { Label, Select, TextInput } from "flowbite-react";
import { motion } from "framer-motion";
export default function StepTwoRequest() {
  return (
    <motion.div
      className="flex flex-col gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div>
        <Label
          htmlFor="sample type"
          value="What type of sample are you sending"
        />
        <TextInput type="text" id="sample type" />
      </div>
      <div>
        <Label
          htmlFor="sample_container"
          value="What is the sample container"
        />
        <TextInput type="text" id="sample_container" />
      </div>
      <div>
        <Label htmlFor="delivery" value="Delivery" />
        <TextInput type="text" id="delivery" />
      </div>
    </motion.div>
  );
}
