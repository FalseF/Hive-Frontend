"use client";
import { useState, useEffect } from "react";
import { useApi } from "../utils/api";
import ProtectedRoute from "../components/ProtectedRoute";

interface Project {
  id: number;
  name: string;
}

export default function DashboardPage() {
  const api = useApi();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get<Project[]>("/auth/projects");
        setProjects(res.data);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };

    fetchProjects();
  }, []);

  return (
    <ProtectedRoute roles={["Admin", "Manager"]}>
      <div className="max-w-2xl mx-auto mt-10 bg-white p-6 shadow rounded-xl">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

        {projects.length > 0 ? (
          <ul className="list-disc pl-6 space-y-2">
            {projects.map((p) => (
              <li key={p.id}>{p.name}</li>
            ))}
          </ul>
        ) : (
          <p>No projects found.</p>
        )}
      </div>
    </ProtectedRoute>
  );
}
