import { Button } from "../ui/button";
import { ComputerIcon } from "lucide-react";

const Stepper = () => {
  return (
    <div className="px-4">
      <div className="flex items-center my-2 antialiased">
        <span className="mx-2 text-muted-foreground text-sm">
          <Button className="rounded-full" size={"icon"}>
            <ComputerIcon />
          </Button>
        </span>
        <div className="flex-grow border-t border-muted"></div>
        <span className="mx-2 text-muted-foreground text-sm">
          <Button className="rounded-full" size={"icon"}>
            d
          </Button>
        </span>
        <div className="flex-grow border-t border-muted"></div>
        <span className="mx-2 text-muted-foreground text-sm">
          <Button className="rounded-full" size={"icon"}>
            d
          </Button>
        </span>
        <div className="flex-grow border-t border-muted"></div>
        <Button className="rounded-full" size={"icon"}>
          d
        </Button>
      </div>
      <div className="flex mt-3 gap-5 text-sm justify-between">
        <p className="font-semibold flex flex-col gap-2 items-center">
          <span>Request Confirmed</span>
          <span className="text-xs text-muted-foreground font-normal">
            14/09/24, 10:42am
          </span>
        </p>
        <p className="font-semibold flex flex-col gap-2 items-center">
          <span> Sample Received By Delivery</span>
          <span className="text-xs text-muted-foreground font-normal">
            14/09/24, 10:42am
          </span>
        </p>
        <p className="font-semibold flex flex-col gap-2 items-center">
          <span>Sample Accepted By Laboratory</span>
          <span className="text-xs text-muted-foreground font-normal">
            14/09/24, 10:42am
          </span>
        </p>
        <p className="font-semibold flex flex-col gap-2 items-center">
          <span>Request Completed</span>
          <span className="text-xs text-muted-foreground font-normal">
            14/09/24, 10:42am
          </span>
        </p>
      </div>
    </div>
  );
};

export default Stepper;
