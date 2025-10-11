import React from "react";
import { LogModel } from "../page";

interface Props {
  logs: LogModel[];
  loading: boolean;
  selectedIds: number[];
  setSelectedIds: (ids: number[]) => void;
  onView: (log: LogModel) => void;
}

const LogTable: React.FC<Props> = ({
  logs,
  loading,
  selectedIds,
  setSelectedIds,
  onView,
}) => {
  // Toggle single row selection
  const toggleSelect = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((x) => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Toggle all rows
  const toggleAll = () => {
    if (selectedIds.length === logs.length) setSelectedIds([]);
    else setSelectedIds(logs.map((l) => l.id));
  };

  if (loading)
    return <div className="text-center py-4 text-gray-500">Loading logs...</div>;

  return (
    <div className="overflow-auto border rounded">
      <table className="min-w-full text-sm border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border text-center">
              <input
                type="checkbox"
                checked={selectedIds.length === logs.length && logs.length > 0}
                onChange={toggleAll}
              />
            </th>
            <th className="p-2 border">Level</th>
            <th className="p-2 border">Message</th>
            <th className="p-2 border">User</th>
            <th className="p-2 border">IP</th>
            <th className="p-2 border">Date</th>
            <th className="p-2 border text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {logs.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center p-4">
                No logs found
              </td>
            </tr>
          ) : (
            logs.map((log) => (
              <tr
                key={log.id}
                className={`border-b hover:bg-gray-50 ${
                  selectedIds.includes(log.id) ? "bg-blue-50" : ""
                }`}
              >
                <td className="p-2 border text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(log.id)}
                    onChange={() => toggleSelect(log.id)}
                  />
                </td>
                <td className="p-2 border font-medium">{log.logLevel}</td>
                <td className="p-2 border truncate max-w-xs">
                  {log.shortMessage}
                </td>
                <td className="p-2 border">{log.userEmail || "-"}</td>
                <td className="p-2 border">{log.ipAddress || "-"}</td>
                <td className="p-2 border">
                  {new Date(log.createdOnUtc).toLocaleString()}
                </td>
                <td className="p-2 border text-center">
                  <button
                    onClick={() => onView(log)}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LogTable;
