import React, { useState, useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#9c27b0",
  "#e91e63",
];

const RegionStatsTable = ({ regionStats }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCountry, setFilterCountry] = useState("");

  const statsArray = useMemo(() => {
    if (!regionStats) return [];
    return Object.entries(regionStats).map(([country, data]) => ({
      country,
      ...data,
    }));
  }, [regionStats]);

  const countries = useMemo(() => {
    return regionStats ? Object.keys(regionStats) : [];
  }, [regionStats]);

  const filteredStats = useMemo(() => {
    return statsArray.filter(({ country, cities }) => {
      const matchesCountry =
        !filterCountry || country.toLowerCase() === filterCountry.toLowerCase();
      const matchesSearch =
        country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        Object.keys(cities)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      return matchesCountry && matchesSearch;
    });
  }, [statsArray, searchTerm, filterCountry]);

  const pieData = useMemo(() => {
    if (filterCountry && filteredStats.length === 1) {
      // If a country is filtered, display city-level stats
      const { cities } = filteredStats[0];
      return Object.entries(cities).map(([city, count]) => ({
        name: city,
        value: count,
      }));
    }
    // Otherwise, show country-level stats
    return filteredStats.map(({ country, count }) => ({
      name: country,
      value: count,
    }));
  }, [filteredStats, filterCountry]);

  if (!regionStats || Object.keys(regionStats).length === 0) {
    return <p>No region data available.</p>;
  }

  return (
    <div className="bg-white p-8 rounded-md">
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by country or city"
          className="border p-4 rounded-none flex-grow"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="border p-2 rounded-md"
          value={filterCountry}
          onChange={(e) => setFilterCountry(e.target.value)}
        >
          <option value="">All Countries</option>
          {countries.map((country, idx) => (
            <option key={idx} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <table className="min-w-full table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Clicks</th>
          </tr>
        </thead>
        <tbody>
          {filteredStats.map(({ country, cities }, index) => {
            if (filterCountry) {
              return Object.entries(cities).map(([city, count], idx) => (
                <tr key={`${index}-${idx}`}>
                  <td>{city}</td>
                  <td>{count}</td>
                </tr>
              ));
            } else {
              return (
                <tr key={index}>
                  <td>{country}</td>
                  <td>{Object.values(cities).reduce((a, b) => a + b, 0)}</td>
                </tr>
              );
            }
          })}
        </tbody>
      </table>

 
      {pieData.length > 0 && (
        <div className="mt-6 flex justify-center">
          <PieChart width={350} height={350}>
            <Pie
              data={pieData}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={filterCountry ? 120 : 100}
              label
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      )}
    </div>
  );
};

export default RegionStatsTable;
