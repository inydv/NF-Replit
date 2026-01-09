// REACT AND REACT ROUTER DOM
// import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

// CUSTOM IMPORTS
import App from "./App.jsx";
import { UserProvider } from "./Context/User.Context.jsx";
import { AlertProvider } from "./Context/Alert.Context.jsx";

// IMPORT STYLES
import "./index.css";
import "./Styles/LazyLoading.Style.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <BrowserRouter>
    <UserProvider>
      <AlertProvider>
        <App />
      </AlertProvider>
    </UserProvider>
  </BrowserRouter>
  // </StrictMode>
);
