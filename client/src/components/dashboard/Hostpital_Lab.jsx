import React from "react";
import { Link } from "react-router-dom";

const HostpitalLab = () => {
  return (
    <div className="pl-14">
      <div className="max-w-5xl mx-auto">
        <div>
          <h1>Add A Hospital Laboratory</h1>
          <p>
            As a hospital you can add hospital hospital laboratory to receive
            clinical sample from external sources for testing.
            <Link className="text-blue-600 underline">
              Terms and conditions
            </Link>{" "}
            apply
          </p>
        </div>
      </div>
    </div>
  );
};

export default HostpitalLab;
