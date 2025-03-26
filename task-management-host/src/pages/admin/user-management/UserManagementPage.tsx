import React from "react";
import AdminDashboard from "../../../components/admin/AdminDashboardLayout";
import UserTable from "../../../components/admin/UserTable";
import AddButton from "../../../components/AddButton";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../app/store";
import { useEffect } from "react";
import { deleteUser, getAlluser } from "../../../features/user/userSlice";
import { toast } from "react-toastify";
import PageLoader from "../../../components/PageLoader";

const UserManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const users = useSelector((state: RootState) => state.user.datas);
  const { status} = useSelector((state: RootState) => state.user);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getAlluser());
  }, [dispatch]);

  const handleDelete = (userId: string) => {
    dispatch(deleteUser(userId));

    if (status === "succeeded") {
      toast.success("User Deleted Success");
    }
    dispatch(getAlluser());


  };

  return (
    <AdminDashboard>
      {status == "loading" && <PageLoader />}
      <h2 style={{ display: "flex", justifyContent: "center" }}>
        User Management
      </h2>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          margin: "20px",
        }}
      >
        <div></div>
        <AddButton onClick={() => navigate("/admin/user-management/add-new")}>
          Add new user
        </AddButton>
      </div>

      <UserTable users={users} onDelete={handleDelete} />
    </AdminDashboard>
  );
};

export default UserManagementPage;
