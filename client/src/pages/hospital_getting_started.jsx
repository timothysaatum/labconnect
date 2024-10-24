import { Spotlight } from "@/components/ui/spotlight";
import { GridBackground } from "@/components/ui/gridboxes";

import BlurFade from "@/components/magicui/blur-fade";
import logo from "/images/logo.png";
import { Link, Outlet } from "react-router-dom";

import useLogout from "@/hooks/uselogout";
import { Button } from "@/components/ui/button";
import ThemeToggler from "@/components/ThemeToggler";
import { LogOut } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Hospitalgettingstarted = () => {
  return (
      <div>
      <Outlet />
    </div>
  );
};

export default Hospitalgettingstarted;

export const GettingStartedOverViewHospital = () => {
  const logout = useLogout();
  return (
    <GridBackground>
      <Spotlight
        className="-top-40 left-0 md:left-80 md:-top-30"
        fill="white"
      />
      <div className="fixed z-50 left-0 top-0 h-full flex justify-end gap-4 p-4 flex-col">
        <ThemeToggler />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span
                onClick={() => logout()}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <LogOut className="h-5 w-5" />
                <span className="sr-only">logout</span>
              </span>
            </TooltipTrigger>
            <TooltipContent side="right">Log out</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="h-screen w-full flex justify-center antialiased relative overflow-hidden bg-muted/10  dark:text-inherit text-muted-foreground ">
        <div className="flex mt-20 flex-col items-center justify-center text-center  mx-auto relative z-10  w-full">
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
              <Link to="create-hospital">
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
