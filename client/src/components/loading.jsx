import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const Loading = ({className}) => {
  return (
    <div
      className={cn("h-dvh grid place-items-center", className)}
    >
      <Loader2 className="mr-2 h-10 w-10 animate-spin" />
    </div>
  );
};

export default Loading;
