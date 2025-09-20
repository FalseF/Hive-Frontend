// context/ConfirmModalContext.tsx
"use client"
import React, { createContext, useState, useContext, ReactNode } from "react";
import GlobalConfirmModal from "@/app/components/GlobalConfirmModal";

interface ConfirmModalOptions {
  title?: string;
  message?: string;
  onConfirm: () => Promise<void> | void; // supports async operations
}

interface ConfirmModalContextType {
  showConfirm: (options: ConfirmModalOptions) => void;
}

const ConfirmModalContext = createContext<ConfirmModalContextType | undefined>(undefined);

export const useConfirmModal = () => {
  const context = useContext(ConfirmModalContext);
  if (!context) throw new Error("useConfirmModal must be used within ConfirmModalProvider");
  return context;
};

export const ConfirmModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmModalOptions>({
    title: "",
    message: "",
    onConfirm: () => {},
  });
  const [loading, setLoading] = useState(false);

  const showConfirm = (opts: ConfirmModalOptions) => {
    setOptions(opts);
    setIsOpen(true);
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await options.onConfirm(); // async-safe
      setIsOpen(false);
    } catch (err) {
      console.error("Confirm action failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (loading) return; // prevent cancel during loading
    setIsOpen(false);
  };

  return (
    <ConfirmModalContext.Provider value={{ showConfirm }}>
      {children}
      <GlobalConfirmModal
        isOpen={isOpen}
        title={options.title}
        message={options.message}
        loading={loading}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </ConfirmModalContext.Provider>
  );
};
