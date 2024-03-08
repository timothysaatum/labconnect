import { Button, Label, TextInput } from "flowbite-react";
import { useState } from "react";
import { ImEye, ImEyeBlocked } from "react-icons/im";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  // const handleShowPassword = () => {
  //   setShowPassword(!showPassword);
  // };
  return (
    <div className="min-h-dvh mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row gap-5 md:items-center">
        <div className="flex-1">
          <h2 className="text-5xl text-green-400 font-semibold drop-shadow-xl"></h2>
          <p className="text-sm text-gray-400">
            Sign in the continue using our services
          </p>
        </div>
        <div className="flex-1">
          <form className="flex flex-col gap-4">
            <div>
              <Label value="Your email" />
              <TextInput placeholder="Enter your email" type="email" />
            </div>
            <div>
              <Label value="Your password" />
              <TextInput
                placeholder="Enter password"
                type="password"
                rightIcon={showPassword ? ImEye : ImEyeBlocked}
              />
            </div>
            <Button gradientDuoTone="greenToBlue">Sign In</Button>
          </form>
        </div>
      </div>
      <div></div>
    </div>
  );
}
