"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode");
    const prefersDark = savedTheme === "true";
    setIsDarkMode(prefersDark);
    setIsInitialized(true);

    applyTheme(prefersDark);
  }, []);

  const applyTheme = (darkMode: boolean) => {
    const html = document.documentElement;
    const body = document.body;

    if (darkMode) {
      html.classList.add("dark");
      body.classList.add("dark");
      body.style.backgroundColor = "#111827";
      body.style.color = "#f9fafb";
    } else {
      html.classList.remove("dark");
      body.classList.remove("dark");
      body.style.backgroundColor = "#ffffff";
      body.style.color = "#111827";
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);

    localStorage.setItem("darkMode", newDarkMode.toString());

    applyTheme(newDarkMode);
  };

  if (!isInitialized) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
