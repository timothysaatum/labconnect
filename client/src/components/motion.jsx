import { AnimatePresence, motion } from "framer-motion";

export default function Motion({ children, ...rest }) {
  return (
    <AnimatePresence mode="wait">
      <motion.main
        {...rest}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
      >
        {children}
      </motion.main>
    </AnimatePresence>
  );
}
