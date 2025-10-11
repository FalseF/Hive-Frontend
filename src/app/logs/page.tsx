"use client";

import { useState, useEffect } from "react";
import { useApi } from "../utils/generictypeapi";
import LogTable from "./components/logTable";
import LogFilters from "./components/logFilters";
import LogDetailsModal from "./components/logDetailsModal";
import { FiArrowDown, FiArrowUp } from "react-icons/fi";
import axios from "axios";

export interface LogModel {
  id: number;
  logLevel: string;
  shortMessage: string;
  fullMessage?: string;
  userEmail?: string;
  ipAddress?: string;
  pageUrl?: string;
  referrerUrl?: string;
  createdOnUtc: string;
}

// ---------------- Page Component ----------------
export default function LogsPage() {
  const api = useApi();

  // State
  const [logs, setLogs] = useState<LogModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectedLog, setSelectedLog] = useState<LogModel | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  // Pagination
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  // Filters
  const [filters, setFilters] = useState({
    from: "",
    to: "",
    level: "",
    message: "",
  });

  // ---------------- Fetch Logs ----------------
  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params: Record<string, any> = {
        pageIndex,
        pageSize,
      };
      if (filters.message) params.message = filters.message;
      if (filters.level) params.level = filters.level;
      if (filters.from) params.from = filters.from;
      if (filters.to) params.to = filters.to;

      const res = await axios.get<{
        totalCount: number;
        items: LogModel[];
      }>("https://localhost:7287/api/log/search", { params });

      console.log(res);
      console.log(res.data);

    //  console.log(res);
        setLogs(res.data.items);
        console.log(res.data.items);
        setTotalCount(res.data.totalCount);

      if (res?.data) {
       
      }
    } catch (err: any) {
      console.error("Error fetching logs:", err.message || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [pageIndex, pageSize]);

  // ---------------- Actions ----------------
  const deleteSelected = async () => {
    if (!selectedIds.length) return alert("No logs selected");
    if (!confirm(`Delete ${selectedIds.length} selected logs?`)) return;

    try {
      await api.delete("/log/delete-selected", { data: { ids: selectedIds } });
      fetchLogs();
      setSelectedIds([]);
    } catch (err: any) {
      console.error(err);
    }
  };

  const deleteAll = async () => {
    if (!confirm("Delete all logs?")) return;
    try {
      await api.delete("/log/delete-all");
      fetchLogs();
      setSelectedIds([]);
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleSearch = () => {
    setPageIndex(0);
    fetchLogs();
  };

  const handleReset = () => {
    setFilters({ from: "", to: "", level: "", message: "" });
    setPageIndex(0);
    fetchLogs();
  };

  return (
    <div className="p-6 space-y-3">
      {/* Top Bar */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">System Logs</h1>
        <div className="flex gap-2">
          <button
            onClick={deleteSelected}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Delete Selected
          </button>
          <button
            onClick={deleteAll}
            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Search Toggle Row */}
      <div
        className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded cursor-pointer"
        onClick={() => setShowSearch(!showSearch)}
      >
        <span className="font-medium">Search</span>
        {showSearch ? (
          <FiArrowUp className="w-5 h-5 text-gray-600" />
        ) : (
          <FiArrowDown className="w-5 h-5 text-gray-600" />
        )}
      </div>

      {/* Collapsible Search Panel */}
      {showSearch && (
        <LogFilters
          filters={filters}
          setFilters={setFilters}
          onSearch={handleSearch}
          onReset={handleReset}
        />
      )}

      {/* Log Table */}
      <LogTable
        logs={logs}
        loading={loading}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        onView={setSelectedLog}
      />

      {/* Pagination + Footer */}
      <div className="flex justify-between items-center mt-3">
        {/* Left: Prev/Next, items per page, record count */}
        <div className="flex items-center gap-3">
          <button
            disabled={pageIndex === 0}
            onClick={() => setPageIndex(pageIndex - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <button
            disabled={(pageIndex + 1) * pageSize >= totalCount}
            onClick={() => setPageIndex(pageIndex + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
          <span>
            Show:
            <select
              value={pageSize}
              onChange={(e) => setPageSize(parseInt(e.target.value))}
              className="ml-1 border px-1 rounded"
            >
              {[20, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </span>
          <span>
            Showing {logs.length > 0 ? pageIndex * pageSize + 1 : 0}-
            {Math.min((pageIndex + 1) * pageSize, totalCount)} of {totalCount} records
          </span>
        </div>

        {/* Right: Loading spinner */}
        {loading && (
          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-600"></div>
        )}
      </div>

      {/* Log Details Modal */}
      {selectedLog && (
        <LogDetailsModal log={selectedLog} onClose={() => setSelectedLog(null)} />
      )}
    </div>
  );
}
