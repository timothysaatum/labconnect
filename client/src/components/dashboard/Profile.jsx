import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import UserProfile from "./user-profile";
import LaboratoryProfile from "./laboratory-profile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

const Sidebar = ({ tab }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname.endsWith("profile")) {
      return;
    }
    navigate("profile", { replace: true });
  }, [navigate]);
  return (
    <aside className="settings hidden w-36 lg:w-48 font-medium lg:flex flex-col text-sm">
      <nav className="flex flex-col gap-4">
        <Link
          to="?tab=user-profile"
          className={`${
            tab === null || tab === "user-profile"
              ? "bg-muted-foreground/5"
              : ""
          } flex flex-col py-2 px-6 rounded-md hover:underline underline-offset-4`}
        >
          User profile
        </Link>
        <Link
          to="?tab=laboratory-profile"
          className={`${
            tab === "laboratory-profile" ? "bg-muted-foreground/5" : ""
          } flex flex-col py-2 px-6 rounded-md hover:underline underline-offset-4`}
        >
          Laboratory profile
        </Link>
      </nav>
    </aside>
  );
};

const SettingProfile = () => {
  const [tab, setTab] = useState(null);
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("user-profile");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  useEffect(() => {
    if (tab) {
      setActiveTab(tab);
    }
  }, [location.search, location.pathname, tab]);
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
    },
  });
  const settingTab = () => {
    switch (tab) {
      case "user-profile":
        return <UserProfile form={form} />;
      case "laboratory-profile":
        return <LaboratoryProfile form={form} />;
      //   case "preferences":
      //     return <Preferences />;
      //   case "security":
      //     return <Security />;
      //   case "notifications":
      //     return <Notifications />;
      default:
        return <UserProfile form={form} />;
    }
  };
  return (
    <div>
      <div className="lg:flex gap-4 hidden">
        {settingTab()}
        <Sidebar tab={tab} />
      </div>
      <div className="lg:hidden">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-around">
            <TabsTrigger value="user-profile">
              <Link to={"?tab=user-profile"}>User Profile</Link>
            </TabsTrigger>
            <TabsTrigger value="laboratory-profile">
              <Link to={"?tab=laboratory-profile"}>Laboratory Profile</Link>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="user-profile">
            <UserProfile />
          </TabsContent>
          <TabsContent value="laboratory-profile">
            <LaboratoryProfile form={form} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SettingProfile;
