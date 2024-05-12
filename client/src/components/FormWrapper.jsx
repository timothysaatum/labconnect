import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const formVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
    transition: {
      ease: "easeOut",
    },
  },
};

const FormWrapper = ({ children }) => {
  return (
    <motion.div
      variants={formVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={cn("flex flex-col gap-2")}
    >
      {children}
    </motion.div>
  );
};

export default FormWrapper;
