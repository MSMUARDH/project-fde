import React, { useEffect } from "react";
// import AdminDashboard from "../../../components/admin/AdminDashboardLayout";
import TaskTable from "../../../components/admin/TaskTable";
import AddButton from "../../../components/AddButton";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../app/store";
import { deleteTask, getAllTask } from "../../../features/task/taskSlice";
import { toast } from "react-toastify";
import PageLoader from "../../../components/PageLoader";

// import { toast } from "react-toastify";

const TaskManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const tasks = useSelector((state: RootState) => state.task.datas);
  const { status } = useSelector((state: RootState) => state.task);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getAllTask());
  }, [dispatch]);

  const handleDelete = (taskId: string) => {
    console.log("taskID", taskId);
    try {
      dispatch(deleteTask(taskId));
      if (status === "succeeded") {
        console.log("Task Deleted Success");
        dispatch(getAllTask());
        dispatch(getAllTask());
        toast.success("ssdsd");
      }
    } catch (error: any) {
      console.log(error);
    }
  };
  return (
    <div>
      { status == "loading" && <PageLoader/>}
      <div>
        <h2 style={{ display: "flex", justifyContent: "center" }}>
          Task Management
        </h2>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            margin: "20px",
          }}
        >
          <div></div>
          <AddButton onClick={() => navigate("/admin/task-management/add-new")}>
            Add new Task
          </AddButton>
        </div>
        <TaskTable tasks={tasks} onDelete={handleDelete} />
      </div>
    </div>
  );
};

export default TaskManagementPage;
