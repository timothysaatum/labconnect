import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LogOutIcon, Menu } from "lucide-react";
import { NavLink } from "react-router-dom";

export function Sidebar() {
  return (
    <Sheet side="left">
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className=" p-0 w-[55%] flex flex-col divide-y-2 pb-10"
      >
        <ul className="flex flex-col gap-2 mt-10 flex-1">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-blue-500 bg-gray-50 dark:bg-slate-700 shadow-sm" : ""
            }
          >
            <li className="p-2">Home</li>
          </NavLink>
          <NavLink
            to="/contact-us"
            className={({ isActive }) => (isActive ? "text-blue-500" : "")}
          >
            <li className="p-2">Contact us</li>
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => (isActive ? "text-blue-500" : "")}
          >
            <li className="p-2">About</li>
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => (isActive ? "text-blue-500" : "")}
          >
            <li className="p-2">Dashboard</li>
          </NavLink>
        </ul>
        <div className="">
          <Button variant="outline" className="w-[80%] flex gap-4 mx-auto mt-4 hover:bg-primary">
            Log out <LogOutIcon/>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
