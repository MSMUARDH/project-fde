import React, { useEffect } from "react";
import AssignTaskTable from "../../components/user/AssignTaskTable";
import UserNavbar from "../../components/user/UserNavbar";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { getAllUserTask } from "../../features/userTasksSlice";

const UserDashBoard: React.FC = () => {
  const navigate = useNavigate();
  const userTasks = useSelector((state: RootState) => state.usertask.datas);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getAllUserTask());
  }, []);



  console.log("userTasks", userTasks);

  return (
    <div style={{ margin: "20px" }}>
      <UserNavbar />
      <h2 style={{ display: "flex", justifyContent: "center" }}>
        User DashBoard
      </h2>

      <AssignTaskTable userTasks={userTasks} />
    </div>
  );
};

export default UserDashBoard;
