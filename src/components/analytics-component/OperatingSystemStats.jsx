import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#9c27b0", "#e91e63"];
const OperatingSystemStats = ({OsStats}) => {
  if (OsStats === undefined) {
    return <p>Loading stats...</p>;
  }

  const [osStats, setOsStats] = useState(() => Object.entries(OsStats));
  let pieChartStats = [];
  pieChartStats = Object.entries(OsStats).map(([key, val]) => {
    return {
      name: key,
      value: val,
    };
  });
  console.log(OsStats);
  if (osStats.length === 0) {
    return (
      <div className="text-center mt-4">
        <p>No browser statistics available.</p>
      </div>
    );
  }

  function calculatePercentage(browserClicks) {
    let totalClicks = Object.values(OsStats).reduce(
      (acc, num) => acc + num,
      0
    );

    return (
      (totalClicks === 0
        ? "0.00"
        : ((browserClicks / totalClicks) * 100).toFixed(2)) + "%"
    );
  }

  function handleSelectChange(option) {
    let sortedStats = [...osStats];

    if (option === "h") {
      sortedStats.sort((a, b) => b[1] - a[1]);
    } else if (option === "l") {
      sortedStats.sort((a, b) => a[1] - b[1]);
    }

    setOsStats(sortedStats);
  }

  return (
    <div className="flex flex-col sm:flex-row  justify-around bg-white p-4 rounded-md overflow-x-auto">
      <div className="overflow-x-auto w-sm sm:w-md">
        <div className="flex mb-2">
          <select
            className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-0"
            onChange={(e) => handleSelectChange(e.target.value)}
          >
            <option value="">Sort</option>
            <option value="h">High to Low</option>
            <option value="l">Low to High</option>
          </select>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th className="hidden sm:block"></th>
              <th>OS Name</th>
              <th>Total Clicks</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            {osStats.map((data, idx) => {
              return (
                <tr key={data[0]}>
                  <th className="hidden sm:block">{idx + 1}</th>
                  <td>{data[0]}</td>
                  <td>{data[1]}</td>

                  <td>{calculatePercentage(data[1])}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <PieChart width={350} height={350}>
        <Pie
          data={pieChartStats}
          dataKey="value"
          cx="50%"
          cy="50%"
          outerRadius={120}
          label
        >
          {pieChartStats.map((entry, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <div className="mt-4">
            <Legend />
        </div>
      </PieChart>
    </div>
  );
};

export default OperatingSystemStats;
