import { Link, NavLink, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import ThemeToggler from "./ThemeToggler";
import { Sidebar } from "./sidebar";
import { selectCurrentUser } from "@/redux/auth/authSlice";
import { useSelector } from "react-redux";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useLogout from "@/hooks/uselogout";
import { Badge } from "./ui/badge";
import { useFetchUserDetails, useFetchUserLab } from "@/api/queries";
import { useMemo } from "react";

const Header = () => {
  const location = useLocation();
  const logout = useLogout();

  const { data: labData } = useFetchUserLab();
  const data = useMemo(() => labData, [labData]);
  const user = useSelector(selectCurrentUser);
  return (
    <nav
      aria-label="main navigation bar"
      className={`${
        location.pathname.includes("/dashboard") ? "sm:ml-14" : ""
      } ${location.pathname.includes("getting-started") && "hidden"} flex justify-between px-4 md:px-8 items-center py-3 border-b-[1px]`}
    >
      <Link
        to="/"
        className="text-xl w-fit font-bold from-[#6366F1] via-[#D946EF] to-[#FB7185] bg-gradient-to-r bg-clip-text text-transparent"
      >
        <h3>LabConnect</h3>
      </Link>
      <ul className="hidden gap-5 lg:gap-10 md:flex mx-4 whitespace-nowrap">
        <NavLink to="/">
          <li>Home</li>
        </NavLink>
        <NavLink to="dashboard">
          <li>Dashboard</li>
        </NavLink>
        <NavLink to="/contact-us">
          <li>Contact us</li>
        </NavLink>
        <NavLink to="/about">
          <li>About</li>
        </NavLink>
      </ul>
      <div className=" flex items-center gap-2">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full"
              >
                <Avatar>
                  <AvatarImage
                    src={
                      data?.data[0]?.logo ||
                      "http://localhost:8000/media/labs/logo/Capture.PNG"
                    }
                  />
                  <AvatarFallback></AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="">
                {user?.full_name}{" "}
                {user.is_admin && (
                  <Badge className="float-right clear-right ml-3" variant="outline">
                    Admin
                  </Badge>
                )}
                <br />
                <span className="text-muted-foreground/45 text-xs">
                  {user?.email}
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link to="/dashboard/settings">
                <DropdownMenuItem>Settings</DropdownMenuItem>
              </Link>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="md:flex gap-2 hidden">
            <Link to={"/sign-in"}>
              <Button variant="outline" size="lg">
                Sign in
              </Button>
            </Link>
            <Link to={"/sign-up"}>
              <Button size="lg">Sign up</Button>
            </Link>
          </div>
        )}
        <div className="hidden md:block ml-2">
          <ThemeToggler />
        </div>

        <div className="md:hidden">
          <Sidebar />
        </div>
      </div>
    </nav>
  );
};

export default Header;
