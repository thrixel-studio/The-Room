import { ReactNode } from "react";
import clsx from "clsx";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

export function Container({
  children,
  className,
  size = "lg",
}: ContainerProps) {
  const sizes = {
    sm: "max-w-3xl",
    md: "max-w-5xl",
    lg: "max-w-7xl",
    xl: "max-w-[1400px]",
    full: "max-w-full",
  };

  return (
    <div
      className={clsx(
        "mx-auto w-full px-6 sm:px-10 lg:px-16",
        sizes[size],
        className
      )}
    >
      {children}
    </div>
  );
}
