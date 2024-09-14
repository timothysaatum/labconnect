import { useState } from "react";
import Introcard from "./introcard";
import CreateLabTwo from "./createLabTwo";

const cardData = [
  {
    title: "Connect Nationwide",
    description:
      "Link with laboratories and hospitals across the country for seamless collaboration.",
    icon: (
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
          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
        />
      </svg>
    ),
  },
  {
    title: "Centralized Management",
    description: "Manage multiple branches from a single, intuitive dashboard.",
    icon: (
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
          d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
        />
      </svg>
    ),
  },
  {
    title: "Advanced Analytics",
    description:
      "Gain deep insights into your laboratory's performance with our analytics tools.",
    icon: (
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
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
  },
];
export default function CreateLaboratory() {
  const [step, setStep] = useState(1);

  const LabStep = () => {
    switch (step) {
      case 1:
        return <Introcard setStep={setStep} />;
      case 2:
        return <CreateLabTwo setStep={setStep} />;
      default:
        return <Introcard setStep={setStep} />;
    }
  };

  return (
    <section className="antialiased">
      <div className="max-w-2xl mx-auto py-16 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-3xl font-extrabold sm:text-4xl">
          Create Your Laboratory
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Join the network of laboratories in LabConnect and unlock a world of
          possibilities.
        </p>
        <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:gap-x-12">
          <div className="space-y-6">
            {cardData.map((card, index) => (
              <div className="flex" key={index}>
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-sm bg-teal-500 text-background">
                    {card.icon}
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium ">{card.title}</h3>
                  <p className="mt-2 text-muted-foreground text-sm">
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-lg shadow-lg dark:shadow-slate-900 overflow-hidden min-h-[80dvh]">
            <div className="px-6 py-8 sm:p-10 sm:pb-6">
              <div className="flex items-center justify-center ">
                <h3 className="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-teal-100 text-teal-600">
                  Get Started
                </h3>
              </div>
              <div className="mt-4 flex items-baseline justify-center">
                <span className="text-5xl font-extrabold">Free</span>
                <span className="ml-1 text-xl font-semibold">/month</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground text-center">
                Start connecting with our network of laboratories today.
              </p>
            </div>
            {LabStep()}
          </div>
        </div>
      </div>
    </section>
  );
}
