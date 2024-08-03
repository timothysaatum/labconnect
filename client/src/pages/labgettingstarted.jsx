import React, { useEffect, useState } from "react";
import { Spotlight } from "@/components/ui/spotlight";
import { TextGenerateEffect } from "@/components/ui/text-generate";
import { GridBackground } from "@/components/ui/gridboxes";
import CreateLab from "../components/createLab/createLabOne";
import MagicButton from "@/components/ui/magicButton";
import CreateBranch from "@/components/dashboard/createBranch";
import { useTheme } from "@/components/themeProvider";
import { TracingBeam } from "@/components/ui/tracingbeam";
import CreateTest from "@/components/dashboard/CreateTest";
import { Progress } from "@/components/ui/progress";
import { useFetchUserBranches, useFetchUserLab } from "@/api/queries";
import { DotBackground } from "@/components/ui/dotbackground";
import BlurFade from "@/components/magicui/blur-fade";
import logo from "/images/logo.png";
import { Link, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/auth/authSlice";
import useLogout from "@/hooks/uselogout";
import { Button } from "@/components/ui/button";
import ThemeToggler from "@/components/ThemeToggler";
import { LogOut } from "lucide-react";

const Labgettingstarted = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default Labgettingstarted;

export const GettingStartedOverView = ({ setStep }) => {
  const { data, isError, isFetching, error } = useFetchUserLab();
  const { theme } = useTheme();
  const user = useSelector(selectCurrentUser);
  const logout = useLogout();

  const {
    data: branches,
    isFetching: branchesFetching,
    error: brancheserror,
  } = useFetchUserBranches();

  return (
    <GridBackground>
      <Spotlight
        className="-top-40 left-0 md:left-80 md:-top-30"
        fill="white"
      />

      <div className="h-screen w-full flex justify-center antialiased relative overflow-hidden bg-muted/10  dark:text-inherit text-muted-foreground ">
        <div className="flex mt-20 flex-col items-center justify-center text-center  mx-auto relative z-10  w-full">
          {/* <div className=" gap-4 top-4 right-4 flex flex-col p-4 self-end">
          <ThemeToggler />
          <Button onClick={logout} size="icon" variant="ghost">
            <LogOut className="w-4 h-4" />
          </Button>
        </div> */}
          <BlurFade inView delay={0.5}>
            <div>
              <img
                src={logo}
                alt="LabConnect's logo"
                className="w-56 md:w-72"
              />
            </div>
          </BlurFade>
          <BlurFade delay={0.45 * 2} inView>
            <h2 className="text-xl font-semibold tracking-wide sm:text-4xl xl:text-4xl/none leading-8 mb-4">
              Innovative Access To Laboratories
            </h2>
          </BlurFade>
          <BlurFade delay={0.4 * 3} inView>
            <span className="text-xl text-pretty tracking-tighter sm:text-3xl xl:text-4xl/none ">
              <span className="text-md sm:text-xl">With</span>
              <strong className=" min-h-16 bg-gradient-to-r from-purple-500 via-purple-400 to-pink-500 px-4 py-[1px] ml-2 rounded-md text-white">
                LabConnect
              </strong>
            </span>
          </BlurFade>
          <BlurFade inView delay={0.5 * 4}>
            <div className="mt-14">
              <Link to="create-Laboratory">
                <Button variant="outline" size="lg" className="w-56">
                  Let's Get Started
                </Button>
              </Link>
            </div>
          </BlurFade>
        </div>
      </div>
    </GridBackground>
  );
};
