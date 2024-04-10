import { Link, NavLink, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import ThemeToggler from "./ThemeToggler";
import { Sidebar } from "./sidebar";

const Header = () => {
  const location = useLocation();
  return (
    <nav
      aria-label="main navigation bar"
      className={`${
        location.pathname === "/dashboard" ? "sm:ml-14" : ""
      } flex justify-between px-4 md:px-8 items-center py-3 border-b-2 border-gray-200 dark:border-gray-800 shadow-sm`}
    >
      <div className="text-xl w-fit font-bold from-[#6366F1] via-[#D946EF] to-[#FB7185] bg-gradient-to-r bg-clip-text text-transparent">
        <h3>LabConnect</h3>
      </div>
      <ul className="hidden gap-5 lg:gap-10 md:flex">
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "text-blue-500" : "")}
        >
          <li>Home</li>
        </NavLink>
        <NavLink
          to="/contact-us"
          className={({ isActive }) => (isActive ? "text-blue-500" : "")}
        >
          <li>Contact us</li>
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) => (isActive ? "text-blue-500" : "")}
        >
          <li>About</li>
        </NavLink>
        <NavLink
          to="/dashboard"
          className={({ isActive }) => (isActive ? "text-blue-500" : "")}
        >
          <li>Dashboard</li>
        </NavLink>
      </ul>
      <div className=" flex items-center gap-2">
        <div className="md:flex gap-2 hidden">
          <Link to={"/sign-in"}>
            <Button variant="outline">Sign in</Button>
          </Link>
          <Link to={"/sign-up"}>
            <Button variant="gradient">Sign up</Button>
          </Link>
        </div>
        <div className="hidden sm:block">
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
