import { useQuery } from "@tanstack/react-query";
import axios from "axios";
export default function Home() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["deliveries"],
    queryFn: () => fetch("/api/deliveries").then((res) => res.json()),
  });

  return <div>
    {isLoading && <div>Loading...</div>}
    {isError && <div>Error</div>}
    {data && <div>{JSON.stringify(data)}</div>}
  </div>
}
