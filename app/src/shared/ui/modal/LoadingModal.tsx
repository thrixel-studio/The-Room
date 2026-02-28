"use client";
import React from "react";
import { Modal } from "./index";
import { Sparkles } from "lucide-react";
import Button from "../button/Button";

interface LoadingModalProps {
  isOpen: boolean;
  message?: string;
  onCancel?: () => void;
}

export const LoadingModal: React.FC<LoadingModalProps> = ({
  isOpen,
  message = "Processing your entry...",
  onCancel,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}} // Prevent closing
      showCloseButton={false}
      className="max-w-md p-8"
    >
      <div className="flex flex-col items-center justify-center space-y-6">
        <Sparkles 
          className="w-16 h-16 animate-pulse" 
          style={{ color: '#3B82F6' }}
        />
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 text-white/90 mb-2">
            Analyzing writing...
          </h3>
          <p className="text-sm text-gray-500 text-gray-400 mb-4">
            This may take up to 1 minute
          </p>
          {onCancel && (
            <Button
              variant="outline"
              onClick={onCancel}
              className="!p-2 !bg-transparent"
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
