"use client";
import React from "react";
import { Modal } from "./index";
import Image from "next/image";
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
        <Image
          src="/images/logo/logo1.png"
          alt="Loading"
          width={64}
          height={64}
          className="animate-pulse drop-shadow-xl rounded-lg"
          priority
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
