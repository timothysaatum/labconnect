import { Button, Card, Label, TextInput } from "flowbite-react";
import { useState } from "react";
import { HiOutlinePlus, HiOutlineUserAdd } from "react-icons/hi";
import { motion } from "framer-motion";

export default function AddUser() {
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
  const [openForm, setOpenForm] = useState(false);
  return (
    <div className="flex gap-10 justify flex-col lg:flex-row">
      <div className=" max-w-3xl flex-1">
        <Card className="card-reset-update">
          <div className="!py-4 border-b-2 border-b-gray-200 dark:border-b-gray-500">
            <h3 className=" font-semibold text-xl">Add user account</h3>
            <p className="text-xs text-gray-400">
              Can add maximum of three accounts including main account.
            </p>
          </div>
          {!openForm && (
            <Button
              outline
              onClick={() => {
                setOpenForm(!openForm);
              }}
              gradientDuoTone="greenToBlue"
              className="max-w-80"
              size={"lg"}
            >
              <HiOutlinePlus className="mr-4" /> Add new user
            </Button>
          )}
          {openForm && (
            <motion.form
              className="flex flex-col gap-3 max-w-[36rem]"
              variants={container}
              initial="hidden"
              animate="show"
              exit="hidden"
            >
              <motion.div variants={item}>
                <div className="flex justify-between">
                  <p className="italic text-gray-400 text-sm">
                    Added users can log in with their email and passwords
                  </p>
                  <p
                    className="text-xl cursor-pointer"
                    onClick={() => {
                      setOpenForm(false);
                    }}
                  >
                    x
                  </p>
                </div>
              </motion.div>
              <motion.div variants={item}>
                <Label value="username " htmlFor="username" />
                <TextInput type="text" placeholder="username" id="username" />
              </motion.div>
              <motion.div variants={item}>
                <Label value="email " htmlFor="email" />
                <TextInput placeholder="email" id="email" type="email" />
              </motion.div>
              <motion.div variants={item}>
                <Label value="phone number " htmlFor="phone_number" />
                <TextInput
                  placeholder="phone number"
                  id="phone_number"
                  type="tel"
                />
              </motion.div>
              <motion.div variants={item}>
                <Label value="New user password" htmlFor="new_user_password" />
                <TextInput
                  placeholder="New user password"
                  id="new_user_password"
                  type="password"
                />
              </motion.div>
              <motion.div variants={item}>
                <Label value="Admin password" htmlFor="admin_password" />
                <TextInput placeholder="Admin password" id="admin_password" />
              </motion.div>
              <motion.div variants={item}>
                <Button
                  gradientDuoTone="purpleToBlue"
                  className="w-full mx-auto"
                >
                  Add account
                </Button>
              </motion.div>
            </motion.form>
          )}
        </Card>
      </div>
      <div className="max-w-[24rem] lg:w-[24rem]">
        <Card>
          <div className="!py-4 border-b-2 border-b-gray-200 dark:border-b-gray-500">
            <h3 className=" font-semibold text-xl max-w-full">
              Active accounts
            </h3>
          </div>
          <div className="flex">
            <div>
              <img
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D"
                alt="user_profile"
                className="max-w-14 max-h-14 rounded-full object-cover drop-shadow-md aspect-square min-h-10 min-w-10"
              />
            </div>
            <div className="ml-5 w-full">
              <div className="flex justify-between font-semibold text-gray-500 text-sm w-full">
                <p>Adda Conficius</p> <span>3m ago</span>
              </div>
              <p className="dark:text-gray-500 text-gray-400 text-xs">CEO</p>
            </div>
          </div>

          <div className="flex">
            <div>
              <img
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D"
                alt="user_profile"
                className="max-w-14 max-h-14 rounded-full object-cover drop-shadow-md aspect-square min-h-10 min-w-10"
              />
            </div>
            <div className="ml-5 w-full">
              <div className="flex justify-between font-semibold text-gray-500 text-sm w-full">
                <p>Adda Conficius</p> <span>3m ago</span>
              </div>
              <p className="dark:text-gray-500 text-gray-400 text-xs">CEO</p>
            </div>
          </div>

          <div className="flex">
            <div>
              <img
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D"
                alt="user_profile"
                className="max-w-14 max-h-14 rounded-full object-cover drop-shadow-md aspect-square min-h-10 min-w-10"
              />
            </div>
            <div className="ml-5 w-full">
              <div className="flex justify-between font-semibold text-gray-500 text-sm w-full">
                <p>Adda Conficius</p> <span>3m ago</span>
              </div>
              <p className="dark:text-gray-500 text-gray-400 text-xs">CEO</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
