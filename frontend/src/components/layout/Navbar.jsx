import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="flex justify-between items-center p-4 bg-gray-800 border-b border-gray-700">

      <div>
        <Link to="/"><h2 style={{ margin: 0 }}>NIRNAY.AI</h2></Link>
      </div>

      <div style={{ display: "flex", gap: "20px" }}>
        <Link className="text-slate-200 hover:text-white" to="/new-analysis">New Analysis</Link>
        <Link className="text-slate-200 hover:text-white" to="/history">History</Link>
      </div>
    </div>
  );
};

export default Navbar;
