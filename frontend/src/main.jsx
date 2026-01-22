import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <div className="dark bg-gray-900 text-gray-100 min-h-screen">
      <App />
    </div>
  </React.StrictMode>
);
