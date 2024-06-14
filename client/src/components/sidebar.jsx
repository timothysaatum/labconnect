import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useGetMainSideLinks, useGetSideLinks } from "@/hooks/usesidelinks";
import { LogOutIcon, Menu, Package2, PanelLeft } from "lucide-react";
import { NavLink } from "react-router-dom";

export function Sidebar() {
  const mainSideLinks = useGetMainSideLinks();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
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

          <NavLink
            to="settings"
            className="flex pb-5 items-end flex-1 gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <div className="flex items-center gap-2">
              <LogOutIcon className="h-5 w-5" />
              Logout
            </div>
          </NavLink>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
