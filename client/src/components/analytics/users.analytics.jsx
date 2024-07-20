import {ChevronRight } from "lucide-react";
import LabsVHospitals from "./labsVsHospitals";

const UsersAnalytics = () => {

  return (
    <div className="grid gap-5 pt-10 md:grid-cols-2">
      <LabsVHospitals />
      <div className="flex justify-end">
        <blockquote className="h-fit max-w-sm rounded-md border-b-2 p-5 text-sm leading-6 tracking-wider text-secondary-foreground">
          <ul className="text-xs">
            <li className="flex gap-2">
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              Highest Performing month:"June"
            </li>
          </ul>
        </blockquote>
      </div>
    </div>
  );
};

export default UsersAnalytics;
