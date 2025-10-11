import React from "react";

interface Props {
  filters: { from: string; to: string; level: string; message: string };
  setFilters: React.Dispatch<
    React.SetStateAction<{ from: string; to: string; level: string; message: string }>
  >;
  onSearch: () => void;
  onReset: () => void;
}

const LogFilters: React.FC<Props> = ({ filters, setFilters, onSearch, onReset }) => {
  return (
    <div className="bg-gray-50 p-4 rounded mb-3 shadow border">
      <div className="grid grid-cols-4 gap-3">
        <div>
          <label className="block text-sm mb-1">From Date</label>
          <input
            type="date"
            value={filters.from}
            onChange={(e) => setFilters({ ...filters, from: e.target.value })}
            className="border px-2 py-1 rounded w-full"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">To Date</label>
          <input
            type="date"
            value={filters.to}
            onChange={(e) => setFilters({ ...filters, to: e.target.value })}
            className="border px-2 py-1 rounded w-full"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Log Level</label>
          <select
            value={filters.level}
            onChange={(e) => setFilters({ ...filters, level: e.target.value })}
            className="border px-2 py-1 rounded w-full"
          >
            <option value="">All Levels</option>
            <option value="Information">Information</option>
            <option value="Warning">Warning</option>
            <option value="Error">Error</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Message</label>
          <input
            type="text"
            placeholder="Search message..."
            value={filters.message}
            onChange={(e) => setFilters({ ...filters, message: e.target.value })}
            className="border px-2 py-1 rounded w-full"
          />
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <button
          onClick={onSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
        <button
          onClick={onReset}
          className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default LogFilters;
