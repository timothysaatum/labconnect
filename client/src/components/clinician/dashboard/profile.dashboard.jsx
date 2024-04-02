import DetailSection from "./details.profile";
import { useSelector } from "react-redux";
import UpdateSection from "./update.profile";
import { AnimatePresence, delay, motion } from "framer-motion";
import AddUser from "./adduser.profile";

export default function Profile() {
  const { Section } = useSelector((state) => state.section);
  return (
    <div className="w-full md:m-6 flex gap-8 flex-col sm:flex-row">
      <AnimatePresence mode="wait">
        <motion.div
          className="flex-1"
          key={Section}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {Section === "details" && <DetailSection />}
          {Section === "update" && <UpdateSection />}
          {Section === "adduser" && <AddUser />}
        </motion.div>
      </AnimatePresence>
      <div className="max-w-full sm:max-w-[14rem] md:max-w-[15rem]"></div>
    </div>
  );
}
