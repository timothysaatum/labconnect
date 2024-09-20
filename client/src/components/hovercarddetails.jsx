import React from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import SampleTypehoverCard from "./sampleTypehoverCard";
import TestsHoverCard from "./dashboard/testshoverCard";

const HoverCardDetails = ({ children, option, items, title }) => {
  let hoveredcard;
  if (title === "tests") {
    hoveredcard = items?.results?.find((item) => item.id === option);
  } else {
    hoveredcard = items?.find((item) => item.id === option);
  }

  const CardType = () => {
    switch (title) {
      case "sample":
        return <SampleTypehoverCard hoveredcard={hoveredcard} />;
      case "tests":
        return <TestsHoverCard hoveredcard={hoveredcard} />;
      default:
        return null;
    }
  };
  return (
    <HoverCard>
      <HoverCardTrigger>{children}</HoverCardTrigger>
      <HoverCardContent className="min-w-[30rem]">
        {CardType()}
      </HoverCardContent>
    </HoverCard>
  );
};

export default HoverCardDetails;
