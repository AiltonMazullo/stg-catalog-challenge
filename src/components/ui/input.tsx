import React from "react";
import { InputProps } from "@/types";
import { useTheme } from "@/context/ThemeContext";

export function Input({ label, error, className, ...props }: InputProps) {
  const { isDarkMode } = useTheme();

  return (
    <div className="w-full space-y-2">
      {label && (
        <label
          className={`block text-sm font-medium ${
            isDarkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          {label}
        </label>
      )}
      <input
        className={`w-full px-3 py-2 border ${
          isDarkMode
            ? "border-gray-600 bg-gray-700 text-white placeholder:text-gray-400"
            : "border-gray-300 bg-white text-gray-800 placeholder:text-gray-500"
        } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${className}`}
        {...props}
      />
      {error && (
        <p
          className={`text-sm ${isDarkMode ? "text-red-400" : "text-red-600"}`}
        >
          {error}
        </p>
      )}
    </div>
  );
}
