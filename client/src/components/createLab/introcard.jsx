import { Button } from "../ui/button";

const Introcard = ({ setStep }) => {
  return (
    <>
      
      <div className="px-6 pt-6 pb-8 sm:px-10 sm:py-10">
        <ul className="space-y-4">
          <li className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="ml-3 text-base">Unlimited laboratory connections</p>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="ml-3 text-base ">Basic analytics dashboard</p>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="ml-3 text-base ">24/7 support</p>
          </li>
        </ul>
        <div className="mt-8">
          <div className="rounded-lg shadow-md">
            <Button
              className="w-full bg-teal-500 hover:bg-teal-600"
              onClick={() => setStep(2)}
            >
              Create Laboratory
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Introcard;
