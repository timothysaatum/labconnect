import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="h-dvh grid place-items-center">
      <Loader2 className="mr-2 h-10 w-10 animate-spin" />
    </div>
  );
};

export default Loading;
