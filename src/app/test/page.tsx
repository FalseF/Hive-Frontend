"use client"
import { useState ,useEffect} from 'react';
import { useApi } from "../utils/generictypeapi";

const LoginPage = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
   const [role, setRole] = useState<Role1 | null>(null);
   const [roles, setRoles] = useState<Role1[]>([]);
const api = useApi();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true); // Show loading indicator
    setError(null); // Clear previous errors

    const loginData = { username, password };

    try {
      const response = await fetch('http://localhost:5205/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        const data = await response.json();
        // Save the JWT token or handle the success
        console.log('Login successful:', data);
        // You could store the token in localStorage, cookie, or in your app state
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };


    const [projects, setProjects] = useState<Project[]>([]);
  
    
      const fetchProjects = async () => {
        try {
          const res = await api.get<Project[]>("/auth/projects");
          setProjects(res);
        } catch (err) {
          console.error("Error fetching projects:", err);
        }
      };
  const fetchRole = async () => {
        try {
          const newRole: Role1 = {
      id: 0, // backend will replace
      systemId: 1,
      name: "Admin",
      projectId: 1,
      createdBy: 1,
      updatedBy: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
          const res = await api.post<Role1>("/role/roles",newRole);
          setRole(res);
          console.log(role);
        } catch (err) {
          console.error("Error fetching projects:", err);
        }
};
 const fetchAllRole = async () => {
        try {
          const res = await api.get<Role1[]>("/role/roles");
          setRoles(res);
         console.log(roles);
        } catch (err) {
          console.error("Error fetching projects:", err);
        }
      };
      
    

interface Project {
  id: number;
  name: string;
}
 interface Role1 {
  id: number;
  systemId: number;
  name: string;
  projectId: number;
  createdBy: number;
  updatedBy: number;
  createdAt: string;
  updatedAt: string;
}



  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={fetchProjects}>click me for check refresh token</button>
      <br/>
      <button onClick={fetchProjects}>click me again </button>
      <br/>
      <button onClick={fetchRole}>click me for role </button>
        <br/>
      <button onClick={fetchAllRole}>click me for given all rolse </button>

    </div>
  );
};

export default LoginPage;
