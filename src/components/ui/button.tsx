import React from "react";
import { ButtonProps } from "@/types";
import { Loader2 } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  fullWidth = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const { isDarkMode } = useTheme();

  const baseStyles =
    "inline-flex items-center justify-center rounded-md font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 cursor-pointer hover:scale-105 active:scale-95";

  const variantStyles = {
    primary: "bg-green-500 text-white hover:bg-green-600",
    secondary: isDarkMode
      ? "bg-gray-700 text-white hover:bg-gray-600"
      : "bg-gray-200 text-gray-900 hover:bg-gray-300",
    outline: isDarkMode
      ? "border border-gray-600 bg-transparent text-white hover:bg-gray-700"
      : "border border-gray-300 bg-transparent hover:bg-gray-100",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const widthStyles = fullWidth ? "w-full" : "";
  const disabledStyles =
    disabled || isLoading ? "opacity-70 cursor-not-allowed" : "";

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${disabledStyles} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
          Carregando...
        </>
      ) : (
        children
      )}
    </button>
  );
}
