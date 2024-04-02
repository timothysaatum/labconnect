import { Alert, Button, Label, TextInput } from "flowbite-react";
import { Link,useLocation,useNavigate } from "react-router-dom";
import {useForm } from "react-hook-form";
import Motion from "../components/motion";
import { useEffect, useState } from "react";
import axios from "axios";
import { setAuth } from "../redux/auth/authSlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import TestSelect from "../components/ui/select";

export default function SignIn() {
  const form = useForm();
  const [serverErrors, setServerErrors] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";  

  const { auth } = useSelector((state) => state.auth);
  const dispatch  = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "/api/user/login/",
        JSON.stringify(data),
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log(JSON.stringify(response?.data));
      setServerErrors(null);
      const { access_token, refresh_token } = response?.data;
      dispatch(setAuth({ access_token, refresh_token }));
      navigate(from,{replace:true});
    } catch (error) {
      setServerErrors(error.response.data);
    }
  };
  useEffect(() => {
    console.log(auth);
  },[auth])
  return (
    <Motion className="min-h-dvh mt-20">
      <article className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row gap-5 md:items-center">
        <div className="flex-1">
          <h2 className="text-5xl text-green-400 font-semibold drop-shadow-xl"></h2>
          <p className="text-sm text-gray-400">
            Sign in the continue using our services
          </p>
        </div>
        <section className="flex-1">
          <form
            className="flex flex-col gap-4"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <Label value="Your email" />
              <TextInput
                placeholder="Enter your email"
                autoFocus
                color={errors.email && "failure"}
                helperText={errors?.email?.message}
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                    message: "Invalid email address",
                  },
                })}
              />
            </div>
            <div className=" flex flex-col justify-end">
              <Label value="Your password" />
              <TextInput
                placeholder="Enter password"
                color={errors.password && "failure"}
                helperText={errors?.password?.message}
                type="password"
                {...register("password", {
                  required: "Password is required",
                })}
              />
              <Link className="text-right text-xs mt-2">forgot password?</Link>
            </div>
            <Button
              gradientDuoTone="greenToBlue"
              type="submit"
              isProcessing={isSubmitting}
              disabled={isSubmitting}
            >
              Sign In
            </Button>
            <span className="text-xs">
              Don't have an account?{" "}
              <Link to={"/sign-up"} className="text-green-400 hover:underline">
                Sign up here
              </Link>
              <button onClick={()=>{dispatch(setAuth("confici"))}}>hhhh</button>
            </span>
            {serverErrors && (
              <Alert color={"failure"}>{serverErrors.detail}</Alert>
            )}
          </form>
        </section>
      </article>
      <div></div>
    </Motion>
  );
}
