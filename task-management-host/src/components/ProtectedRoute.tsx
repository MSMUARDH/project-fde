import { Navigate } from "react-router-dom";
import { JSX, useEffect, useState } from "react";
import axios from "axios";
import PageLoader from "./PageLoader";

const APP_API_URL = import.meta.env.VITE_BASE_URL;

interface ProtectedRouteProps {
  element: JSX.Element;
  allowedRoles: string[];
}

type User = {
  role: string; 
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  element,
  allowedRoles,
}) => {
  const [user, setUser] = useState<User | null >();
  const [loading, setLoading] = useState(true);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(
        `${APP_API_URL}/api/users/get-user-details`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setUser(response.data.user);
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  if (loading) {
    return <PageLoader/>; 
  }



  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role))
    return <Navigate to="/unauthorized" replace />;

  return element;
};

export default ProtectedRoute;