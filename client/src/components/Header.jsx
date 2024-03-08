import { Navbar } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { useDispatch } from "react-redux";
import { FaMoon, FaSun } from "react-icons/fa";
import { Button } from "flowbite-react";

export default function Header() {
  const { theme } = useSelector((state) => state.theme);

  const dispatch = useDispatch();

  const path = useLocation().pathname;

  const ThemeToggler = () => {
    return (
      <Button
        className="w-12 h-10 hidden sm:inline"
        color="gray"
        pill
        onClick={() => dispatch(toggleTheme())}
      >
        {theme === "light" ? <FaSun /> : <FaMoon />}
      </Button>
    );
  };
  return (
    <Navbar className="border-b-2">
      <Link
        to="/"
        className="self-center whitespace-nowrap text-sm sm:text-2xl font-semibold dark:text-white drop-shadow-lg font-mono"
      >
        lab Connect
      </Link>
      <div className="flex gap-2 md:order-2">
        <ThemeToggler />
        <Link to={path==='/sign-in'?"/sign-up":"/sign-in"}>
          <Button gradientDuoTone="greenToBlue" outline>
           {
            path === "/sign-in" ? "Sign Up" : "Sign In"
           }
          </Button>
        </Link>
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link as={"div"} active={path === "/"}>
          <Link to="/">Home</Link>
        </Navbar.Link>
        <Navbar.Link as={"div"} active={path === "/services"}>
          <Link to="/services">Services</Link>
        </Navbar.Link>
        <Navbar.Link as={"div"} active={path === "/About"}>
          About
        </Navbar.Link>
        <Navbar.Link as={"div"} active={path === "/contact"}>
          contact us
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
