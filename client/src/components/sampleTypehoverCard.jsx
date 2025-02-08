import React from "react";

const SampleTypehoverCard = ({ hoveredcard }) => {
  return (
    <div className="flex flex-col gap-3 max-w-[20rem]">
      <h6 className="text-sm uppercase">{hoveredcard?.sample_name}</h6>
      <p className="text-xs uppercase">
        <span className="capitalize mr-2">Collection Procedure:</span>
        {hoveredcard?.collection_procedure} 
      </p>
      <p className="text-xs uppercase">
        <span className="capitalize mr-2">Collection time:</span>
        {hoveredcard?.collection_time}
      </p>
    </div>
  );
};

export default SampleTypehoverCard;
