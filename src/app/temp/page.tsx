"use client";

import { useState, useEffect } from "react";
import { FiUser, FiArrowUp, FiX } from "react-icons/fi";
import RoleModal from "../userrolemodal/page"
import axios from "axios";

import { useApi } from "../utils/api";

// ---------------- Types ----------------
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

export interface User1 {
  id: number;
  systemId: number;
  username: string;
  email: string;
  roleId: number;
  createdBy: number;
  updatedBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface Permission1 {
  id: number;
  systemId: number;
  name: string;
  projectId: number;
  roleId: number;
  checked: boolean;
  createdBy: number;
  updatedBy: number;
  createdAt: string;
  updatedAt: string;
}

// ---------------- Page ----------------
export default function UserRolesPage() {
   const api = useApi();
  // ---------------- State ----------------
  const [users, setUsers] = useState<User1[]>([]);
  const [permissions, setPermissions] = useState<Permission1[]>([]);
  const [roles, setRoles] = useState<Role1[]>([]);

  const [selectedRole, setSelectedRole] = useState<Role1 | null>(null);
  const [editingRole, setEditingRole] = useState<Role1 | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Permissions edit state
  const [isEditingPerm, setIsEditingPerm] = useState(false);
  const [tempPermissions, setTempPermissions] = useState<Permission1[]>([]);

  const [showScrollTop, setShowScrollTop] = useState(false);

  // ---------------- Effects ----------------
 // ---------------- Fetch Data ----------------
  useEffect(() => {
    fetchRoles();
    fetchUsers();
    fetchPermissions();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await api.get<Role1[]>("/userroles/roles");
      setRoles(res.data);
      if (res.data.length > 0) setSelectedRole(res.data[0]);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get<User1[]>("/userroles/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPermissions = async () => {
    try {
      const res = await api.get<Permission1[]>("/userroles/permissions");
      setPermissions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- Handlers ----------------
const handleSave = async (role: Role1) => {
  try {
    if (editingRole) {
      const res = await api.put<Role1>(`/userroles/roles/${editingRole.id}`, {
        ...editingRole,//this the role id
        ...role, // merge fields from form this copy all propertice from the role object 
       updatedAt: new Date().toISOString(),// this override the role object updateAt value 
       updatedBy: 1, // <- set from current logged in user
      });

      setRoles(roles.map((r) => (r.id === res.data.id ? res.data : r)));
      setSelectedRole(res.data);
    } else {
      const res = await api.post<Role1>("/userroles/roles", {
        ...role,
        createdBy: 1, // current user id
        updatedBy: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      setRoles([...roles, res.data]);
      setSelectedRole(res.data);
    }
  } catch (err) {
    console.error(err);
  } finally {
    setShowModal(false);
    setEditingRole(null);
  }
};

  const handleDelete = async () => {
    if (!selectedRole) return;
    try {
      await axios.delete(`/api/roles/${selectedRole.id}`);
      setRoles(roles.filter((r) => r.id !== selectedRole.id));
      setSelectedRole(null);
    } catch (err) {
      //console.error(err);
    }
  };

  const handleEditPermissions = () => {
    const rolePerms = permissions.filter((p) => p.roleId === selectedRole?.id);
    setTempPermissions(rolePerms);
    setIsEditingPerm(true);
  };

  const handleSavePermissions = async () => {
    try {
      // Save tempPermissions to backend
      await Promise.all(
        tempPermissions.map((p) =>
          api.put(`/userroles/permissions/${p.id}`, { ...p })
        )
      );
      // Refresh permissions from backend
      fetchPermissions();
    } catch (err) {
      console.error(err);
    } finally {
      setIsEditingPerm(false);
      setTempPermissions([]);
    }
  };

  const handleCancelPermissions = () => {
    setIsEditingPerm(false);
    setTempPermissions([]);
  };


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


  const togglePermission = (id: number) => {
    setTempPermissions((prev) =>
      prev.map((p) => (p.id === id ? { ...p, checked: !p.checked } : p))
    );
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
                        <span>{user.username}</span>
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


