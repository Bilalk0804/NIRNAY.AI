import React, { useState } from "react";

const NewAnalysis = () => {
  const [problem, setProblem] = useState("");

  const handleSubmit = () => {
    console.log("User Problem:", problem);
    // Later we will call backend API here
  };

  return (
    <div style={{ padding: "20px" }}>

      <h2>Create New Analysis</h2>
      <h2 className="text-red-500 text-3xl">Tailwind Test</h2>


      <textarea
        rows="6"
        cols="70"
        placeholder="Describe the real-world problem..."
        value={problem}
        onChange={(e) => setProblem(e.target.value)}
      />

      <br /><br />

      <button onClick={handleSubmit}>
        Generate Report
      </button>
    </div>
  );
};

export default NewAnalysis;
