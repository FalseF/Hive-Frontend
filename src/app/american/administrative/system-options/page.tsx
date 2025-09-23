"use client";

import Link from "next/link";
import {
  FiUser,
  FiUserPlus,
  FiSettings,
  FiFileText,
  FiShield,
  FiBriefcase,
  FiClipboard,
  FiBell,
} from "react-icons/fi";

export default function SystemOptionsPage() {
  const options = [
    {
      category: "Member Section",
      items: [
        { name: "Add New User", href: "/admin/users/add", icon: FiUserPlus },
        { name: "Edit User", href: "/admin/users", icon: FiUser },
        { name: "Inactive Users", href: "/admin/users/inactive", icon: FiUser },
      ],
    },
    {
      category: "User Role",
      items: [{ name: "Manage Roles", href: "/admin/roles", icon: FiShield }],
    },
    {
      category: "Additional Reports",
      items: [
        { name: "Duty Report", href: "/admin/reports/duty", icon: FiFileText },
        { name: "Report Access", href: "/admin/reports/access", icon: FiClipboard },
      ],
    },
    {
      category: "Modules",
      items: [
        { name: "Accounting Settings", href: "/admin/modules/accounting", icon: FiSettings },
        { name: "HRMS Settings", href: "/admin/modules/hrms", icon: FiSettings },
        { name: "Brokerage Settings", href: "/admin/modules/brokerage", icon: FiSettings },
        { name: "Assets Settings", href: "/admin/modules/assets", icon: FiSettings },
        { name: "RIMS Settings", href: "/admin/modules/rims", icon: FiSettings },
        { name: "Tenstreet Settings", href: "/admin/modules/tenstreet", icon: FiSettings },
      ],
    },
    {
      category: "Organization",
      items: [
        { name: "Company Profile", href: "/admin/organization/profile", icon: FiBriefcase },
        { name: "Branches", href: "/admin/organization/branches", icon: FiBriefcase },
        { name: "Regional Settings", href: "/admin/organization/regional", icon: FiSettings },
      ],
    },
    {
      category: "Audit & Compliance",
      items: [
        { name: "Login History", href: "/admin/audit/logins", icon: FiUser },
        { name: "Activity Logs", href: "/admin/audit/activity", icon: FiFileText },
        { name: "Security Alerts", href: "/admin/audit/alerts", icon: FiShield },
      ],
    },
    {
      category: "System Configuration",
      items: [
        { name: "Notifications", href: "/admin/system/notifications", icon: FiBell },
        { name: "Integrations", href: "/admin/system/integrations", icon: FiSettings },
        { name: "Security Policies", href: "/admin/system/security", icon: FiShield },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-200">
      {/* PAGE HEADING */}
      <h2 className="text-2xl font-bold text-white text-center bg-[#337ab7] py-1">
        System Options
      </h2>

      <div className="space-y-2 mt-2">
        {options.map((section) => (
          <div
            key={section.category}
            className="flex flex-col md:flex-row md:items-stretch rounded-lg overflow-hidden"
          >
            {/* LEFT CATEGORY PANEL */}
            <div className="md:w-1/3 bg-blue-100 p-2 flex flex-col justify-center">
              <h2 className="text-xl font-semibold mb-1">{section.category}</h2>
              <p className="text-sm text-gray-700">
                Manage and configure {section.category.toLowerCase()} settings.
              </p>
            </div>

            {/* RIGHT GRID PANEL */}
            <div className="md:flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 bg-gray-50 p-2">
              {section.items.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="no-underline flex items-center p-4 bg-white rounded-lg  transition hover:bg-blue-50 group"
                >
                  {/* ICON */}
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full text-blue-600 mr-3">
                    <item.icon className="w-5 h-5" />
                  </div>

                  {/* TEXT */}
                  <span className="text-gray-700 font-medium group-hover:text-blue-700">
                    {item.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
