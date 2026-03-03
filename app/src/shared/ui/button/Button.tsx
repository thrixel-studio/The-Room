import React, { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode; // Button text or content
  type?: "button" | "submit" | "reset"; // Button type
  variant?: "primary" | "secondary" | "accent" | "error" | "success" | "warning" | "outline"; // Button variant with color
  icon?: ReactNode; // Lucide icon (required for text buttons)
  iconPosition?: "before" | "after"; // Icon position relative to text
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void; // Click handler
  disabled?: boolean; // Disabled state
  className?: string; // Additional classes
}

const Button: React.FC<ButtonProps> = ({
  children,
  type = "button",
  variant = "primary",
  icon,
  iconPosition = "before",
  onClick,
  className = "",
  disabled = false,
}) => {
  const baseClasses = "inline-flex items-center justify-center font-normal gap-2 rounded-lg transition-colors p-3 text-sm";

  const getButtonClasses = () => {
    switch (variant) {
      case "primary":
        return "border border-[var(--app-accent-color)] bg-transparent text-[var(--app-accent-color)] hover:bg-[var(--app-accent-color)] hover:text-white disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-[var(--app-accent-color)]";

      case "secondary":
        return "border border-[var(--app-text-tertiary-color)] bg-transparent text-[var(--app-text-tertiary-color)] hover:bg-[var(--app-text-tertiary-color)] hover:text-white disabled:opacity-50";

      case "accent":
        return "bg-[var(--app-accent-color)] text-[var(--app-text-primary-color)] hover:brightness-90 disabled:opacity-50";

      case "error":
        return "bg-[var(--app-danger-color)] text-white hover:brightness-90 disabled:opacity-50";

      case "success":
        return "bg-green-600 text-white hover:bg-green-700 disabled:bg-green-400";

      case "warning":
        return "bg-amber-500 text-white hover:bg-amber-600 disabled:bg-amber-300";

      case "outline":
        return "border border-slate-600 bg-transparent text-slate-300 hover:bg-slate-800/50 disabled:border-slate-800 disabled:text-slate-600";

      default:
        return "bg-slate-700 text-slate-300 hover:bg-slate-700/90";
    }
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${getButtonClasses()} ${
        disabled ? "cursor-not-allowed" : ""
      } ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && iconPosition === "before" && <span className="flex items-center">{icon}</span>}
      {children}
      {icon && iconPosition === "after" && <span className="flex items-center">{icon}</span>}
    </button>
  );
};

export default Button;
