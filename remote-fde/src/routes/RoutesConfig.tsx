// import { useRoutes, Navigate } from "react-router-dom";

// import Login from "../pages/Login";
// import UserDashboard from "../pages/user/UserDashBoard";
// import Unauthorized from "../pages/Unauthorized";
// import ProtectedRoute from "../components/ProtectedRoute";
// import TaskManagementPage from "../pages/admin/task-management/TaskManagementPage";
// import UserManagementPage from "../pages/admin/user-management/UserManagementPage";
// // import AddNewTaskPage from "../pages/admin/task-management/AddNewTaskPage";
// import AddNewUserPage from "../pages/admin/user-management/AddNewUserPage";
// // import EditTaskPage from "../pages/admin/task-management/EditTaskPage";
// import EditUserPage from "../pages/admin/user-management/EditUserPage";
// import TaskCompletionUpdatePage from "../pages/user/TaskCompletionUpdatePage";
// import PasswordResetPage from "../pages/PasswordResetPage";
// import Home from "../pages/Home";
// import React, { Suspense } from "react";



// const RoutesConfig = () => {
//   return useRoutes([
//     { path: "/", element: <Home /> },
//     { path: "/login", element: <Login /> },
//     { path: "/unauthorized", element: <Unauthorized /> },

//     {
//       path: "/admin/task-management",
//       element: (
//         <ProtectedRoute
//           allowedRoles={["admin"]}
//           element={<TaskManagementPage />}
//         />
//       ),
//     },

//     {
//       path: "/admin/task-management/add-new",
//       element: (
//         <ProtectedRoute allowedRoles={["admin"]} element={<AddNewTaskPage />} />
//       ),
//     },

//     {
//       path: "/admin/task-management/edit-task/:taskId",
//       element: (
//         <ProtectedRoute allowedRoles={["admin"]} element={<EditTaskPage />} />
//       ),
//     },

//     {
//       path: "/admin/user-management",
//       element: (
//         <ProtectedRoute
//           allowedRoles={["admin"]}
//           element={<UserManagementPage />}
//         />
//       ),
//     },
//     {
//       path: "/admin/user-management/add-new",
//       element: (
//         <ProtectedRoute allowedRoles={["admin"]} element={<AddNewUserPage />} />
//       ),
//     },
//     {
//       path: "/admin/user-management/edit-user/:userId",
//       element: (
//         <ProtectedRoute allowedRoles={["admin"]} element={<EditUserPage />} />
//       ),
//     },

//     {
//       path: "/user/dashboard",
//       element: (
//         <ProtectedRoute allowedRoles={["user"]} element={<UserDashboard />} />
//       ),
//     },

//     {
//       path: "/user/update-completion/:taskId",
//       element: (
//         <ProtectedRoute
//           allowedRoles={["user"]}
//           element={<TaskCompletionUpdatePage />}
//         />
//       ),
//     },

//     {
//       path: "/user/verification/:token",
//       element: <PasswordResetPage />,
//     },

//     {
//       path: "/dashboard",
//       element: (
//         <ProtectedRoute
//           allowedRoles={["admin", "user"]}
//           element={<UserDashboard />}
//         />
//       ),
//     },

//     { path: "*", element: <Navigate to="/" replace /> },
//   ]);
// };

// export default RoutesConfig;
