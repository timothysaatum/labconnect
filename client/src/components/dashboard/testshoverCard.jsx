import React from "react";

const TestsHoverCard = ({ hoveredcard }) => {
  return (
    <div className="flex flex-col gap-2 whitespace-normal max-w-md">
      <h6 className="text-sm uppercase">{hoveredcard?.name}</h6>
      <p className="text-xs uppercase">
        <span className="capitalize mr-2">Price (GHS):</span>
        {hoveredcard?.price}
      </p>
      <p className="text-xs uppercase">
        <span className="capitalize mr-2">Discount:</span>
        {hoveredcard?.discount || "0"}
      </p>
      <p className="text-xs uppercase">
        <span className="capitalize mr-2">Patient Preparation:</span>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nemo sunt quia
        placeat non recusandae fugiat provident cumque, nobis blanditiis neque
        reprehenderit id accusantium explicabo dolorem sit odit asperiores,
        impedit quidem mollitia vitae magni quam rerum at? Suscipit quaerat
        dolorem tempora, officia numquam aperiam! Hic a atque, excepturi aliquam
        iste rem!
      </p>
      <p className="text-xs uppercase">
        <span className="capitalize mr-2">Accepted sample types:</span>
        worrking on it
      </p>
    </div>
  );
};

export default TestsHoverCard;
