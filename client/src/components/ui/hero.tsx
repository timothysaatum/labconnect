import Link from "next/link";
import { Spotlight } from "./ui/spotlight";
import { TextGenerateEffect } from "./ui/text-generate";
import MagicButton from "./ui/magicButton";
import { FaLocationArrow } from "react-icons/fa";

const Hero = () => {
  return (
    <div className="pb-20 pt-36">
      <div>
        <Spotlight
          className="-top-40 -left-10 md:-top-20 md:-left-32 h-screen"
          fill="white"
        />
        <Spotlight
          className="top-10 left-full  h-[80vh] w-[50vw]"
          fill="purple"
        />
        <Spotlight className="top-28 left-80  h-[80dvh] w-[50vw]" fill="blue" />
      </div>
      <div className="h-screen w-full dark:bg-black-100 bg-white dark:bg-grid-white/[0.03] bg-grid-black/[0.2] flex items-center justify-center absolute left-0 top-0">
        {/* Radial gradient for the container to give a faded look */}
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black-100 bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      </div>
      <div className="flex justify-center relative">
        <div className="max-w-[89vh] md:max-w-2xl lg:max-w-[60vw] flex flex-col items-center justify-center py-20">
          <TextGenerateEffect
            time={1}
            words=" Dynamic web magic with next.js"
            className="uppercase tracking-widest text-xs text-center text-blue-100 max-w-80"
          />

          <TextGenerateEffect
            time={2}
            words="Transforming Concepts Into Seamless User Experiences"
            className="text-center text-[40px] md:text-5xl lg:text-6xl "
            color={true}
          />
          <p className="text-center md:tracking-wider mb-4 text-sm md:text-lg lg:text-2xl">
            Hi, I&apos;m Conficius, a full stack developer based in Ghana
          </p>

          <Link href="#about">
            <MagicButton
              title="show my work"
              icon={<FaLocationArrow />}
              position="right"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
