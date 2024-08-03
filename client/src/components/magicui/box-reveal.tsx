"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { useTheme } from "@/components/themeProvider";

interface BoxRevealProps {
  children: JSX.Element;
  width?: "fit-content" | "100%";
  duration?: number;
}

export const BoxReveal = ({
  children,
  width = "fit-content",
  duration,
}: BoxRevealProps) => {
  const mainControls = useAnimation();
  const slideControls = useAnimation();

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const { theme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState<
    "light" | "dark" | undefined
  >(undefined);
  useEffect(() => {
    if (theme === "system") {
      setCurrentTheme(
        window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
      );
    } else if (theme === "light" || theme === "dark") {
      setCurrentTheme(theme);
    }
  }, [theme]);

  useEffect(() => {
    if (isInView) {
      slideControls.start("visible");
      mainControls.start("visible");
    } else {
      slideControls.start("hidden");
      mainControls.start("hidden");
    }
  }, [isInView, mainControls, slideControls]);

  return (
    <div ref={ref} style={{ position: "relative", width, overflow: "hidden" }}>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 75 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={mainControls}
        transition={{ duration: duration ? duration : 0.5, delay: 0.25 }}
      >
        {children}
      </motion.div>

      <motion.div
        variants={{
          hidden: { left: 0 },
          visible: { left: "100%" },
        }}
        initial="hidden"
        animate={slideControls}
        transition={{ duration: duration ? duration : 0.5, ease: "easeIn" }}
        style={{
          position: "absolute",
          top: 4,
          bottom: 4,
          left: 0,
          right: 0,
          zIndex: 20,
          background:
            currentTheme === "dark"
              ? "hsla(0 0% 98%)"
              : currentTheme === "light"
                ? "hsla(240 5.9% 10%)"
                : "",
        }}
      />
    </div>
  );
};

export default BoxReveal;
