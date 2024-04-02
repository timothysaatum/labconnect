import { Label, Select, TextInput } from "flowbite-react";
import { motion } from "framer-motion";

export default function StepOneRequest() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        staggerDirection: 1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      exit="hidden"
      className="flex flex-col gap-2"
    >
      <motion.div variants={item}>
        <Label htmlFor="patient_name" value="Patient's name" />
        <TextInput type="text" />
      </motion.div>
      <motion.div variants={item}>
        <Label htmlFor="patient_email" value="Patient's email" />
        <TextInput type="email" />
      </motion.div>
      <motion.div variants={item} className="flex gap-4">
        <div className="w-9/12">
          <Label htmlFor="gender" value="Choose your gender" />
          <Select id="gender">
            <optgroup>

            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            </optgroup>
          </Select>
        </div>
        <div>
          <Label htmlFor="patient's age" value="patient's age" />
          <input
            type="number"
            id="patient's age"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="age"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
