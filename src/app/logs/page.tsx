"use client";

import { useState, useEffect } from "react";
import { useApi } from "../utils/generictypeapi";
import LogTable from "./components/logTable";
import LogFilters from "./components/logFilters";
import LogDetailsModal from "./components/logDetailsModal";
import { FiArrowDown, FiArrowUp } from "react-icons/fi";

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

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface LogSearchDto {

  level?: string;
  message?: string;
  pageIndex: number;
  pageSize: number;
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
    to: " ",
    level: "",
    message: "",
  });

  // ---------------- Fetch Logs ----------------
  const fetchLogs = async () => {
    try {
      setLoading(true);

      // Send body as LogSearchDto
      const body: LogSearchDto = {
        pageIndex,
        pageSize,
   
        level: filters.level || "",
        message: filters.message || "",
      };

      const res = await api.post<ApiResponse<{ totalCount: number; items: LogModel[] }>>(
        "/log/search2",
        body
      );

      if (res.data.success && res.data.data) {
        setLogs(res.data.data.items);
        setTotalCount(res.data.data.totalCount);
      } else {
        console.error("Error fetching logs:", res.data.message);
      }
    } catch (err: any) {
      console.error("Error fetching logs:", err.message || err);
    } finally {
      setLoading(false);
    }
  };

  // Refetch when pageIndex or pageSize changes
  useEffect(() => {
    fetchLogs();
  }, [pageIndex, pageSize]);

  // ---------------- Actions ----------------
  const deleteSelected = async () => {
    if (!selectedIds.length) return alert("No logs selected");
    if (!confirm(`Delete ${selectedIds.length} selected logs?`)) return;

    try {
      const res = await api.post<ApiResponse<string>>("/log/delete-selected", selectedIds);
      if (res.data.success) alert(res.data.message);
      fetchLogs();
      setSelectedIds([]);
    } catch (err: any) {
      console.error(err);
    }
  };

  const deleteAll = async () => {
    if (!confirm("Delete all logs?")) return;
    try {
      const res = await api.delete<ApiResponse<string>>("/log/clear");
      if (res.data.success) alert(res.data.message);
      fetchLogs();
      setSelectedIds([]);
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleSearch = () => {
    setPageIndex(3);
    fetchLogs();
  };

  const handleReset = () => {
    setFilters({ from: "", to: "", level: "", message: "" });
    setPageIndex(3);
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
