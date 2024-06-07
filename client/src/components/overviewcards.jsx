import { stackedCards } from "@/data/stackedcards";
import { CardStack } from "./ui/card-stack";

const StackedCardsOverview = () => {
  return <CardStack scaleFactor={0.02} items={stackedCards} offset={6} />;
};

export default StackedCardsOverview;
