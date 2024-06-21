import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Package2,
  Settings,
  PanelLeft,
  LogOut,
  BellDot,
  Bell,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import NotiicationsPopover from "@/components/dashboard/notificationsPopover";
import { Button } from "@/components/ui/button";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useGetSideLinks } from "@/hooks/usesidelinks";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/auth/authSlice";
import useLogout from "@/hooks/uselogout";
import ThemeToggler from "@/components/ThemeToggler";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useFetchUserLab } from "@/api/queries";
import { Badge } from "@/components/ui/badge";
import React from "react";

export default function Dashboard() {
  const user = useSelector(selectCurrentUser);
  const sideLinks = useGetSideLinks(user?.account_type);
  const location = useLocation();
  const logout = useLogout();
  const { data } = useFetchUserLab();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <div className="flex flex-col min-h-screen bg-muted/10">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            to="/dashboard?tab=overview"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
            <span className="sr-only">LabConnect</span>
          </Link>
          {sideLinks.map((item) => (
            <TooltipProvider key={item.name}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to={item.link}
                    className={`${
                      (item.link === "/dashboard" &&
                        location.pathname === "/dashboard") ||
                      (item.link !== "/dashboard" &&
                        location.pathname.includes(item.link))
                        ? "bg-accent text-accent-foreground"
                        : ""
                    } flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8`}
                  >
                    {item.icon}
                    <span className="sr-only">{item.name}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{item.name}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="settings"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">Settings</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Settings</TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
        </nav>
      </aside>
      <div className="flex flex-col sm:gap-4">
        <header className="sticky justify-between top-0 z-30 sm:hidden flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  href="#"
                  className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                >
                  <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
                  <span className="sr-only">LabConnect</span>
                </Link>
                {sideLinks.map((item) => (
                  <Link
                    to={item.link}
                    key={item.link}
                    className={` ${
                      (item.link === "/dashboard" &&
                        location.pathname === "/dashboard") ||
                      (item.link !== "/dashboard" &&
                        location.pathname.includes(item.link))
                        ? "bg-accent text-accent-foreground"
                        : ""
                    } flex items-center gap-4 px-2.5 py-2 rounded-md text-muted-foreground hover:text-foreground`}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ))}

                <Link
                  to="settings"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Settings className="h-5 w-5" />
                  Settings
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="flex gap-2 items-center">
            <div className="relative sm:hidden ">
              <NotiicationsPopover>
                <Button variant="outline" size="icon">
                  <Bell className="w-4 h-4 text-muted-foreground" />
                </Button>
              </NotiicationsPopover>
              <span className=" absolute w-5 h-5 opacity-55 -translate-y-[35%] grid place-items-center text-xs rounded-full bg-primary top-0 right-0 z-40 dark:text-black text-white">
                2
              </span>
            </div>
            <ThemeToggler />
          </div>
        </header>
        <header className="sm:flex pl-20 hidden w-full pr-6 items-center sticky top-0 left-0 bg-background/40">
          <Breadcrumb>
            <BreadcrumbList>
              {pathnames.map((name, index) => {
                const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
                const isLast = index === pathnames.length - 1;
                return (
                  <React.Fragment key={name}>
                    {index !== 0 && <BreadcrumbSeparator />}
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        {isLast ? (
                          <span>{name}</span>
                        ) : (
                          <Link to={routeTo}>{name}</Link>
                        )}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  </React.Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
          <div className="relative ml-auto flex-1 sm:grow-0 flex gap-2 items-center">
            <div className="relative ">
              <NotiicationsPopover>
                <Button variant="outline" size="icon">
                  <Bell className="w-4 h-4 text-muted-foreground" />
                </Button>
              </NotiicationsPopover>
              <span className=" absolute w-5 h-5 opacity-55 -translate-y-[35%] grid place-items-center text-xs rounded-full bg-primary top-0 right-0 dark:text-black text-white">
                2
              </span>
            </div>
          </div>
          {/* <div className="relative ml-auto flex-1 sm:grow-0 flex gap-2 items-center">
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
                    {user?.first_name}{" "}
                    {user.is_admin && (
                      <Badge
                        className="float-right clear-right"
                        variant="outline"
                      >
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
                  <DropdownMenuItem>Contact us</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="md:flex gap-2 hidden">
                <Link to={"/sign-in"}>
                  <Button variant="outline">Sign in</Button>
                </Link>
                <Link to={"/sign-up"}>
                  <Button variant="gradient">Sign up</Button>
                </Link>
              </div>
            )}
            <div className="hidden sm:block ml-2">
              <ThemeToggler />
            </div>
          </div> */}
        </header>
        <Outlet />
      </div>
    </div>
  );
}
