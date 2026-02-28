"use client";
import React from "react";
import Toast, { ToastProps } from "./Toast";

interface ToastContainerProps {
  toasts: Omit<ToastProps, "onClose">[];
  onClose: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  // Notifications are disabled but context and logic remain for future use
  return null;
};

export default ToastContainer;
