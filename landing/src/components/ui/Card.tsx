import { ReactNode } from "react";
import clsx from "clsx";

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "glass" | "bordered" | "gradient";
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

export function Card({
  children,
  className,
  variant = "default",
  hover = false,
  padding = "md",
}: CardProps) {
  const baseStyles = "rounded-2xl transition-all duration-300";

  const variants = {
    default: "bg-[var(--app-bg-secondary-color)]",
    glass: "glass border border-[var(--app-border-primary-color)]",
    bordered:
      "bg-[var(--app-bg-secondary-color)] border border-[var(--app-border-primary-color)]",
    gradient:
      "bg-gradient-to-br from-[var(--app-bg-secondary-color)] to-[var(--app-bg-tertiary-color)] border border-[var(--app-border-primary-color)]",
  };

  const paddings = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const hoverStyles = hover
    ? "hover:border-[var(--app-accent-color)] hover:shadow-lg hover:-translate-y-1 cursor-pointer"
    : "";

  return (
    <div
      className={clsx(
        baseStyles,
        variants[variant],
        paddings[padding],
        hoverStyles,
        className
      )}
    >
      {children}
    </div>
  );
}
