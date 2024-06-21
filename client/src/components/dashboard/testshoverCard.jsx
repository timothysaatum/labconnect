import React from "react";

const TestsHoverCard = ({ hoveredcard }) => {
  return (
    <div className="flex flex-col gap-2 whitespace-normal">
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
        {hoveredcard?.patient_preparation}
      </p>
      <p className="text-xs uppercase">
        <span className="capitalize mr-2">Accepted sample types:</span>
        worrking on it
      </p>
    </div>
  );
};

export default TestsHoverCard;
