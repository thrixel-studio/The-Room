import { ReactNode } from "react";
import clsx from "clsx";

type BadgeVariant = "light" | "solid";
type BadgeSize = "sm" | "md";
type BadgeColor =
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "light"
  | "dark";

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  color?: BadgeColor;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Badge({
  variant = "light",
  color = "primary",
  size = "md",
  icon,
  children,
  className,
}: BadgeProps) {
  const baseStyles =
    "inline-flex items-center px-2.5 py-0.5 justify-center gap-1.5 rounded-full font-medium";

  const sizeStyles = {
    sm: "text-xs",
    md: "text-sm",
  };

  const variants = {
    light: {
      primary: "bg-violet-600/15 text-violet-400",
      secondary: "bg-amber-500/15 text-amber-400",
      success: "bg-green-600/15 text-green-500",
      error: "bg-red-600/15 text-red-500",
      warning: "bg-amber-500/15 text-amber-400",
      info: "bg-blue-500/15 text-blue-500",
      light: "bg-white/5 text-white/80",
      dark: "bg-white/5 text-white",
    },
    solid: {
      primary: "bg-violet-600 text-white",
      secondary: "bg-amber-500 text-white",
      success: "bg-green-600 text-white",
      error: "bg-red-600 text-white",
      warning: "bg-amber-500 text-white",
      info: "bg-blue-500 text-white",
      light: "bg-white/5 text-white/80",
      dark: "bg-slate-700 text-white",
    },
  };

  const sizeClass = sizeStyles[size];
  const colorStyles = variants[variant][color];

  return (
    <span className={clsx(baseStyles, sizeClass, colorStyles, className)}>
      {icon && <span className="flex items-center">{icon}</span>}
      {children}
    </span>
  );
}
