import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Progress = () => {
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          navigate("/report/1");
          return 100;
        }
        return prev + 5;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [navigate]);

  const remainingSeconds = Math.max(0, Math.ceil((100 - progress) / 10));

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-md bg-[#1f2937] p-8 rounded-lg shadow">

        <h1 className="text-2xl font-bold mb-4 text-center">
          Analyzing Problem
        </h1>

        <p className="text-center text-slate-300 mb-6">
          Our AI agents are working on your idea
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
          <div
            className="bg-blue-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-between text-sm text-slate-300">
          <span>{progress}% completed</span>
          <span>~ {remainingSeconds}s remaining</span>
        </div>

      </div>
    </div>
  );
};

export default Progress;
