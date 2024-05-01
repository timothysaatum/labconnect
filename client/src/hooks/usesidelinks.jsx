import { Home, LineChart, Truck, TestTubes, Microscope } from "lucide-react";

export const useGetSideLinks = (account_type) => {
  const commonLinks = [
    {
      icon: <Home className="h-5 w-5" />,
      link: "/dashboard",
      name: "Overview",
    },
    {
      icon: <Truck className="h-5 w-5" />,
      link: "tracking",
      name: "Tracking",
    },
    {
      icon: <LineChart className="h-5 w-5" />,
      link: "/analytics",
      name: "analytics",
    },
    {
      icon: <TestTubes className="h-5 w-5" />,
      link: "/requests",
      name: "Samples",
    },
  ];

  if (account_type === "Laboratory") {
      return [
        ...commonLinks.slice(0, 1), // get the first two elements of commonLinks
        {
          icon: <Microscope className="h-5 w-5" />,
          link: "my-laboratory",
          name: "My Laboratory",
        },
        ...commonLinks.slice(1), // get the rest of the elements of commonLinks
      ];
  }

  // handle case where account type is neither 'type1' nor 'type2'
  return commonLinks;
};
