import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
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
import { useGetSettingsSideLinks } from "@/hooks/usesidelinks";

const SideBarSheet = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="md:hidden">
          <PanelTopOpen className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="top" className="pr-14">
        <nav>
          <SidebarSheetLinks />
        </nav>
      </SheetContent>
    </Sheet>
  );
};
const SidebarSheetLinks = () => {
  const sideLinks = useGetSettingsSideLinks();
  return (
    <aside className="settings font-medium md:flex flex-col">
      <nav className="flex flex-col gap-4">
        {sideLinks.map((item) => (
          <Link
            key={item.link}
            to={item.link}
            className={`${
              (item.link === "profile" &&
                location.pathname.endsWith("settings")) ||
              location.pathname.includes(item.link)
                ? "bg-muted-foreground/10"
                : ""
            } flex flex-col py-2 px-6 rounded-md hover:underline underline-offset-4`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
};
const Sidebar = () => {
  const sideLinks = useGetSettingsSideLinks();
  const location = useLocation();
  return (
    <aside className="settings hidden w-36 lg:w-60 font-medium md:flex flex-col">
      <nav className="flex flex-col gap-4">
        {sideLinks.map((item) => (
          <Link
            key={item.link}
            to={item.link}
            className={`${
              (item.link === "profile" &&
                location.pathname.endsWith("settings")) ||
              location.pathname.includes(item.link)
                ? "bg-muted-foreground/10"
                : ""
            } flex flex-col py-2 px-6 rounded-md hover:underline underline-offset-4`}
          >
            {item.name}
          </Link>
        ))}
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
