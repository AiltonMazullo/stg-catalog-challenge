import React from "react";
import {
  CardProps,
  CardHeaderProps,
  CardBodyProps,
  CardFooterProps,
} from "@/types";
import { useTheme } from "@/context/ThemeContext";

export function Card({ children, className = "" }: CardProps) {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`${
        isDarkMode ? "bg-gray-800" : "bg-white"
      } rounded-lg shadow-md overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}

Card.Header = function CardHeader({
  children,
  className = "",
}: CardHeaderProps) {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`px-6 py-4 border-b ${
        isDarkMode ? "border-gray-700" : "border-gray-200"
      } ${className}`}
    >
      {children}
    </div>
  );
};

Card.Body = function CardBody({ children, className = "" }: CardBodyProps) {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>;
};

Card.Footer = function CardFooter({
  children,
  className = "",
}: CardFooterProps) {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`px-6 py-4 border-t ${
        isDarkMode ? "border-gray-700" : "border-gray-200"
      } ${className}`}
    >
      {children}
    </div>
  );
};
