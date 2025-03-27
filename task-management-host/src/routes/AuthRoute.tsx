import { Navigate } from "react-router-dom";
import { JSX, useEffect, useState } from "react";
import axios from "axios";
import PageLoader from "../components/PageLoader";


const APP_API_URL = import.meta.env.VITE_BASE_URL;

interface AuthRouteProps {
  element: JSX.Element;
}

type User = {
  role: string;
};

const AuthRoute: React.FC<AuthRouteProps> = ({ element }) => {
  const [user, setUser] = useState<User | null>();
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
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  if (loading) {
    return <PageLoader />;
  }


    if (user?.role == "admin") return <Navigate to="/admin/task-management" replace />;
    
    if (user?.role == "user") return <Navigate to="/user/dashboard" replace />;
    




  return element;
};

export default AuthRoute;
