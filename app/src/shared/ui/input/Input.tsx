import React, { FC } from "react";

interface InputProps {
  type?: "text" | "number" | "email" | "password" | "date" | "time" | string;
  id?: string;
  name?: string;
  placeholder?: string;
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  min?: string;
  max?: string;
  minLength?: number;
  maxLength?: number;
  step?: number;
  disabled?: boolean;
  required?: boolean;
  success?: boolean;
  error?: boolean;
  hint?: string;
}

const Input: FC<InputProps> = ({
  type = "text",
  id,
  name,
  placeholder,
  value,
  defaultValue,
  onChange,
  className = "",
  min,
  max,
  minLength,
  maxLength,
  step,
  disabled = false,
  required = false,
  success = false,
  error = false,
  hint,
}) => {
  const inputClasses = `h-11 w-full rounded-lg border ${disabled ? "!border-[rgba(0,0,0,0)]" : "border-[var(--app-border-primary-color)]"} appearance-none px-2.5 py-2.5 text-sm transition-all bg-transparent text-[var(--app-text-primary-color)] placeholder:text-[var(--app-text-tertiary-color)] focus:outline-none focus:border-[var(--app-accent-color)] focus:shadow-[0_0_0_3px_var(--app-accent-color-transparent)] ${disabled ? "!bg-[var(--app-bg-primary-color)] cursor-not-allowed opacity-60" : ""} ${className}`.trim();
  
  const hintClasses = `mt-1.5 text-xs text-[var(--app-text-tertiary-color)]`;

  return (
    <div className="relative">
      <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        min={min}
        max={max}
        minLength={minLength}
        maxLength={maxLength}
        step={step}
        disabled={disabled}
        required={required}
        className={inputClasses}
      />

      {hint && <p className={hintClasses}>{hint}</p>}
    </div>
  );
};

export default Input;
