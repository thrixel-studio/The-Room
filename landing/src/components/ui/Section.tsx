import { ReactNode } from "react";
import clsx from "clsx";
import { Container } from "./Container";

interface SectionProps {
  children: ReactNode;
  className?: string;
  containerSize?: "sm" | "md" | "lg" | "xl" | "full";
  padding?: "sm" | "md" | "lg" | "xl";
  id?: string;
  background?: "default" | "secondary" | "tertiary" | "gradient";
}

export function Section({
  children,
  className,
  containerSize = "lg",
  padding = "lg",
  id,
  background = "default",
}: SectionProps) {
  const paddings = {
    sm: "py-12 sm:py-16",
    md: "py-16 sm:py-20",
    lg: "py-20 sm:py-28",
    xl: "py-28 sm:py-36",
  };

  const backgrounds = {
    default: "",
    secondary: "bg-[var(--app-bg-secondary-color)]",
    tertiary: "bg-[var(--app-bg-tertiary-color)]",
    gradient:
      "bg-gradient-to-b from-[var(--app-bg-primary-color)] via-[var(--app-bg-secondary-color)] to-[var(--app-bg-primary-color)]",
  };

  return (
    <section
      id={id}
      className={clsx(paddings[padding], backgrounds[background], className)}
    >
      <Container size={containerSize}>{children}</Container>
    </section>
  );
}

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  badge,
  align = "center",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={clsx(
        "mb-12 sm:mb-16",
        align === "center" && "text-center",
        className
      )}
    >
      {badge && (
        <span className="inline-block mb-4 px-4 py-2 rounded-full text-sm font-medium bg-violet-600/15 text-violet-400">
          {badge}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-[var(--app-text-primary-color)]">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg sm:text-xl text-[var(--app-text-secondary-color)] max-w-3xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
