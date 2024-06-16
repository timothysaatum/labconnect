import React from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import SampleTypehoverCard from "./sampleTypehoverCard";

const HoverCardDetails = ({ children, option, items, title }) => {
  const hoveredcard = items.find((item) => item.id === option);

  const CardType = () => {
    switch (title) {
      case "sample":
        return <SampleTypehoverCard hoveredcard={hoveredcard} />;
      default:
        return null;
    }
  };
  return (
    <HoverCard>
      <HoverCardTrigger>{children}</HoverCardTrigger>
      <HoverCardContent >{CardType()}</HoverCardContent>
    </HoverCard>
  );
};

export default HoverCardDetails;
