import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "../api/axios";

export default function PrivateRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("/users/current-user", { withCredentials: true });
        if (res.data.data) setIsAuthenticated(true);
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <p className="text-center mt-10">Checking authentication...</p>;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
}
