import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Report = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);

  useEffect(() => {
    // Mock API call
    setTimeout(() => {
      setReport({
        problem: "Long waiting time in government hospitals",
        legitimacy: "YES",
        confidence: 87,
        discrepancies: [
          "Manual patient registration",
          "No appointment scheduling",
          "Poor queue management",
        ],
        ideas: [
          {
            title: "Smart Hospital Queue App",
            description:
              "An app that allows patients to book slots and receive live queue updates.",
          },
          {
            title: "AI-Based Patient Flow System",
            description:
              "AI predicts rush hours and optimizes doctor allocation.",
          },
        ],
      });
      setLoading(false);
    }, 800);
  }, [id]);

  if (loading) {
  return (
    <div className="flex justify-center items-center h-[60vh]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-300">Generating report...</p>
      </div>
    </div>
  );
}


  return (
    <div className="max-w-5xl mx-auto p-8 space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Problem Analysis Report</h1>
        <p className="text-gray-200">{report.problem}</p>
      </div>

      {/* Legitimacy */}
      <div className="flex gap-6">
        <div className="bg-green-100 text-green-800 px-6 py-4 rounded-lg w-fit">
          <p className="text-sm">Legitimacy</p>
          <p className="text-gray-200">{report.legitimacy}</p>
        </div>

        <div className="bg-blue-100 text-blue-800 px-6 py-4 rounded-lg w-fit">
          <p className="text-sm">Confidence Score</p>
          <p className="text-gray-200">{report.confidence}%</p>
        </div>
      </div>

      {/* Discrepancies */}
      <div>
        <h2 className="text-xl font-semibold mb-3">
          Gaps in Current System
        </h2>
        <ul className="list-disc ml-6 space-y-2">
          {report.discrepancies.map((item, i) => (
            <li key={i} className="text-gray-200">
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Startup Ideas */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Potential Startup Ideas
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {report.ideas.map((idea, i) => (
            <div
              key={i}
              className="border rounded-lg p-5 shadow-sm hover:shadow-md transition"
            >
              <h3 className="font-bold mb-2">{idea.title}</h3>
              <p className="text-gray-200">{idea.description}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Report;
