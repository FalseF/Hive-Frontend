"use client"
import React, { useState, useMemo, ChangeEvent } from 'react';
import { FiSearch, FiTrash2, FiEye, FiInfo } from 'react-icons/fi';
interface LogItem {
  id: number;
  logLevel: string;
  shortMessage: string;
  fullMessage: string;
  createdOn: string;
}

// Demo log data
const demoLogs : LogItem[] = [
  {
    id: 1,
    logLevel: 'Error',
    shortMessage: 'Error 400. Bad request',
    fullMessage: 'Error 400. Bad request - Invalid parameters provided in the request body',
    createdOn: '11/04/2025 4:48:32 AM'
  },
  {
    id: 2,
    logLevel: 'Information',
    shortMessage: 'Application started',
    fullMessage: 'Application started successfully on port 3000',
    createdOn: '11/04/2025 2:37:42 AM'
  },
  {
    id: 3,
    logLevel: 'Information',
    shortMessage: 'Application started',
    fullMessage: 'Application started successfully on port 3000',
    createdOn: '11/04/2025 2:33:50 AM'
  },
  {
    id: 4,
    logLevel: 'Information',
    shortMessage: 'Application started',
    fullMessage: 'Application started successfully on port 3000',
    createdOn: '11/04/2025 2:32:55 AM'
  },
  {
    id: 5,
    logLevel: 'Warning',
    shortMessage: 'High memory usage detected',
    fullMessage: 'Memory usage exceeded 80% threshold - current usage: 85%',
    createdOn: '11/04/2025 2:30:15 AM'
  },
  {
    id: 6,
    logLevel: 'Error',
    shortMessage: 'Database connection failed',
    fullMessage: 'Failed to connect to database server at localhost:5432 - Connection timeout',
    createdOn: '11/04/2025 2:28:10 AM'
  },
  {
    id: 7,
    logLevel: 'Debug',
    shortMessage: 'Cache cleared successfully',
    fullMessage: 'Application cache cleared - 1,234 entries removed',
    createdOn: '11/04/2025 2:25:30 AM'
  },
  {
    id: 8,
    logLevel: 'Fatal',
    shortMessage: 'Critical system failure',
    fullMessage: 'Critical system failure - Unable to recover from unhandled exception',
    createdOn: '11/04/2025 2:20:00 AM'
  },
   {
    id: 9,
    logLevel: 'Error',
    shortMessage: 'Error 400. Bad request',
    fullMessage: 'Error 400. Bad request - Invalid parameters provided in the request body',
    createdOn: '11/04/2025 4:48:32 AM'
  },
  {
    id: 10,
    logLevel: 'Information',
    shortMessage: 'Application started',
    fullMessage: 'Application started successfully on port 3000',
    createdOn: '11/04/2025 2:37:42 AM'
  },
  {
    id: 11,
    logLevel: 'Information',
    shortMessage: 'Application started',
    fullMessage: 'Application started successfully on port 3000',
    createdOn: '11/04/2025 2:33:50 AM'
  },
  {
    id: 12,
    logLevel: 'Information',
    shortMessage: 'Application started',
    fullMessage: 'Application started successfully on port 3000',
    createdOn: '11/04/2025 2:32:55 AM'
  },
  {
    id: 13,
    logLevel: 'Warning',
    shortMessage: 'High memory usage detected',
    fullMessage: 'Memory usage exceeded 80% threshold - current usage: 85%',
    createdOn: '11/04/2025 2:30:15 AM'
  },
  {
    id: 14,
    logLevel: 'Error',
    shortMessage: 'Database connection failed',
    fullMessage: 'Failed to connect to database server at localhost:5432 - Connection timeout',
    createdOn: '11/04/2025 2:28:10 AM'
  },
  {
    id: 15,
    logLevel: 'Debug',
    shortMessage: 'Cache cleared successfully',
    fullMessage: 'Application cache cleared - 1,234 entries removed',
    createdOn: '11/04/2025 2:25:30 AM'
  },
  {
    id: 16,
    logLevel: 'Fatal',
    shortMessage: 'Critical system failure',
    fullMessage: 'Critical system failure - Unable to recover from unhandled exception',
    createdOn: '11/04/2025 2:20:00 AM'
  },
];

const logLevels = ['All', 'Debug', 'Information', 'Warning', 'Error', 'Fatal'];

const LogViewer : React.FC = () =>  {
   const [logs, setLogs] = useState<LogItem[]>(demoLogs);
  const [selectedLogs, setSelectedLogs] = useState<number[]>([]);
  const [filters, setFilters] = useState({
    createdFrom: '',
    createdTo: '',
    message: '',
    logLevel: 'All'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [searchExpanded, setSearchExpanded] = useState(true);

  // Filter logs based on criteria
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      // Message filter
      if (filters.message && !log.shortMessage.toLowerCase().includes(filters.message.toLowerCase())) {
        return false;
      }

      // Log level filter
      if (filters.logLevel !== 'All' && log.logLevel !== filters.logLevel) {
        return false;
      }

      // Date filters
      if (filters.createdFrom) {
        const logDate = new Date(log.createdOn);
        const fromDate = new Date(filters.createdFrom);
        if (logDate < fromDate) return false;
      }

      if (filters.createdTo) {
        const logDate = new Date(log.createdOn);
        const toDate = new Date(filters.createdTo);
        toDate.setHours(23, 59, 59, 999);
        if (logDate > toDate) return false;
      }

      return true;
    });
  }, [logs, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLogs = filteredLogs.slice(startIndex, endIndex);

  // Handle select all
  const handleSelectAll = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedLogs(currentLogs.map(log => log.id));
    } else {
      setSelectedLogs([]);
    }
  };

  // Handle individual select
  const handleSelectLog = (logId: number) => {
    if (selectedLogs.includes(logId)) {
      setSelectedLogs(selectedLogs.filter(id => id !== logId));
    } else {
      setSelectedLogs([...selectedLogs, logId]);
    }
  };

  // Delete selected logs
  const handleDeleteSelected = () => {
    if (selectedLogs.length === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedLogs.length} log(s)?`)) {
      setLogs(logs.filter(log => !selectedLogs.includes(log.id)));
      setSelectedLogs([]);
    }
  };

  // Clear all logs
  const handleClearLog = () => {
    if (window.confirm('Are you sure you want to clear all logs?')) {
      setLogs([]);
      setSelectedLogs([]);
    }
  };

  // View log details
  const handleViewLog = (log: any) => {
    alert(`Log Details:\n\nLevel: ${log.logLevel}\nMessage: ${log.fullMessage}\nCreated: ${log.createdOn}`);
  };

  // Get log level badge color
  const getLogLevelColor = (level:any) => {
    switch (level) {
      case 'Error': return 'bg-red-100 text-red-800 border-red-200';
      case 'Warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Information': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Debug': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Fatal': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-6 py-4 shadow-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Log</h1>
          <div className="flex gap-2">
            <button
              onClick={handleDeleteSelected}
              disabled={selectedLogs.length === 0}
              className="bg-red-600 hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
            >
              <FiTrash2 size={16} />
              Delete selected
            </button>
            <button
              onClick={handleClearLog}
              className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
            >
              <FiTrash2 size={16} />
              Clear log
            </button>
          </div>
        </div>
      </div>

      {/* Support Notice */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mx-6 mt-4">
        <div className="flex items-start">
          <FiInfo className="text-blue-400 mt-0.5 mr-3" size={20} />
          <p className="text-sm text-gray-700">
            Have questions or need help? Get dedicated support from the nopCommerce team with a guaranteed response within 24 hours. Please find more about our premium support services{' '}
            <a href="#" className="text-blue-600 hover:underline">here</a>.
          </p>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white mx-6 mt-6 rounded-lg shadow">
        <button
          onClick={() => setSearchExpanded(!searchExpanded)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50"
        >
          <div className="flex items-center gap-2">
            <FiSearch size={20} />
            <span className="font-semibold">Search</span>
          </div>
          <span>{searchExpanded ? '▲' : '▼'}</span>
        </button>

        {searchExpanded && (
          <div className="px-6 pb-6 border-t">
            <div className="grid grid-cols-2 gap-6 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Created from <FiInfo size={14} className="inline text-gray-400" />
                </label>
                <input
                  type="date"
                  value={filters.createdFrom}
                  onChange={(e) => setFilters({ ...filters, createdFrom: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message <FiInfo size={14} className="inline text-gray-400" />
                </label>
                <input
                  type="text"
                  value={filters.message}
                  onChange={(e) => setFilters({ ...filters, message: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Created to <FiInfo size={14} className="inline text-gray-400" />
                </label>
                <input
                  type="date"
                  value={filters.createdTo}
                  onChange={(e) => setFilters({ ...filters, createdTo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Log level <FiInfo size={14} className="inline text-gray-400" />
                </label>
                <select
                  value={filters.logLevel}
                  onChange={(e) => setFilters({ ...filters, logLevel: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {logLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4">
              <button
                onClick={() => setCurrentPage(1)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md flex items-center gap-2 transition-colors"
              >
                <FiSearch size={16} />
                Search
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Table Section */}
      <div className="bg-white mx-6 mt-6 rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <p className="text-sm text-gray-600">
            Learn more about <a href="#" className="text-blue-600 hover:underline">log</a>
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={currentLogs.length > 0 && selectedLogs.length === currentLogs.length}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Log level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Short message
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created on
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  View
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No data available in table
                  </td>
                </tr>
              ) : (
                currentLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedLogs.includes(log.id)}
                        onChange={() => handleSelectLog(log.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getLogLevelColor(log.logLevel)}`}>
                        {log.logLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{log.shortMessage}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{log.createdOn}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewLog(log)}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                      >
                        <FiEye size={16} />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-4 py-1 bg-blue-600 text-white rounded-md">
              {currentPage}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages || filteredLogs.length === 0}
              className="px-3 py-1 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Show</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 border rounded-md"
              >
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-gray-600">items</span>
            </div>
            <span className="text-sm text-gray-600">
              {startIndex + 1}-{Math.min(endIndex, filteredLogs.length)} of {filteredLogs.length} items
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogViewer;