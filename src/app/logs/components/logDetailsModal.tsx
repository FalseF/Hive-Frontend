import React from "react";
import { LogModel } from "../page";

interface Props {
  log: LogModel;
  onClose: () => void;
}

const LogDetailsModal: React.FC<Props> = ({ log, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-1/2">
        <h2 className="text-xl font-semibold mb-4">Log Details</h2>

        <div className="space-y-2 text-sm">
          <p>
            <strong>Level:</strong> {log.logLevel}
          </p>
          <p>
            <strong>User:</strong> {log.userEmail || "System"}
          </p>
          <p>
            <strong>IP:</strong> {log.ipAddress || "-"}
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {new Date(log.createdOnUtc).toLocaleString()}
          </p>
          <p>
            <strong>Message:</strong>
          </p>
          <pre className="bg-gray-100 p-2 rounded whitespace-pre-wrap">
            {log.fullMessage || log.shortMessage}
          </pre>
          {log.pageUrl && (
            <p>
              <strong>Page URL:</strong> {log.pageUrl}
            </p>
          )}
          {log.referrerUrl && (
            <p>
              <strong>Referrer URL:</strong> {log.referrerUrl}
            </p>
          )}
        </div>

        <div className="mt-4 text-right">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogDetailsModal;
