"use client";

import { useState, useEffect } from "react";
import { FiUser, FiArrowUp, FiX } from "react-icons/fi";

// ---------------- Types ----------------
export interface UserType {
  id: number;
  name: string;
  roleId: number;
}

export interface Permission {
  id: number;
  name: string;
  roleId: number;
  checked: boolean;
}

export interface Role1 {
  id: number;
  systemId: number;
  name: string;
  projectId: number;
  createdBy: number;
  updatedBy: number;
  createdAt: string;
  updatedAt: string;
}

// ---------------- Page ----------------
export default function UserRolesPage() {
  // ---------------- Data ----------------
  const users: UserType[] = [
    { id: 1, name: "John Doe", roleId: 1 },
    { id: 2, name: "Jane Smith", roleId: 1 },
    { id: 3, name: "Michael Brown", roleId: 2 },
    { id: 4, name: "Sarah Lee", roleId: 3 },
  ];

  const [permissions, setPermissions] = useState<Permission[]>([
    { id: 1, name: "View Reports", roleId: 1, checked: true },
    { id: 2, name: "Edit Users", roleId: 1, checked: false },
    { id: 3, name: "Delete Projects", roleId: 2, checked: true },
    { id: 4, name: "Assign Tasks", roleId: 3, checked: false },
    { id: 5, name: "View Reports", roleId: 1, checked: true },
    { id: 6, name: "Edit Users", roleId: 1, checked: false },
   /*  { id: 3, name: "Delete Projects", roleId: 1, checked: true },
    { id: 4, name: "Assign Tasks", roleId: 1, checked: false },
    { id: 1, name: "View Reports", roleId: 1, checked: true },
    { id: 2, name: "Edit Users", roleId: 1, checked: false },
    { id: 3, name: "Delete Projects", roleId: 1, checked: true },
    { id: 4, name: "Assign Tasks", roleId: 1, checked: false },
    { id: 1, name: "View Reports", roleId: 1, checked: true },
    { id: 2, name: "Edit Users", roleId: 1, checked: false },
    { id: 3, name: "Delete Projects", roleId: 2, checked: true },
    { id: 4, name: "Assign Tasks", roleId: 3, checked: false }, */
  ]);

  // ---------------- State ----------------
  const [roles, setRoles] = useState<Role1[]>([
    { id: 1, name: "Admin", projectId: 4, createdAt: "", updatedAt: "", systemId: 1, createdBy: 1, updatedBy: 1 },
    { id: 2, name: "Lead", projectId: 2, createdAt: "", updatedAt: "", systemId: 1, createdBy: 1, updatedBy: 1 },
    { id: 3, name: "Manager1", projectId: 1, createdAt: "", updatedAt: "", systemId: 1, createdBy: 1, updatedBy: 1 },
    { id: 4, name: "Manager2", projectId: 2, createdAt: "", updatedAt: "", systemId: 1, createdBy: 1, updatedBy: 1 },
  ]);

  const [selectedRole, setSelectedRole] = useState<Role1 | null>(null);
  const [editingRole, setEditingRole] = useState<Role1 | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Permissions edit state
  const [isEditingPerm, setIsEditingPerm] = useState(false);
  const [tempPermissions, setTempPermissions] = useState<Permission[]>([]);

  const [showScrollTop, setShowScrollTop] = useState(false);

  // ---------------- Effects ----------------
  useEffect(() => {
    // Auto select first role
    if (roles.length > 0 && !selectedRole) {
      setSelectedRole(roles[0]);
    }
  }, [roles, selectedRole]);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ---------------- Handlers ----------------
  const handleSave = (role1: Role1) => {
    if (editingRole) {
      // update
      setRoles(roles.map((r) => (r.id === editingRole.id ? { ...role1 } : r)));
      setSelectedRole({ ...role1 });
    } else {
      // create
      const newRole = {
        ...role1,
        id: roles.length ? roles[roles.length - 1].id + 1 : 1,
      };
      setRoles([...roles, newRole]);
      setSelectedRole(newRole);
    }
    setShowModal(false);
    setEditingRole(null);
  };

  const handleDelete = () => {
    if (!selectedRole) return;
    setRoles(roles.filter((r) => r.id !== selectedRole.id));
    setSelectedRole(null);
  };

  const handleEditPermissions = () => {
    const rolePerms = permissions.filter((p) => p.roleId === selectedRole?.id);
    setTempPermissions(rolePerms);
    setIsEditingPerm(true);
  };

  const handleSavePermissions = () => {
    const updated = permissions.map((p) => tempPermissions.find((tp) => tp.id === p.id) || p);
    setPermissions(updated);
    setIsEditingPerm(false);
  };

  const handleCancelPermissions = () => {
    setIsEditingPerm(false);
    setTempPermissions([]);
  };

  const togglePermission = (id: number) => {
    setTempPermissions((prev) => prev.map((p) => (p.id === id ? { ...p, checked: !p.checked } : p)));
  };

  const assignedUsers = users.filter((u) => u.roleId === selectedRole?.id);
  const rolePermissions = isEditingPerm
    ? tempPermissions
    : permissions.filter((p) => p.roleId === selectedRole?.id);

  // ---------------- UI ----------------
  return (
    <div className="p-6 pb-24 space-y-6 min-h-screen">
      {/* ---------------- Header ---------------- */}
      <div className="flex items-center justify-between border-b pb-4">
        <h1 className="text-2xl font-semibold">User Roles</h1>

        <div className="flex gap-2">
          <button
            onClick={() => {
              setEditingRole(null);
              setShowModal(true);
            }}
            className="px-8 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Create
          </button>
          <button
            onClick={() => {
              if (selectedRole) {
                setEditingRole(selectedRole);
                setShowModal(true);
              }
            }}
            disabled={!selectedRole}
            className={`px-8 py-2 rounded-lg text-white ${
              selectedRole ? "bg-yellow-500 hover:bg-yellow-600" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Rename
          </button>
          <button
            onClick={handleDelete}
            disabled={!selectedRole}
            className={`px-8 py-2 rounded-lg text-white ${
              selectedRole ? "bg-red-600 hover:bg-red-700" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Delete
          </button>
        </div>
      </div>

      {/* ---------------- Roles List ---------------- */}
      <div className="flex flex-wrap gap-2">
        {roles.map((role) => (
          <div
            key={role.id}
            onClick={() => setSelectedRole(role)}
            className={`flex items-center justify-center px-4 py-1 min-w-max rounded-lg shadow cursor-pointer transition
              ${selectedRole?.id === role.id
                ? "bg-blue-500 text-black hover:bg-blue-200"
                : "bg-gray-200 hover:bg-blue-300"
              }`}
          >
            <span className="inline-flex flex-wrap justify-center text-center font-medium">
              {role.name}
            </span>
          </div>
        ))}
      </div>

      {/* ---------------- Users & Permissions ---------------- */}
      {selectedRole ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-start">
          {/* ---- Left: Assigned Users ---- */}
          <div className="border rounded-lg shadow bg-white">
            <h4 className="sticky p-1 top-0 text-white font-semibold text-center shadow-sm z-10 bg-[#337ab7]">
              Assigned Users ({assignedUsers.length})
            </h4>
            <div className="pr-2">
              {assignedUsers.length > 0 ? (
                <ul className="space-y-2">
                  {assignedUsers.map((user) => (
                    <li
                      key={user.id}
                      className="flex items-center space-x-3 p-2 border rounded-md hover:bg-gray-50"
                    >
                      <FiUser className="w-5 h-5 text-gray-500" />
                      <span>{user.name}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No users assigned</p>
              )}
            </div>
          </div>

          {/* ---- Right: Permissions ---- */}
          <div className="border rounded-lg shadow bg-white">
            <h4 className="sticky top-0 p-1 text-white font-semibold text-center shadow-sm z-10 bg-[#337ab7]">
              Permissions ({rolePermissions.length})
            </h4>
            <div className="pr-2">
              {rolePermissions.length > 0 ? (
                <ul className="space-y-2">
                  {rolePermissions.map((perm, index) => (
                    <li
                      key={perm.id}
                      className="flex items-center justify-between p-2 border rounded-md hover:bg-gray-50"
                    >
                      <span>{index + 1}.) {perm.name}</span>
                      <input
                        type="checkbox"
                        checked={perm.checked}
                        disabled={!isEditingPerm}
                        onChange={() => togglePermission(perm.id)}
                        className={`h-4 w-4 ${isEditingPerm ? "cursor-pointer" : "cursor-not-allowed"}`}
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No permissions set</p>
              )}
            </div>
            {rolePermissions.length > 0 && (
              <div className="mt-4 flex gap-3 justify-end pb-2 pr-2">
                {isEditingPerm ? (
                  <>
                    <button
                      onClick={handleCancelPermissions}
                      className="px-10 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSavePermissions}
                      className="px-10 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleEditPermissions}
                    className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                  >
                    Edit Permissions
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="text-gray-500 italic">Select a role to view users and permissions</p>
      )}

      {/* ---------------- Modal ---------------- */}
      {showModal && (
        <RoleModal
          role={editingRole}
          onClose={() => {
            setShowModal(false);
            setEditingRole(null);
          }}
          onSave={handleSave}
        />
      )}

      {/* ---------------- Scroll-to-Top Button ---------------- */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-12 p-3 rounded-full bg-blue-600 text-white shadow-xl hover:bg-blue-700 
          transition-all duration-1000 ease-in-out opacity-70"
        >
          <FiArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

// ---------------- Role Modal ----------------
interface ModalProps {
  role: Role1 | null;
  onClose: () => void;
  onSave: (role: Role1) => void;
}

export function RoleModal({ role, onClose, onSave }: ModalProps) {
  const [formData, setFormData] = useState<Role1>(
    role || {
      id: 0,
      name: "",
      createdAt: "",
      updatedAt: "",
      systemId: 0,
      projectId: 0,
      createdBy: 0,
      updatedBy: 0,
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {role ? "Edit Role" : "Add Role"}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring focus:ring-blue-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600">System</label>
            <input
              type="number"
              name="systemId"
              value={formData.systemId}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring focus:ring-blue-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600">Project</label>
            <select
              name="projectId"
              value={formData.projectId}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring focus:ring-blue-200"
              required
            >
              <option value="0">-- Select Project --</option>
              <option value="1">Demo</option>
              <option value="2">MVC</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600">Expiration Date</label>
            <input
              type="date"
              name="createdAt"
              value={formData.createdAt}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring focus:ring-blue-200"
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              {role ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
