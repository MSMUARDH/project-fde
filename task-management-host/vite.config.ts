import { defineConfig } from "vite";
import federation from "@originjs/vite-plugin-federation";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "app",
      remotes: {
        remoteApp: "http://localhost:5001/assets/remoteEntry.js",
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

// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import { federation } from "@module-federation/vite";

// export default defineConfig({
//   plugins: [
//     react(),
//     federation({
//       name: "host",
//       remotes: {
//         remoteApp: "http://localhost:5173/remoteEntry.js", // Load the remote module
//       },
//       shared: {
//         react: { singleton: true, requiredVersion: "^18.0.0" },
//         "react-dom": { singleton: true, requiredVersion: "^18.0.0" },
//       },
//     }),
//   ],
//   build: {
//     target: "esnext",
//     minify: false,
//     cssCodeSplit: false,
//   },
// });
