import { Link, Outlet, useLocation } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { PanelTopOpen } from "lucide-react";

const SideBarSheet = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="md:hidden">
          <PanelTopOpen className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="top">
        <nav>
          <SidebarSheetLinks />
        </nav>
      </SheetContent>
    </Sheet>
  );
};
const SidebarSheetLinks = () => {
  return (
    <aside className="settings font-medium md:flex flex-col">
      <nav className="flex flex-col gap-4">
        <Link
          to="profile"
          className={`${
            location.pathname.endsWith("settings") ||
            location.pathname.includes("profile")
              ? "active"
              : ""
          } flex flex-col py-2 px-6 rounded-md hover:underline underline-offset-4`}
        >
          Profile
        </Link>
        <Link
          to="account"
          className={`${
            location.pathname.includes("account") ? "active" : ""
          } flex flex-col py-2 px-6 rounded-md hover:underline underline-offset-4`}
        >
          Account
        </Link>
        <Link
          to="preferences"
          className={`${
            location.pathname.includes("preferences") ? "active" : ""
          } flex flex-col py-2 px-6 rounded-md hover:underline underline-offset-4`}
        >
          Preferences
        </Link>
        <Link
          to="security"
          className={`${
            location.pathname.includes("security") ? "active" : ""
          } flex flex-col py-2 px-6 rounded-md hover:underline underline-offset-4`}
        >
          Security
        </Link>
        <Link
          to="notifications"
          className={`${
            location.pathname.includes("notifications") ? "active" : ""
          } flex flex-col py-2 px-6 rounded-md hover:underline underline-offset-4`}
        >
          Notifications
        </Link>
      </nav>
    </aside>
  );
};
const Sidebar = () => {
  return (
    <aside className="settings hidden w-36 lg:w-60 font-medium md:flex flex-col">
      <nav className="flex flex-col gap-4">
        <Link
          to="profile"
          className={`${
            location.pathname.endsWith("settings") ||
            location.pathname.includes("profile")
              ? "active"
              : ""
          } flex flex-col py-2 px-6 rounded-md hover:underline underline-offset-4`}
        >
          Profile
        </Link>
        <Link
          to="account"
          className={`${
            location.pathname.includes("account") ? "active" : ""
          } flex flex-col py-2 px-6 rounded-md hover:underline underline-offset-4`}
        >
          Account
        </Link>
        <Link
          to="preferences"
          className={`${
            location.pathname.includes("preferences") ? "active" : ""
          } flex flex-col py-2 px-6 rounded-md hover:underline underline-offset-4`}
        >
          Preferences
        </Link>
        <Link
          to="security"
          className={`${
            location.pathname.includes("security") ? "active" : ""
          } flex flex-col py-2 px-6 rounded-md hover:underline underline-offset-4`}
        >
          Security
        </Link>
        <Link
          to="notifications"
          className={`${
            location.pathname.includes("notifications") ? "active" : ""
          } flex flex-col py-2 px-6 rounded-md hover:underline underline-offset-4`}
        >
          Notifications
        </Link>
      </nav>
    </aside>
  );
};

const DashboardSettings = () => {
  const location = useLocation();
  const [tab, setTab] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <div className="flex flex-col sm:gap-4 sm:pl-14 max-sm:py-4">
      <Card className="mx-4 sm:mx-8 relative">
        <CardHeader className="flex flex-row justify-between">
          <div>
            <CardTitle>Settings</CardTitle>
            <CardDescription>
              Manage your Laboratory settings and preferences here
            </CardDescription>
          </div>
          <SideBarSheet />
        </CardHeader>
        <CardContent className="flex">
          <Sidebar />
          <main className="md:pl-10 flex-1 max-w-4xl">
            <Outlet />
          </main>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSettings;
