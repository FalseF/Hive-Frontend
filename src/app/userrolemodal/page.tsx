"use client";
import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { Role1 } from "../userroles/page";


interface ModalProps {
  role: Role1 | null;
  onClose: () => void;
  onSave: (role: Role1) => void;
}

export default function RoleModal({ role, onClose, onSave }: ModalProps) {
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