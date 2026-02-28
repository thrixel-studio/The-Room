import React, { useState, useEffect } from "react";
import { Modal } from "./index";
import Button from "@/shared/ui/button/Button";
import { Check, X } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message?: string;
  children?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: "error" | "primary";
  isLoading?: boolean;
  enableTypingEffect?: boolean;
  typingSpeed?: number;
}

const useTypingEffect = (text: string, speed: number = 30, enabled: boolean = true) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setDisplayedText(text);
      setIsTypingComplete(true);
      return;
    }

    setDisplayedText("");
    setIsTypingComplete(false);
    let currentIndex = 0;

    const intervalId = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTypingComplete(true);
        clearInterval(intervalId);
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed, enabled]);

  return { displayedText, isTypingComplete };
};

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  children,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "primary",
  isLoading = false,
  enableTypingEffect = false,
  typingSpeed = 30,
}) => {
  const { displayedText, isTypingComplete } = useTypingEffect(
    message || "",
    typingSpeed,
    enableTypingEffect
  );

  const handleConfirm = () => {
    onConfirm();
    // onClose will be called after the action completes
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-md p-6"
      showCloseButton={false}
    >
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">
          {title}
        </h3>
        {children ? (
          <div className="min-h-[3rem]">{children}</div>
        ) : (
          <p className="text-gray-400 min-h-[3rem]">
            {enableTypingEffect ? displayedText : message}
            {enableTypingEffect && !isTypingComplete && (
              <span className="inline-block w-0.5 h-4 ml-1 bg-gray-400 animate-pulse" />
            )}
          </p>
        )}
        <div className="flex gap-3 justify-end pt-4">
          <Button
            onClick={onClose}
            variant="primary"
            icon={<X className="w-4 h-4" />}
            disabled={isLoading}
            className="px-3 py-1.5 !bg-transparent !text-[var(--app-text-tertiary-color)] border !border-[var(--app-text-tertiary-color)] hover:!bg-[var(--app-text-tertiary-color)] hover:!text-white"
          >
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            variant={confirmColor}
            icon={<Check className="w-4 h-4" />}
            disabled={isLoading}
            className="px-3 py-1.5 !bg-transparent !text-[var(--app-danger-color)] border !border-[var(--app-danger-color)] hover:!bg-[var(--app-danger-color)] hover:!text-white"
          >
            {isLoading ? "Deleting..." : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
