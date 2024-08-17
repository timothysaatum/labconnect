import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
const FormWrapper = ({ children }) => {
  return (
    <motion.div
      initial={{ y: 6, opacity: 0, filter: "blur(6px)" }}
      animate={{ y: -6, opacity: 1, filter: "blur(0px)" }}
      transition={{
        delay: 0.3,
        duration: 0.4,
        ease: "easeOut",
      }}
      exit={{ y: 6, opacity: 0, filter: "blur(6px)" }}
      className={cn("flex flex-col gap-2")}
    >
      {children}
    </motion.div>
  );
};

export default FormWrapper;
