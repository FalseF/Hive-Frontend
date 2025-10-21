
"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function AdminMenuPage() {

  const adminModules = [
    {
      category: "User Management",
      features: [
        { name: "Manage Users", href: "/scms/admin/users" },
        { name: "Manage Roles", href: "/scms/admin/roles" },
        { name: "Role Permissions", href: "/scms/admin/permissions" },
      ],
    },
    {
      category: "Master Data",
      features: [
        { name: "Vendors", href: "/scms/admin/vendors" },
        { name: "Customers", href: "/scms/admin/customers" },
        { name: "Warehouses", href: "/scms/admin/warehouses" },
        { name: "Products", href: "/scms/admin/products" },
      ],
    },
    {
      category: "Operations",
      features: [
        { name: "Purchase Orders", href: "/scms/admin/purchase-orders" },
        { name: "Inventory Control", href: "/scms/admin/inventory" },
        { name: "Shipment Tracking", href: "/scms/admin/shipments" },
      ],
    },
    {
      category: "System",
      features: [
        { name: "Activity Logs", href: "/scms/admin/activity-logs" },
        { name: "Notifications", href: "/scms/admin/notifications" },
        { name: "System Settings", href: "/scms/admin/settings" },
      ],
    },
  ];

  return (
    <div className="min-h-[70vh] bg-gray-50 p-8">
      <h2 className="text-3xl font-bold text-center mb-10 text-blue-700">
        Administrative Menu
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {adminModules.map((module) => (
          <div
            key={module.category}
            className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition p-6"
          >
            <h3 className="text-xl font-semibold text-blue-600 mb-4">
              {module.category}
            </h3>
            <ul className="space-y-2">
              {module.features.map((feature) => (
                <li key={feature.name}>
                  <Link
                    href={feature.href}
                    className="block bg-gray-50 hover:bg-blue-100 text-gray-700 px-4 py-2 rounded-lg transition"
                  >
                    {feature.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
