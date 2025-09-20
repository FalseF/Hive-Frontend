// components/GlobalConfirmModal.tsx
import React from "react";

interface GlobalConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function GlobalConfirmModal({
  isOpen,
  title = "Confirm Action",
  message = "Are you sure?",
  loading = false,
  onConfirm,
  onCancel,
}: GlobalConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 max-w-full relative">
        {/* Top-right close icon */}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-lg"
          onClick={onCancel}
          disabled={loading}
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <p className="mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 flex items-center gap-2"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading && <span className="loader-border h-4 w-4"></span>}
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
