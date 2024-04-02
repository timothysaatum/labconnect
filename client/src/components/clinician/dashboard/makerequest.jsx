import { Button, Card } from "flowbite-react";
import { motion } from "framer-motion";
import { HiArrowCircleLeft, HiOutlinePlus } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import StepOneRequest from "./stepone.makerequest";
import { useEffect, useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import {handlenextStep, handleprevStep,resetStep} from '../../../redux/requestStep/RequestStepSlice'
import StepTwoRequest from "./steptwo.makerequest";

export default function MakeRequest() {
  const [openForm, setOpenForm] = useState(false);
  const { step } = useSelector((state) => state.step);
  const dispatch = useDispatch()

  // useEffect(()=>{
  //   if(openForm===false){
  //     dispatch(resetStep())
  //   }
  // },[openForm])
  return (
    <motion.div
      className=" md:m-6"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      <Card className="max-w-2xl shadow-sm">
        <Button
          outline
          gradientDuoTone="greenToBlue"
          className="max-w-80"
          size={"lg"}
          onClick={() => {
            setOpenForm(true);
          }}
          disabled={openForm}
        >
          <HiOutlinePlus className="mr-4" /> Make New Request
        </Button>
        {openForm && (
          <motion.form className="max-w-[28rem] mt-5">
            <div className="flex justify-between">
              <HiArrowCircleLeft
                size={"1.6em"}
                className="text-gray-400 cursor-pointer"
                onClick={()=>dispatch(handleprevStep())}
              />
              <p className="italic text-sm text-gray-400 mb-4">
                please fill out the form correctly
              </p>
              <IoIosCloseCircleOutline
                size={"1.6em"}
                className="text-gray-400 cursor-pointer"
                onClick={() => {
                  setOpenForm(false);
                }}
              />
            </div>
            {step === 1 && <StepOneRequest />}
            {step === 2 && <StepTwoRequest />}
            <Button
              gradientDuoTone={"purpleToBlue"}
              className="w-full mt-4"
              onClick={() => dispatch(handlenextStep())}
            >
              Proceed
            </Button>
          </motion.form>
        )}
      </Card>
    </motion.div>
  );
}
