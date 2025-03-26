import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "remote_app",
      filename: "remoteEntry.js",
      exposes: {
        "./TaskManagement":
          "./src/pages/admin/task-management/TaskManagementPage.tsx",
        "./AddTask": "./src/pages/admin/task-management/AddNewTaskPage.tsx",
        "./EditTask": "./src/pages/admin/task-management/EditTaskPage.tsx",
      },
      shared: [
        "react",
        "react-dom",
        "react-router-dom",
        "@reduxjs/toolkit",
        "react-redux",
      ],
    }),
  ],
  build: {
    modulePreload: false,
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
});
