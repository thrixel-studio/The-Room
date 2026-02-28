import React, { useEffect, useRef } from "react";

interface TextareaProps {
  placeholder?: string; // Placeholder text
  rows?: number; // Number of rows
  value?: string; // Current value
  onChange?: (value: string) => void; // Change handler
  className?: string; // Additional CSS classes
  disabled?: boolean; // Disabled state
  error?: boolean; // Error state
  hint?: string; // Hint text to display
  autoResize?: boolean; // Auto-resize to fit content
  maxHeight?: number; // Maximum height in pixels
}

const TextArea: React.FC<TextareaProps> = ({
  placeholder = "Enter your message", // Default placeholder
  rows = 3, // Default number of rows
  value = "", // Default value
  onChange, // Callback for changes
  className = "", // Additional custom styles
  disabled = false, // Disabled state
  error = false, // Error state
  hint = "", // Default hint text
  autoResize = false, // Auto-resize feature
  maxHeight, // Maximum height
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  useEffect(() => {
    if (autoResize && textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = 'auto';
      const newHeight = textarea.scrollHeight;
      textarea.style.height = maxHeight && newHeight > maxHeight ? `${maxHeight}px` : `${newHeight}px`;
    }
  }, [value, autoResize, maxHeight]);

  let textareaClasses = `w-full rounded-lg resize-none px-2.5 py-2.5 text-sm shadow-theme-xs focus:outline-hidden placeholder:text-[var(--app-text-tertiary-color)]`;

  if (disabled) {
    textareaClasses += ` !bg-[var(--app-bg-primary-color)] opacity-60 cursor-not-allowed`;
  } else if (error) {
    textareaClasses += ` bg-transparent text-[var(--app-text-primary-color)] border border-[var(--app-border-primary-color)] focus:border-red-500 focus:ring-3 focus:ring-red-600/10`;
  } else {
    textareaClasses += ` bg-transparent text-[var(--app-text-primary-color)] border border-[var(--app-border-primary-color)] focus:border-[var(--app-accent-color)] focus:shadow-[0_0_0_3px_var(--app-accent-color-transparent)]`;
  }

  textareaClasses += ` ${className}`;

  const textareaStyles: React.CSSProperties = {
    ...(autoResize ? { overflow: maxHeight ? 'auto' : 'hidden' } : {}),
    ...(disabled ? { border: 'none' } : {}),
  };

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        placeholder={placeholder}
        rows={autoResize ? undefined : rows}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={textareaClasses}
        style={textareaStyles}
      />
      {hint && (
        <p
          className={`mt-2 text-sm ${
            error ? "text-red-500" : "text-slate-400"
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
};

export default TextArea;
