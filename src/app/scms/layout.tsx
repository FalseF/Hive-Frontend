"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Split path into segments
  const segments = pathname.split("/").filter((seg) => seg);

  // Build link for each segment
  const buildPath = (index: number) => {
    // First segment is home page
    if (index === 0 && segments[0].toLowerCase() === "scms") return "/";
    return "/" + segments.slice(0, index + 1).join("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Topbar */}
      <header className="bg-green-500 text-white flex items-center justify-between px-6 py-3 ">
        <h1 className="font-semibold text-lg">Supply Chain Management System</h1>
      </header>

      {/* Breadcrumb */}
      <nav className="bg-gray-50 border-b border-gray-200 px-6 py-3 text-sm text-gray-700">
        <div className="flex items-center space-x-2">
          {segments.map((seg, index) => {
            const isLast = index === segments.length - 1;
            const path = buildPath(index);

            return (
              <span key={index} className="flex items-center">
                {!isLast ? (
                  <>
                    <Link
                      href={path}
                      className="capitalize hover:underline text-blue-700 font-medium"
                    >
                      {seg}
                    </Link>
                    <span className="mx-2 text-gray-400">/</span>
                  </>
                ) : (
                  <span className="capitalize text-gray-600">{seg}</span>
                )}
              </span>
            );
          })}
        </div>
      </nav>

      {/* Page content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
