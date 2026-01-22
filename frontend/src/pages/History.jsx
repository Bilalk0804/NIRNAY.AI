import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const History = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    // Mock history data
    setTimeout(() => {
      setReports([
        {
          id: 1,
          title: "Hospital waiting time issue",
          date: "20 Jan 2026",
          legitimacy: "YES",
        },
        {
          id: 2,
          title: "Traffic congestion near colleges",
          date: "18 Jan 2026",
          legitimacy: "YES",
        },
        {
          id: 3,
          title: "Manual attendance system",
          date: "15 Jan 2026",
          legitimacy: "NO",
        },
      ]);
    }, 400);
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-8">

      <h1 className="text-3xl font-bold mb-6">
        Analysis History
      </h1>

      <div className="space-y-4">
        {reports.map((report) => (
          <div
            key={report.id}
            className="flex justify-between items-center border border-gray-700 bg-gray-800 rounded-lg p-5 shadow-sm hover:shadow-md transition"
          >
            <div>
              <h3 className="font-semibold text-lg">
                {report.title}
              </h3>
              <p className="text-sm text-gray-400">
                {report.date}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <span
                className={`px-3 py-1 text-sm rounded-full ${
                  report.legitimacy === "YES"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {report.legitimacy}
              </span>

              <Link to={`/report/${report.id}`}>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                  View Report
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default History;
