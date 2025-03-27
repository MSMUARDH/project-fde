

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
