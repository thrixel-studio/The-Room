"use client";
import React, { useEffect, useState } from "react";
import { CircleCheck, Info, CircleAlert, OctagonX } from "lucide-react";

export interface ToastProps {
  id: string;
  variant: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  onClose: (id: string) => void;
  duration?: number; // Duration in ms for auto-dismiss (0 = no auto-dismiss)
  showSpinner?: boolean; // Show loading spinner instead of icon
}

const Toast: React.FC<ToastProps> = ({
  id,
  variant,
  title,
  message,
  onClose,
  duration = 0,
  showSpinner = false,
}) => {
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (duration > 0) {
      // Auto-dismiss timer
      const dismissTimer = setTimeout(() => {
        handleClose();
      }, duration);

      // Progress bar animation
      const startTime = Date.now();
      const progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
        setProgress(remaining);
      }, 16); // ~60fps

      return () => {
        clearTimeout(dismissTimer);
        clearInterval(progressInterval);
      };
    }
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    // Wait for animation to complete before removing
    setTimeout(() => {
      onClose(id);
    }, 300);
  };

  // Tailwind classes for each variant
  const variantClasses = {
    success: {
      container: "bg-white",
      icon: "text-green-600",
      progress: "bg-green-600",
    },
    error: {
      container: "bg-white",
      icon: "text-red-600",
      progress: "bg-red-600",
    },
    warning: {
      container: "bg-white",
      icon: "text-amber-500",
      progress: "bg-amber-500",
    },
    info: {
      container: "bg-white",
      icon: "text-violet-600",
      progress: "bg-violet-600",
    },
  };

  // Spinner component
  const spinner = (
    <svg
      className="animate-spin"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 9.27455 20.9097 6.80375 19.1414 5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );

  // Icon for each variant using Lucide icons
  const icons = {
    success: <CircleCheck size={24} />,
    error: <OctagonX size={24} />,
    warning: <CircleAlert size={24} />,
    info: <Info size={24} />,
  };

  return (
    <div
      className={`
        relative overflow-hidden rounded-xl px-4 py-3.5 shadow-sm w-fit max-w-md
        transition-all duration-300 ease-in-out
        ${variantClasses[variant].container}
        ${
          isExiting
            ? "translate-x-[120%] opacity-0"
            : "translate-x-0 opacity-100"
        }
      `}
    >
      <div className="flex items-center gap-3">
        <div className={`flex-shrink-0 p-2 rounded-lg bg-violet-50 ${variantClasses[variant].icon}`}>
          {showSpinner ? spinner : icons[variant]}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-base font-normal text-black text-black">
            {title}
          </h4>

          {message && (
            <p className="text-base font-normal text-black text-black break-words mt-1">
              {message}
            </p>
          )}
        </div>

        {/* Close button - hidden for warnings with spinner, always visible for errors, visible on hover for success */}
        {!showSpinner && (
          <button
            onClick={handleClose}
            className={`
              flex-shrink-0 -mt-0.5 -mr-1 p-1 rounded-lg
              text-gray-400 hover:text-gray-600
              hover:bg-gray-200/50
              transition-colors duration-200
              ${variant === "success" ? "opacity-0 group-hover:opacity-100" : ""}
            `}
            aria-label="Close notification"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Progress bar for auto-dismiss toasts OR static bar for spinners */}
      {(duration > 0 || showSpinner) && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200/50">
          <div
            className={`h-full ${duration > 0 ? 'transition-all duration-100 ease-linear' : ''} ${variantClasses[variant].progress}`}
            style={{ width: duration > 0 ? `${progress}%` : '100%' }}
          />
        </div>
      )}
    </div>
  );
};

export default Toast;
