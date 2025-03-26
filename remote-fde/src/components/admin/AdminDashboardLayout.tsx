import React, { ReactNode } from "react";
import Navbar from "../Navbar";



type AdminDashboardProps = {
  children?: ReactNode;
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ children }) => {
  return (
    <div>
      <Navbar />
      <div style={{ margin: "20px" }}>{children}</div>
    </div>
  );
};

export default AdminDashboard;
