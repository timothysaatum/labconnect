"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

let interval;

export const CardStack = ({ items, offset, scaleFactor, selected }) => {
  const [hovered, setHovered] = useState(false);
  const CARD_OFFSET = hovered ? 15 : offset || 0;
  const SCALE_FACTOR = scaleFactor || 0.00;
  const [cards, setCards] = useState(items);

  useEffect(() => {
    startFlipping();

    return () => clearInterval(interval);
  }, []);
  const startFlipping = () => {
    interval = setInterval(() => {
      setCards((prevCards) => {
        const newArray = [...prevCards]; // create a copy of the array
        newArray.unshift(newArray.pop()); // move the last element to the front
        return newArray;
      });
    }, 10000);
  };
  const handleClick = (cardId) => {
    const card = cards.find((item) => {
      return item.id === cardId;
    });
    setCards((prevCards) => {
      const newArray = [...prevCards];
      const deletedcard = newArray.filter((item) => {
        return item.id !== cardId;
      });
      const cardTop = [card, ...deletedcard];
      return cardTop;
    });
  };
  return (
    <div
      className={`relative full min-h-8 my-4 w-full ${selected ? "col-span-4" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
      }}
    >
      {cards.map((card, index) => {
        return (
          <motion.div
            key={card.id}
            className="absolute bg-card w-full rounded-lg shadow-sm hover:cursor-pointer"
            style={{
              transformOrigin: "top center",
            }}
            animate={{
              top: index * -CARD_OFFSET,
              scale: 1 - index * SCALE_FACTOR, // decrease scale for cards that are behind
              zIndex: cards.length - index, //  decrease z-index for the cards that are behind
            }}
            onClick={() => handleClick(card.id)}
          >
            <div className="font-normal text-neutral-700 dark:text-neutral-200">
              {card.content}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
