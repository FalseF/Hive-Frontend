// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client"
// import React, { useState, ChangeEvent, useEffect } from 'react';
// import Pagination from "../components/Pagination";
// import { useApi } from "../utils/generictypeapi";
// import { FiSearch, FiTrash2, FiEye, FiHelpCircle, FiX } from 'react-icons/fi';
// import { ThreeDot } from "react-loading-indicators";
// import { toDisplayDateString } from "../utils/dataHelper";

// interface LogItem {
//     id: number;
//     logLevel: string;
//     shortMessage: string;
//     fullMessage: string;
//     createdOn: string;
//     systemId?: number;
//     systemName?: string;
//     projectId?: number;
//     projectName?: string;
//     userId?: number;
//     fullName?: string;
//     ipAddress?: string;
//     pageUrl?: string;
//     referrerUrl?: string;
// }

// interface LogSearchDto {
//     CreatedFrom?: string;
//     CreatedTo?: string;
//     Level?: string;
//     Message?: string;
//     PageIndex: number;
//     PageSize: number;
//     SortColumn?: string;
//     SortDirection?: string;
// }

// const logLevels = ['All', 'Debug', 'Information', 'Warning', 'Error', 'Fatal'];

// const LogViewer: React.FC = () => {
//     const buildODataQuery = async (dto: LogSearchDto, currentPage: number, itemPerpage: number) => {
//         const builder = new ODataQueryBuilder();
    
//         if (dto.CreatedFrom) {
//             builder.filter({ field: "CreatedOn", operator: "ge", value: dto.CreatedFrom });
//         }
    
//         if (dto.CreatedTo) {
//             builder.filter({ field: "CreatedOn", operator: "le", value: dto.CreatedTo });
//         }
    
//         if (dto.Level && dto.Level !== "All") {
//             builder.filter({ field: "LogLevel", operator: "eq", value: dto.Level });
//         }
    
//         if (dto.Message) {
//             builder.filter({ field: "ShortMessage", operator: "contains", value: dto.Message });
//         }
    
//         if (dto.SortColumn) {
//             builder.orderBy({ field: "CreatedOn", direction: "desc" });
//         }
    
//         builder.paginate(currentPage, itemPerpage);
//         return builder.build();
//     };
    
//     const buildCountQuery = async (dto: LogSearchDto) => {
//         const builder = new ODataQueryBuilder();
    
//         builder.select(["Id"]);
    
//         if (dto.CreatedFrom)
//             builder.filter({ field: "CreatedOn", operator: "ge", value: dto.CreatedFrom });
    
//         if (dto.CreatedTo)
//             builder.filter({ field: "CreatedOn", operator: "le", value: dto.CreatedTo });
    
//         if (dto.Level && dto.Level !== "All")
//             builder.filter({ field: "LogLevel", operator: "eq", value: dto.Level });
    
//         if (dto.Message)
//             builder.filter({ field: "ShortMessage", operator: "contains", value: dto.Message });
    
//         builder.count(true);
//         return builder.build();
//     };
    

//     const api = useApi();
//     const [logs, setLogs] = useState<LogItem[]>([]);
//     const [selectedLogs, setSelectedLogs] = useState<number[]>([]);
//     const [selectedLog, setSelectedLog] = useState<LogItem | null>(null);
//     const [totalCount, setTotalCount] = useState(0);
//     const [loading, setLoading] = useState(true);
//     const [showModal, setShowModal] = useState(false);

//     const [searchDto, setSearchDto] = useState<LogSearchDto>({
//         CreatedFrom: "",
//         CreatedTo: "",
//         Level: "All",
//         Message: "",
//         PageIndex: 1,
//         PageSize: 10
//     });

//     const [currentPage, setCurrentPage] = useState(1);
//     const [itemsPerPage, setItemsPerPage] = useState(10);
//     const [searchExpanded, setSearchExpanded] = useState(false);

//     // Pagination
//     const totalPages = Math.ceil(totalCount / itemsPerPage);
//     const currentLogs = logs;

//     useEffect(() => {
//         handleSearch();
//     }, [currentPage, itemsPerPage]);

//     const handleSearch = async () => {
//         try {
//             setLoading(true);

//             const filterQuery = await buildODataQuery(searchDto, currentPage, itemsPerPage);
//             const countQuery = await buildCountQuery(searchDto);

//             console.log("query",filterQuery, countQuery);

//             const filterResult = await api.getRaw(`/odata/logs?${filterQuery}`);
//             const filteredCount = await api.getRaw(`/odata/logs?${countQuery}`);

//             if (filterResult.data) {
//                 setLogs(filterResult.data ?? []);
//             }

//             if (filteredCount.data) {
//                 setTotalCount(filteredCount.data.length?? 0);
//             }
//         } catch (error) {
//             console.error("Search failed:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Handle select all
//     const handleSelectAll = (e: ChangeEvent<HTMLInputElement>) => {
//         if (e.target.checked) {
//             const ids = currentLogs.map(log => log.id);
//             setSelectedLogs(ids);

//             setTimeout(() => {
//                 console.log("selectedLog (after update)", ids);
//             }, 0);
//         } else {
//             setSelectedLogs([]);
//         }
//     };

//     // Handle individual select
//     const handleSelectLog = (logId: number) => {
//         if (selectedLogs.includes(logId)) {
//             setSelectedLogs(selectedLogs.filter(id => id !== logId));
//         } else {
//             setSelectedLogs([...selectedLogs, logId]);
//         }
//     };

//     // Delete selected logs
//     const handleDeleteSelected = async () => {
//         if (selectedLogs.length === 0) return;

//         try {
//             const response = await api.post<void>("/logs/delete-selected", selectedLogs);
//             if (!response.success) return;

//             const newLogs = logs.filter(log => !selectedLogs.includes(log.id));
//             setLogs(newLogs);

//             const deletedCount = selectedLogs.length;
//             setTotalCount((prev) => prev - deletedCount);

//             setSelectedLogs([]);

//             if (newLogs.length === 0 && currentPage > 1) {
//                 setCurrentPage(currentPage - 1);
//             } else {
//                 handleSearch();
//             }
//         } catch (error) {
//             console.error("Delete failed", error);
//         }
//     };

//     // Clear all logs
//     const handleClearLog = async () => {
//         if (window.confirm('Are you sure you want to clear all logs?')) {
//             try {
//                 //const response = await api.delete("/logs/clear");
//             } catch { }

//             setLogs([]);
//             setSelectedLogs([]);
//         }
//     };

//     // View log details
//     const handleViewLog = async (id: number) => {
//         if (id <= 0) return;

//         try {
//             const res = await api.get<LogItem>(`/logs/${id}`);
//             if (res.success && res.data) {
//                 setSelectedLog(res.data);
//                 setShowModal(true);
//             }
//         } catch { }
//     };

//     // Get log level badge color
//     const getLogLevelColor = (level: any) => {
//         switch (level) {
//             case 'Error':
//                 return 'bg-red-100 text-red-800 border-red-200';
//             case 'Warning':
//                 return 'bg-yellow-100 text-yellow-800 border-yellow-200';
//             case 'Information':
//                 return 'bg-blue-100 text-blue-800 border-blue-200';
//             case 'Debug':
//                 return 'bg-gray-100 text-gray-800 border-gray-200';
//             case 'Fatal':
//                 return 'bg-purple-100 text-purple-800 border-purple-200';
//             default:
//                 return 'bg-gray-100 text-gray-800 border-gray-200';
//         }
//     };

//     // === Class name constants ===
//     const headerBtnClass = "text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors";
//     const searchLabel = "flex items-center justify-end text-sm font-medium text-gray-700 w-[25%]";
//     const inputBase = "w-[60%] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";

//     const tooltipIcon = "text-gray-400 h-5 w-5 cursor-pointer";
//     const tooltipBox = "absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gray-800 text-white text-xs rounded-md px-2 py-1 -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap z-10";

//     const tableHeaderCell = "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider";

//     //if(loader) return <div><p> Loading</p></div>

//     const DetailRow = ({ label, value }: { label: string; value: any }) => (
//         <div className="flex justify-between border-b py-2">
//             <span className="font-semibold text-gray-700">{label}:</span>
//             <span className="text-gray-800 text-right ml-4 max-w-[65%] break-words">
//                 {value ?? "-"}
//             </span>
//         </div>
//     );

//     return (
//         <div className="min-h-screen bg-gray-50">
//             {/* Header */}
//             <div className="bg-[#008ca8] text-white px-6 py-2 ">
//                 <div className="flex justify-between items-center">
//                     <h1 className="text-2xl font-bold">Log</h1>

//                     <div className="flex gap-2">
//                         <button
//                             onClick={handleDeleteSelected}
//                             disabled={selectedLogs.length === 0}
//                             className={`${headerBtnClass} bg-red-600 hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed`}
//                         >
//                             <FiTrash2 size={16} /> Delete selected
//                         </button>

//                         <button
//                             onClick={handleClearLog}
//                             className={`${headerBtnClass} bg-red-700 hover:bg-red-800`}
//                         >
//                             <FiTrash2 size={16} /> Clear log
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* Search Section */}
//             <div className="bg-white mx-6 mt-6 rounded-lg">
//                 <button
//                     onClick={() => setSearchExpanded(!searchExpanded)}
//                     className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50"
//                 >
//                     <div className="flex items-center gap-2">
//                         <FiSearch size={20} />
//                         <span className="font-semibold">Search</span>
//                     </div>

//                     <svg
//                         className={`w-5 h-5 text-gray-500 transition-transform ${searchExpanded ? 'rotate-180' : ''}`}
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                     >
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                     </svg>
//                 </button>

//                 {searchExpanded && (
//                     <div className="px-6 pb-6 border-t">
//                         <div className="grid grid-cols-2 gap-6 mt-4">
//                             {/* Created From */}
//                             <div className="flex items-center gap-3">
//                                 <label className={`${searchLabel}`}>
//                                     Created from
//                                     <div className="relative group ml-1">
//                                         <FiHelpCircle className={tooltipIcon} />
//                                         <span className={tooltipBox}>
//                                             To the log create search date
//                                         </span>
//                                     </div>
//                                 </label>
//                                 <input
//                                     type="date"
//                                     value={searchDto.CreatedFrom}
//                                     onChange={(e) => setSearchDto({ ...searchDto, CreatedFrom: e.target.value })}
//                                     className={`${inputBase}`}
//                                 />
//                             </div>

//                             {/* Message */}
//                             <div className="flex items-center gap-3">
//                                 <label className={`${searchLabel}`}>
//                                     Message
//                                     <div className="relative group ml-1">
//                                         <FiHelpCircle className={tooltipIcon} />
//                                         <span className={tooltipBox}>
//                                             Search by log message text
//                                         </span>
//                                     </div>
//                                 </label>
//                                 <input
//                                     type="text"
//                                     value={searchDto.Message}
//                                     onChange={(e) => setSearchDto({ ...searchDto, Message: e.target.value })}
//                                     className={`${inputBase}`}
//                                 />
//                             </div>

//                             {/* Created To */}
//                             <div className="flex items-center gap-3">
//                                 <label className={`${searchLabel}`}>
//                                     Created to
//                                     <div className="relative group ml-1">
//                                         <FiHelpCircle className={tooltipIcon} />
//                                         <span className={tooltipBox}>
//                                             To the log end search date
//                                         </span>
//                                     </div>
//                                 </label>

//                                 <input
//                                     type="date"
//                                     value={searchDto.CreatedTo}
//                                     onChange={(e) => setSearchDto({ ...searchDto, CreatedTo: e.target.value })}
//                                     className={`${inputBase}`}
//                                 />
//                             </div>

//                             {/* Log Level */}
//                             <div className="flex items-center gap-3">
//                                 <label className={`${searchLabel}`}>
//                                     Log level
//                                     <div className="relative group ml-1">
//                                         <FiHelpCircle className={tooltipIcon} />
//                                         <span className={tooltipBox}>
//                                             Select the log severity level
//                                         </span>
//                                     </div>
//                                 </label>

//                                 <select
//                                     value={searchDto.Level}
//                                     onChange={(e) => setSearchDto({ ...searchDto, Level: e.target.value })}
//                                     className={`${inputBase}`}
//                                 >
//                                     {logLevels.map((level) => (
//                                         <option key={level} value={level}>
//                                             {level}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>
//                         </div>

//                         <div className="mt-6 flex justify-center">
//                             <button
//                                 onClick={() => {
//                                     setCurrentPage(1);
//                                     handleSearch();
//                                 }}
//                                 className="bg-[#008ca8] hover:bg-sky-700 text-white px-6 py-2 rounded-md flex items-center gap-2 transition-colors"
//                             >
//                                 <FiSearch size={16} /> Search
//                             </button>
//                         </div>
//                     </div>
//                 )}
//             </div>

//             {/* Table Section */}
//             <div className="bg-white mx-6 mt-2 rounded-lg overflow-hidden">
//                 <div className="overflow-x-auto">
//                     <table className="w-full">
//                         <thead className="bg-gray-50 border-b">
//                             <tr>
//                                 <th className="px-6 py-1 text-left">
//                                     <input
//                                         type="checkbox"
//                                         checked={currentLogs.length > 0 && selectedLogs.length === currentLogs.length}
//                                         onChange={handleSelectAll}
//                                         className="rounded border-gray-300"
//                                     />
//                                 </th>

//                                 <th className={tableHeaderCell}>Log level</th>
//                                 <th className={tableHeaderCell}>Short message</th>
//                                 <th className={tableHeaderCell}>User</th>
//                                 <th className={tableHeaderCell}>System</th>
//                                 <th className={tableHeaderCell}>Created on</th>
//                                 <th className={tableHeaderCell}>View</th>
//                             </tr>
//                         </thead>

//                         <tbody className="bg-white divide-y divide-gray-200">
//                             {loading ? (
//                                 <tr>
//                                     <td colSpan={7} className="py-10 text-center">
//                                         <div className="flex justify-center items-center">
//                                             <ThreeDot color="#0085ad" size="medium" text="" textColor="" />
//                                         </div>
//                                     </td>
//                                 </tr>
//                             ) : currentLogs.length === 0 ? (
//                                 <tr>
//                                     <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
//                                         No data available in table
//                                     </td>
//                                 </tr>
//                             ) : (
//                                 currentLogs.map((log) => (
//                                     <tr key={log.id} className="hover:bg-gray-50">
//                                         <td className="px-6 py-2">
//                                             <input
//                                                 type="checkbox"
//                                                 checked={selectedLogs.includes(log.id)}
//                                                 onChange={() => handleSelectLog(log.id)}
//                                                 className="rounded border-gray-300"
//                                             />
//                                         </td>

//                                         <td className="px-6 py-2">
//                                             <span
//                                                 className={`
//                                                     px-3 py-2 rounded-full text-sm font-medium border
//                                                     ${getLogLevelColor(log.logLevel)}
//                                                 `}
//                                             >
//                                                 {log.logLevel}
//                                             </span>
//                                         </td>

//                                         <td className="px-6 py-2 text-sm text-gray-900">
//                                             {log.shortMessage}
//                                         </td>

//                                         <td className="px-6 py-2 text-sm text-gray-900">
//                                             {log.fullName}
//                                         </td>

//                                         <td className="px-6 py-2 text-sm text-gray-900">
//                                             {log.systemName}
//                                         </td>

//                                         <td className="px-6 py-2 text-sm text-gray-500">
//                                             {toDisplayDateString(log.createdOn)}
//                                         </td>

//                                         <td className="px-6 py-2">
//                                             <button
//                                                 onClick={() => handleViewLog(log.id)}
//                                                 className="text-[#008ca8] hover:text-blue-800 flex items-center gap-1 text-sm"
//                                             >
//                                                 <FiEye size={16} /> View
//                                             </button>
//                                         </td>
//                                     </tr>
//                                 ))
//                             )}
//                         </tbody>
//                     </table>
//                 </div>

//                 {/* Pagination */}
//                 <Pagination
//                     currentPage={currentPage}
//                     totalPages={totalPages}
//                     itemsPerPage={itemsPerPage}
//                     totalItems={totalCount}
//                     onPageChange={(page) => {
//                         setCurrentPage(page);
//                     }}
//                     onItemsPerPageChange={(count) => {
//                         setItemsPerPage(count);
//                         setCurrentPage(1);
//                     }}
//                     pageSizeOptions={[10, 15, 20, 50]}
//                 />
//             </div>

//             {/*Modal*/}
//             {showModal && selectedLog && (
//                 <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50">
//                     <div className="bg-white w-full max-w-2xl rounded-lg p-6 relative max-h-[90vh] overflow-y-auto">
//                         <button
//                             onClick={() => setShowModal(false)}
//                             className="absolute top-3 right-3 text-gray-500 hover:text-black"
//                         >
//                             <FiX size={20} />
//                         </button>

//                         <h2 className="text-xl font-semibold mb-4 text-gray-800">
//                             Log Details (ID: {selectedLog.id})
//                         </h2>

//                         <div className="space-y-3">
//                             <DetailRow label="Log Level" value={selectedLog.logLevel} />
//                             <DetailRow label="Short Message" value={selectedLog.shortMessage} />
//                             <DetailRow label="Full Message" value={selectedLog.fullMessage} />
//                             <DetailRow label="Full Message" value={selectedLog.fullMessage} />
//                             <DetailRow label="IP Address" value={selectedLog.ipAddress} />
//                             <DetailRow label="Page URL" value={selectedLog.pageUrl} />
//                             <DetailRow label="Referrer URL" value={selectedLog.referrerUrl} />
//                             <DetailRow label="System" value={selectedLog.systemName} />
//                             <DetailRow label="SystemId" value={selectedLog.systemId} />
//                             <DetailRow label="User" value={selectedLog.fullName} />
//                             <DetailRow label="UserId" value={selectedLog.userId} />
//                             <DetailRow label="Created On" value={new Date(selectedLog.createdOn).toLocaleString()} />
//                         </div>

//                         <div className="mt-6 flex justify-end">
//                             <button
//                                 onClick={() => setShowModal(false)}
//                                 className="px-4 py-2 bg-[#008ca8] text-white rounded-md hover:bg-sky-700"
//                             >
//                                 Close
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default LogViewer;
