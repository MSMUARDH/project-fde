import React, { Suspense  }from "react";
import AdminDashboard from "../../../components/admin/AdminDashboardLayout";

import PageLoader from "../../../components/PageLoader";

const RemoteTaskManagementPage = React.lazy(
  () => import("remoteApp/TaskManagement")
);

const TaskManagementPage: React.FC = () => {
  return (
    <div>
      <AdminDashboard>
        <Suspense fallback={<PageLoader/>}>
          <RemoteTaskManagementPage />
        </Suspense>
      </AdminDashboard>
    </div>
  );
};

export default TaskManagementPage;
