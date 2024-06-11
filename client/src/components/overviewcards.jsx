import { stackedCards } from "@/data/stackedcards";
import { CardStack } from "./ui/card-stack";

const StackedCardsOverview = ({ selected }) => {
  return (
    <CardStack
      scaleFactor={0.02}
      items={stackedCards}
      offset={6}
      selected={selected}
    />
  );
};

export default StackedCardsOverview;
