import { Link, useLocation } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useEffect, useState } from "react";
import SettingProfile from "./Profile";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { ChevronDown } from "lucide-react";

const Sidebar = ({ tab }) => {
  return (
    <aside className="settings hidden w-36 md:w-60 font-medium sm:flex flex-col">
      <nav className="flex flex-col gap-4">
        <Link
          to="?tab=profile"
          className={`${
            tab === "profile" ? "active" : ""
          } flex flex-col py-2 px-6 rounded-md hover:underline underline-offset-4`}
        >
          Profile
        </Link>
        <Link
          to="?tab=account"
          className={`${
            tab === "account" ? "active" : ""
          } flex flex-col py-2 px-6 rounded-md hover:underline underline-offset-4`}
        >
          Account
        </Link>
        <Link
          to="?tab=preferences"
          className={`${
            tab === "preferences" ? "active" : ""
          } flex flex-col py-2 px-6 rounded-md hover:underline underline-offset-4`}
        >
          Preferences
        </Link>
        <Link
          to="?tab=security"
          className={`${
            tab === "security" ? "active" : ""
          } flex flex-col py-2 px-6 rounded-md hover:underline underline-offset-4`}
        >
          Security
        </Link>
        <Link
          to="?tab=notifications"
          className={`${
            tab === "notifications" ? "active" : ""
          } flex flex-col py-2 px-6 rounded-md hover:underline underline-offset-4`}
        >
          Notifications
        </Link>
      </nav>
    </aside>
  );
};

const DashboardSettings = () => {
  const [tab, setTab] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const settingTab = () => {
    switch (tab) {
      case "profile":
        return <SettingProfile />;
      //   case "account":
      //     return <Account />;
      //   case "preferences":
      //     return <Preferences />;
      //   case "security":
      //     return <Security />;
      //   case "notifications":
      //     return <Notifications />;
      default:
        return <SettingProfile />;
    }
  };
  return (
    <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
      <Card className="mx-10 relative">
        <div className="mt-4 flex justify-end mr-8 sm:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="min-w-24">
                {tab === null ? "Profile" : tab} {" "}
                <ChevronDown    className="ml-2"/>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem>
                    <Link to="?tab=profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Link to="?tab=account">Account</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Link to="?tab=preferences">Preferences</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Link to="?tab=security">Security</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Link to="?tab=notifications">Notifications</Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardHeader>
          <div>
            <CardTitle>Settings</CardTitle>
            <CardDescription className="border-b pb-5">
              Manage your Laboratory settings and preferences here
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex">
          <Sidebar tab={tab} />
          <main className="px-10 flex-1 max-w-4xl">{settingTab()}</main>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSettings;
