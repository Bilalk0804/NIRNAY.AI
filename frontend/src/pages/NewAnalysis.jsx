import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const NewAnalysis = () => {
  const [problem, setProblem] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!problem.trim()) return;

    setLoading(true);

    // Simulate backend processing
    setTimeout(() => {
      setLoading(false);
      navigate("/progress");
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">
        Create New Analysis
      </h1>

      <textarea
        className="w-full min-h-[160px] p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Describe the real-world problem you want to analyze..."
        value={problem}
        onChange={(e) => setProblem(e.target.value)}
        disabled={loading}
      />

      <button
        onClick={handleSubmit}
        disabled={loading || !problem.trim()}
        className={`mt-6 px-6 py-3 rounded-lg text-white transition ${
          loading || !problem.trim()
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Analyzing..." : "Generate Report"}
      </button>
    </div>
  );
};

export default NewAnalysis;

