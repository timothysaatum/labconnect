import { Link, Outlet, useLocation } from "react-router-dom";
import {
  Package2,
  Settings,
  PanelLeft,
  LogOut,
  Bell,
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import NotiicationsPopover from "@/components/dashboard/notificationsPopover";
import { Button } from "@/components/ui/button";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useGetSideLinks } from "@/hooks/usesidelinks";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/auth/authSlice";
import useLogout from "@/hooks/uselogout";
import ThemeToggler from "@/components/ThemeToggler";
import React, { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useFetchUserBranches,
  useFetchBranchNotifications,
} from "@/api/queries";
import {
  changeBranch,
  selectActiveBranch,
} from "@/redux/branches/activeBranchSlice";
import AddBranch from "@/components/dashboard/addbranch";
import { Helmet } from "react-helmet-async";
import { DatePickerWithRange } from "../components/dashboard/calenderpopover";

export default function Dashboard() {
  const user = useSelector(selectCurrentUser);
  const sideLinks = useGetSideLinks(user?.account_type);
  const location = useLocation();
  const logout = useLogout();
  const [activeBranch, setActiveBranch] = useState(
    <Skeleton className="h-4 w-20" />
  );
  const [title, setTitle] = useState();

  useEffect(() => {
    setTitle(sideLinks.find((item) => location.pathname.includes(item.link)));
  }, [location.pathname]);

  const {
    data: userbranches,
    isPending: branchesLoading,
    isError: branchesError,
  } = useFetchUserBranches();
  const activeBranchId = useSelector(selectActiveBranch);
  const dispatch = useDispatch();

  console.log(activeBranch);

  useEffect(() => {
    if (userbranches?.data) {
      if (activeBranchId) {
        const active = userbranches?.data?.find(
          (branch) => branch.id === activeBranchId
        );
        console.log("active", active);

        const name = active?.branch_name || active?.town;
        console.log("name", name);
        if (active) {
          const branchname = name + (!active?.branch_name ? " Branch" : "");
          console.log("branchname", branchname);
          setActiveBranch(branchname);
        } else {
          dispatch(changeBranch(userbranches?.data[0]?.id));
        }
      } else {
        dispatch(changeBranch(userbranches?.data[0]?.id));
      }
    }
  }, [activeBranchId, userbranches]);

  const {
    data: notifs,
    error: notifserror,
    isPending: notifsloading,
  } = useFetchBranchNotifications(activeBranchId || undefined);

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>{`${title?.name || ""} - LabConnect`}</title>
      </Helmet>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-14 flex-col border-r bg-background sm:flex">
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
          <ThemeToggler />
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
      {user?.account_type === "Laboratory" &&
        userbranches?.data?.length === 0 && (
          <div className="bg-primary z-20 text-background sm:pl-14 text-center py-2 shadow-md sticky top-0 left-0">
            Your Laboratory has no branches. Add at least one branch
          </div>
        )}
      <div className="flex flex-col">
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
          <div className="flex gap-4 items-center ">
            {userbranches?.data?.length === 0 ? (
              user?.is_admin && <AddBranch />
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    disabled={branchesLoading || branchesError}
                    variant="ghost"
                    className="flex items-center gap-2 px-2 text-sm"
                  >
                    {branchesError ? "Error loading branches" : activeBranch}
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {userbranches?.data?.map((branch) => (
                    <DropdownMenuCheckboxItem
                      key={branch.id}
                      checked={activeBranchId === branch.id}
                      onCheckedChange={() => dispatch(changeBranch(branch.id))}
                    >
                      {branch?.branch_name || branch?.town + " Branch"}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <NotiicationsPopover
              notifs={notifs}
              notifsError={notifserror}
              notifsLoading={notifsloading}
            >
              <Button variant="outline" size="icon" className="relative">
                <Bell className="w-4 h-4 text-muted-foreground" />
                <span className=" absolute w-5 h-5 opacity-90 -translate-y-[35%] grid place-items-center text-xs rounded-full bg-primary top-[1px] -right-2 dark:text-black text-white">
                  {notifs?.data?.length || null}
                </span>
              </Button>
            </NotiicationsPopover>
            <ThemeToggler />
          </div>
        </header>
        {user?.account_type === "Laboratory" ? (
          <header className="flex justify-end items-center sm:pl-14 mx-4 py-2 max-sm:hidden mb-4">
            <div className="flex justify-around items-center gap-6">
              {/* maybe later or never */}
              {/* <div className="relative ">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  id="search"
                  placeholder={`Search Laboratories ...`}
                  className="w-full h-10 rounded-lg bg-background md:w-[200px] lg:w-[336px] pl-10 max-w-[350px]"
                />
              </div> */}
              {location.pathname.includes("overview") && (
                <DatePickerWithRange />
              )}

              <div>
                {userbranches?.data?.length === 0 ? (
                  user?.is_admin && <AddBranch />
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        disabled={branchesLoading || branchesError}
                        variant="ghost"
                        className="flex items-center justify-between gap-2 px-2 text-sm max-sm:w-full"
                      >
                        {branchesError
                          ? "Error loading branches"
                          : activeBranch}
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {userbranches?.data?.map((branch) => (
                        <DropdownMenuCheckboxItem
                          key={branch.id}
                          checked={activeBranchId === branch.id}
                          onCheckedChange={() =>
                            dispatch(changeBranch(branch.id))
                          }
                        >
                          {branch?.branch_name || branch?.town + " Branch"}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
              <NotiicationsPopover
                notifs={notifs}
                notifsError={notifserror}
                notifsLoading={notifsloading}
              >
                <Button variant="outline" size="icon" className="relative">
                  <Bell className="w-4 h-4 text-muted-foreground" />
                  <span className=" absolute w-5 h-5 opacity-90 -translate-y-[35%] grid place-items-center text-xs rounded-full bg-primary top-[1px] -right-2 dark:text-black text-white">
                    {notifs?.data?.filter((item) => item.is_read === false)
                      .length || null}
                  </span>
                </Button>
              </NotiicationsPopover>
            </div>
          </header>
        ) : (
          <header className="flex justify-end items-center sm:pl-14 mx-4 py-2 max-sm:hidden ">
            <div className="flex justify-around items-center gap-4">
              <NotiicationsPopover
                notifs={notifs}
                notifsError={notifserror}
                notifsLoading={notifsloading}
              >
                <Button variant="outline" size="icon" className="relative">
                  <Bell className="w-4 h-4 text-muted-foreground" />
                  <span className=" absolute w-5 h-5 opacity-90 -translate-y-[35%] grid place-items-center text-xs rounded-full bg-primary top-[1px] -right-2 dark:text-black text-white">
                    {notifs?.data?.filter((item) => item.is_read === false)
                      .length || null}
                  </span>
                </Button>
              </NotiicationsPopover>
            </div>
          </header>
        )}
        <Outlet />
      </div>
    </div>
  );
}
