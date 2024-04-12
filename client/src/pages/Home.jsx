import { toast } from "sonner";
import useRefreshToken from "@/hooks/useRefreshToken";

import { Button } from "@/components/ui/button";

export default function Home() {
  const refresh = useRefreshToken()
  return (
    <Button onClick={()=>refresh()}>
      refresh
    </Button>
  );
}
