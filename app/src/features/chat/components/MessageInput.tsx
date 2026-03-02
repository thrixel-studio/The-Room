import React from "react";
import Button from "@/shared/ui/button/Button";
import { CornerDownLeft } from "lucide-react";

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
  showActions?: boolean;
  actions?: React.ReactNode;
  textareaRef?: React.RefObject<HTMLTextAreaElement | null>;
}

export default function MessageInput({
  value,
  onChange,
  onSend,
  onKeyDown,
  placeholder = "Type your thoughts here...",
  disabled = false,
  isLoading = false,
  showActions = true,
  actions,
  textareaRef,
}: MessageInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);

    // Auto-resize textarea
    if (e.target) {
      e.target.style.height = 'auto';
      e.target.style.height = e.target.scrollHeight + 'px';
    }
  };

  // Reset textarea height when value is cleared (after sending)
  React.useEffect(() => {
    if (value === '' && textareaRef?.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [value, textareaRef]);

  return (
    <>
      <div className="relative mx-4">
        <textarea
          ref={textareaRef}
          placeholder={placeholder}
          rows={4}
          value={value}
          onChange={handleChange}
          onKeyDown={onKeyDown}
          disabled={disabled}
          className="w-full resize-none bg-[var(--app-bg-tertiary-color)] text-sm placeholder:text-[--app-text-tertiary-color] placeholder:font-normal focus:outline-none text-white/90  leading-relaxed overflow-y-auto p-3 rounded-2xl"
          style={{
            minHeight: '96px',
            maxHeight: '300px',
            boxShadow: 'inset 0 0 1.5px 1px rgb(0 0 0 / 0.1)'
          }}
        />
        {showActions && (
          <button
            disabled={!value.trim() || disabled || isLoading}
            onClick={onSend}
            className="absolute bottom-3 right-1.5 p-2 rounded-xl bg-[var(--app-accent-color)] text-white hover:brightness-90 disabled:opacity-50 disabled:hover:brightness-100 transition-all disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3" />
                <path d="M8 2a6 6 0 0 1 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <CornerDownLeft className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
      {showActions && (
        <>
          <p className="text-xs text-[var(--app-text-tertiary-color)] text-center mb-1.5">
            Press <span style={{ color: 'var(--app-accent-secondary-color-transparent)' }}>Enter</span> to send, <span style={{ color: 'var(--app-accent-secondary-color-transparent)' }}>Shift + Enter</span> for new line
          </p>
          {actions && <div className="mt-2 mr-2 flex items-center justify-end gap-2">{actions}</div>}
        </>
      )}
    </>
  );
}
