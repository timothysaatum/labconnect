import { motion } from "framer-motion";

const formVariants = {
  hidden: {
    opacity: 0,
    x: -50,
  },
  visible: {
    opacity: 1,
    x: 0,
  },
  exit: {
    opacity: 0,
    x: 50,
    transition: {
      ease: "easeOut",
    },
  },
};

const FormWrapper = ({ children }) => {
  return (
    <motion.div
      className="flex flex-col gap-5"
      variants={formVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {children}
    </motion.div>
  );
};

export default FormWrapper;
