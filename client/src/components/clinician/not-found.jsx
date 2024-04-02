import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <h1 className="text-5xl animate-pulse drop-shadow-lg font-mono">404</h1>
      <h3 className="border-b-teal-800">Page not Found</h3>
      <Link
        to={"/dashboard?tab=profile"}
        className="font-medium text-green-500 text-xs mt-10 italic hover:underline hover:scale-x-125 hover:text-blue-500 transition-all "
      >
        Go to profile
      </Link>
    </div>
  );
}
