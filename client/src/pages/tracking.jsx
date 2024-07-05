import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const Tracking = () => {
  return (
    <div className="">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <Link>
            <ChevronLeft />
          </Link>
          <CardTitle>Tracking Sample #8240820820838</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
};

export default Tracking;
