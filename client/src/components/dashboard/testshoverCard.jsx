import React from "react";

const TestsHoverCard = ({ hoveredcard }) => {
  return (
    <div className="flex flex-col gap-2 whitespace-normal max-w-md">
      <h6 className="text-sm uppercase">{hoveredcard?.name}</h6>
      <p className="text-xs uppercase">
        <span className="capitalize mr-2">Price:</span>
        GH{`\u20B5`}
        {hoveredcard?.price}
      </p>
      <p className="text-xs uppercase">
        <span className="capitalize mr-2">Discount:</span>
        GH{`\u20B5`}
        {hoveredcard?.discount_price || "0"}
      </p>
      <p className="text-xs uppercase">
        <span className="capitalize mr-2">Payable Amount:</span>
        GH{`\u20B5`}
        {hoveredcard?.price - hoveredcard?.discount_price}
      </p>
      <p className="text-xs uppercase">
        <span className="capitalize mr-2">Turn around time :</span>
        {hoveredcard?.turn_around_time}
      </p>
      <p className="text-xs uppercase border-b-[1px] pb-2">
        <span className="capitalize mr-2">Patient Preparation:</span>
        {hoveredcard?.patient_preparation}
      </p>
      <h5 className="font-medium text-sm ">Sample Requirements</h5>
      <div className="py-3">
        {hoveredcard?.sample_type?.map((sample, index) => (
          <div key={index} className="space-y-2 border-b-[1px] pb-2">
            <p className="text-xs uppercase">
              <span className="capitalize mr-2">Sample Type:</span>
              {sample.sample_name}
            </p>
            <p className="text-xs uppercase">
              <span className="capitalize mr-2">Sample Volume:</span>
              {sample.collection_time}
            </p>
            <p className="text-xs uppercase">
              <span className="capitalize mr-2">Sample Container:</span>
              {sample.collection_procedure}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestsHoverCard;
