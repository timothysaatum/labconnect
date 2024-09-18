import { CheckCircle2, Truck, Package, Microscope } from "lucide-react";

const defaultSteps = [
  {
    id: 1,
    title: "Request Confirmed",
    icon: <Package className="md:w-6 md:h-6 w-4 h-4" />,
    date: "14/09/24, 10:42am",
  },
  {
    id: 2,
    title: "With Delivery",
    icon: <Truck className="md:w-6 md:h-6 w-4 h-4" />,
    date: "14/09/24, 10:42am",
  },
  {
    id: 3,
    title: "Accepted By Laboratory",
    icon: <Microscope className="md:w-6 md:h-6 w-4 h-4" />,
    date: "14/09/24, 10:42am",
  },
  {
    id: 4,
    title: "Request Completed",
    icon: <CheckCircle2 className="md:w-6 md:h-6 w-4 h-4" />,
    date: "14/09/24, 10:42am",
  },
];

function Step({ step, isActive, isCompleted, length, index, currentStep }) {
  return (
    <div className="flex items-center">
      <div className="flex flex-col items-center">
        <div
          className={`flex items-center justify-center md:w-12 md:h-12 w-8 h-8 rounded-full border-2 ${
            isCompleted
              ? "bg-green-500 border-green-500"
              : isActive
                ? "border-blue-500"
                : "border-gray-300"
          }`}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-6 h-6 text-white" />
          ) : (
            <div
              className={`${isActive ? "text-blue-500" : "text-muted-foreground"}`}
            >
              {step.icon}
            </div>
          )}
        </div>

        <p className="font-medium flex flex-col gap-1 items-center mt-2 text-sm text-center">
          <span>{step.title}</span>{" "}
          <span className="text-xs text-muted-foreground font-normal">
            {step.date}
          </span>
        </p>
      </div>
    </div>
  );
}

export default function DeliveryStepper({ steps = defaultSteps, currentStep }) {
  return (
    <div className="w-full max-w-5xl px-4 mx-auto mt-10">
      {/* Wrapper for icons and connecting lines */}
      <div className="flex justify-between items-start mb-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center w-full">
            <Step
              step={step}
              isActive={currentStep === step.id}
              isCompleted={currentStep > step.id}
              index={index}
              length={steps.length}
              currentStep={currentStep}
            />
            {/* Conditionally render the line between icons */}
            {index < steps.length - 1 && (
              <div
                className={`hidden md:block flex-1 h-[2px] mx-1 -mt-10 min-w-20 transition-colors duration-300 ${
                  currentStep > step.id
                    ? "bg-green-500"
                    : currentStep === step.id
                      ? "bg-gradient-to-r from-blue-600 to-muted-foreground from_5%"
                      : "bg-muted-foreground"
                }`}
              />
            )}{" "}
          </div>
        ))}
      </div>

      {/* Wrapper for titles */}
      {/* <div className="flex justify-between items-center -ml-6">
        {steps.map((step) => (
          <div key={step.id} className="w-full ">
            <p
              className={`mt-2 text-sm font-medium ${
                currentStep === step.id
                  ? "text-blue-500"
                  : currentStep > step.id
                    ? "text-green-500"
                    : "text-gray-500"
              }`}
            >
              {step.title}
            </p>
          </div>
        ))}
      </div> */}
    </div>
  );
}

// import { Button } from "../ui/button";
// import { ComputerIcon } from "lucide-react";

// const Stepper = () => {
//   return (
//     <div className="px-4">
//       <div className="flex items-center my-2 antialiased">
//         <span className="mx-2 text-muted-foreground text-sm">
//           <Button className="rounded-full" size={"icon"}>
//             <ComputerIcon />
//           </Button>
//         </span>
//         <div className="flex-grow border-t border-muted"></div>
//         <span className="mx-2 text-muted-foreground text-sm">
//           <Button className="rounded-full" size={"icon"}>
//             d
//           </Button>
//         </span>
//         <div className="flex-grow border-t border-muted"></div>
//         <span className="mx-2 text-muted-foreground text-sm">
//           <Button className="rounded-full" size={"icon"}>
//             d
//           </Button>
//         </span>
//         <div className="flex-grow border-t border-muted"></div>
//         <Button className="rounded-full" size={"icon"}>
//           d
//         </Button>
//       </div>
//       <div className="flex mt-3 gap-5 text-sm justify-between">
//         <p className="font-semibold flex flex-col gap-2 items-center">
//           <span>Request Confirmed</span>
//           <span className="text-xs text-muted-foreground font-normal">
//             14/09/24, 10:42am
//           </span>
//         </p>
//         <p className="font-semibold flex flex-col gap-2 items-center">
//           <span> Sample Received By Delivery</span>
//           <span className="text-xs text-muted-foreground font-normal">
//             14/09/24, 10:42am
//           </span>
//         </p>
//         <p className="font-semibold flex flex-col gap-2 items-center">
//           <span>Sample Accepted By Laboratory</span>
//           <span className="text-xs text-muted-foreground font-normal">
//             14/09/24, 10:42am
//           </span>
//         </p>
//         <p className="font-semibold flex flex-col gap-2 items-center">
//           <span>Request Completed</span>
//           <span className="text-xs text-muted-foreground font-normal">
//             14/09/24, 10:42am
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Stepper;
