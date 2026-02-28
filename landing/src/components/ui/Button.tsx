"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "xl";
  children: ReactNode;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  children,
  icon,
  iconPosition = "left",
  fullWidth = false,
  className,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return "border border-[var(--app-accent-color)] bg-transparent text-[var(--app-accent-color)] hover:bg-[var(--app-accent-color)] hover:text-white disabled:hover:bg-transparent disabled:hover:text-[var(--app-accent-color)]";
      case "secondary":
        return "border border-[var(--app-text-tertiary-color)] bg-transparent text-[var(--app-text-tertiary-color)] hover:bg-[var(--app-text-tertiary-color)] hover:text-white disabled:opacity-50";
      case "accent":
        return "bg-[var(--app-accent-color)] text-[var(--app-text-primary-color)] hover:brightness-90 disabled:opacity-50";
      case "outline":
        return "border border-[var(--app-accent-color)] bg-transparent text-[var(--app-accent-color)] hover:bg-[var(--app-accent-color)] hover:text-white disabled:opacity-50";
      case "ghost":
        return "bg-transparent text-[var(--app-text-secondary-color)] hover:text-[var(--app-text-primary-color)] hover:bg-[var(--app-light-color-transparent)] disabled:opacity-50";
      default:
        return "bg-slate-700 text-slate-300 hover:bg-slate-700/90";
    }
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl",
  };

  return (
    <button
      className={clsx(
        baseStyles,
        getVariantStyles(),
        sizes[size],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {icon && iconPosition === "left" && icon}
      {children}
      {icon && iconPosition === "right" && icon}
    </button>
  );
}
