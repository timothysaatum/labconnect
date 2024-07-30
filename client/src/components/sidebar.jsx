import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useGetMainSideLinks, useGetSideLinks } from "@/hooks/usesidelinks";
import { LogOutIcon, Menu, Package2, PanelLeft } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import ThemeToggler from "./ThemeToggler";
import { useSelector } from "react-redux";
import { selectCurrenttoken } from "@/redux/auth/authSlice";
import { useState } from "react";
import useLogout from "@/hooks/uselogout";

export function Sidebar() {
  const mainSideLinks = useGetMainSideLinks();
  const token = useSelector(selectCurrenttoken);
  const [open, setOpen] = useState(false);
  const logOut = useLogout();
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <nav className="flex flex-col justify-between h-full text-lg font-medium">
          <div className="flex flex-col gap-4">
            <NavLink
              href="#"
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
            >
              <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
              <span className="sr-only">LabConnect</span>
            </NavLink>
            {mainSideLinks?.map((item) => (
              <NavLink
                to={item.link}
                key={item.link}
                onClick={() => {
                  setOpen(false);
                }}
                className={` ${
                  location.pathname.endsWith(item.link)
                    ? "bg-accent text-accent-foreground"
                    : ""
                } flex items-center gap-4 px-2.5 py-2 rounded-md text-muted-foreground hover:text-foreground`}
              >
                {item.icon}
                {item.name}
              </NavLink>
            ))}
          </div>
          {token ? (
            <div className="flex items-center justify-between text-base">
              <div
                onClick={() => {
                  setOpen(false);
                }}
              >
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 text-muted-foreground"
                  onClick={() => logOut()}
                >
                  <LogOutIcon className="h-5 w-5" />
                  Logout
                </Button>
              </div>
              <div>
                <ThemeToggler />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="mb-2 flex justify-end ">
                <ThemeToggler />
              </div>
              <Link
                className="w-full"
                to={"/sign-in"}
                onClick={() => {
                  setOpen(false);
                }}
              >
                <Button className="w-full" variant="outline">
                  Sign in
                </Button>
              </Link>
              <Link
                className="w-full"
                to={"/sign-up"}
                onClick={() => {
                  setOpen(false);
                }}
              >
                <Button className="w-full">Sign up</Button>
              </Link>
            </div>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
