// import React, { Suspense } from "react";

// // Lazy load the remote component
// const RemoteButton = React.lazy(() => import("remoteApp/Button"));

// const App: React.FC = () => {
//   return (
//     <div>
//       <h1>Host Application</h1>
//       <Suspense fallback={<p>Loading Remote Button...</p>}>
//         <RemoteButton />
//       </Suspense>
//     </div>
//   );
// };

// export default App;

// !

import { BrowserRouter as Router } from "react-router-dom";
import RoutesConfig from "./routes/RoutesConfig";
  import { ToastContainer } from "react-toastify";

const App: React.FC = () => {
  return (
    <Router>
      <ToastContainer />
      <RoutesConfig />
    </Router>
  );
};

export default App;
