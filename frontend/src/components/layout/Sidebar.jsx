import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-56 h-screen bg-gray-800 p-5 border-r border-gray-700">

      <Link to="/"><h3 className="text-white">NIRNAY.AI</h3></Link>

      <div style={{ marginTop: "30px" }}>
        <Link to="/new-analysis">New Analysis</Link>
      </div>

      <div style={{ marginTop: "15px" }}>
        <Link to="/history">History</Link>
      </div>

    </div>
  );
};

export default Sidebar;
