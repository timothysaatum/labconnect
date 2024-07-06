import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Search } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const Tracking = () => {
  return (
    <div className="my-5 sm:pl-14 mx-2">
      <Card className="max-w-5xl mx-auto">
        <CardHeader>
          <div className="flex items-center">
            <div className="flex gap-4 flex-grow">
              <Link>
                <Button className="w-7 h-7" variant="outline" size="icon">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </Link>
              <CardTitle className="text-lg">
                Tracking Sample #8240820820838
              </CardTitle>
            </div>
            <div className=" relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                id="search"
                placeholder={"search by request id"}
                className="w-full h-10 rounded-lg bg-background md:w-[200px] lg:w-[336px] pl-10 max-w-[350px]"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          
        </CardContent>
      </Card>
    </div>
  );
};

export default Tracking;
