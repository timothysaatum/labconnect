// themeProvider.d.ts

declare module "@/components/themeProvider" {
  import { ReactNode } from "react";

  interface ThemeProviderProps {
    children: ReactNode;
    defaultTheme?: "light" | "dark" | "system";
    storageKey?: string;
  }

  interface ThemeContext {
    theme: "light" | "dark" | "system";
    setTheme: (theme: "light" | "dark" | "system") => void;
  }

  export function ThemeProvider(props: ThemeProviderProps): JSX.Element;
  export function useTheme(): ThemeContext;
}
