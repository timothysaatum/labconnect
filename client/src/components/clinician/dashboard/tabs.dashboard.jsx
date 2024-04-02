import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function DashboardTabs() {
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
    <ul className="grid grid-flow-col text-xs mb-4 sm:text-md font-semibold text-center mt-4 bg-gray-100 dark:bg-gray-700  self-center whitespace-nowrap gap-2 overflow-x-auto">
      <Link to={"/dashboard?tab=profile"}>
        <li
          className={`p-2 sm:p-4 hover:bg-gray-200 dark:hover:bg-gray-800 ${
            tab === "profile" &&
            "dark:bg-gray-800 bg-gray-200 border-b-4 border-lime-400"
          }`}
        >
          Profile
        </li>
      </Link>
      <Link to={"/dashboard?tab=requests"}>
        <li
          className={`p-2 sm:p-4 hover:bg-gray-200 dark:hover:bg-gray-800 ${
            tab === "requests" &&
            "dark:bg-gray-800 bg-gray-200 border-b-4 border-lime-400"
          }`}
        >
          Requests
        </li>
      </Link>
      <Link to={"/dashboard?tab=make-request"}>
        <li
          className={`p-2 sm:p-4 hover:bg-gray-200 dark:hover:bg-gray-800 ${
            tab === "make-request" &&
            "dark:bg-gray-800 bg-gray-200 border-b-4 border-lime-400"
          }`}
        >
          Make Request
        </li>
      </Link>
      <Link to={"/dashboard?tab=tracking"}>
        <li
          className={`p-2 sm:p-4 hover:bg-gray-200 dark:hover:bg-gray-800 ${
            tab === "tracking" &&
            "dark:bg-gray-800 bg-gray-200 border-b-4 border-lime-400"
          }`}
        >
          Tracking
        </li>
      </Link>
    </ul>
  );
}
