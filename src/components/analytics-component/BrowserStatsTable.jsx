import React from "react";
import { useState } from "react";

const BrowserStatsTable = ({ browserStats }) => {
    
    // --- Initial data handling and state initialization ---
    if (browserStats === undefined) {
        return <p>Loading stats...</p>;
    }
    
    // Initialize state using Object.entries, converting the object to an array of [key, value] pairs
    // Use an initializer function (()=>{}) for useState to ensure Object.entries is only run once
    const [stats, setStats] = useState(() => Object.entries(browserStats));
    
    // Remove selectedOption state as it was unused
    
    if (stats.length === 0) {
        return (
            <div className="text-center mt-4">
                <p>No browser statistics available.</p>
            </div>
        );
    }
    
    // --- Helper function for percentage calculation ---
    function calculatePercentage(browserClicks) {
        // Calculate total clicks once inside this function for efficiency
        let totalClicks = Object.values(browserStats).reduce(
            (acc, num) => acc + num,
            0
        );

        // Return a formatted percentage string
        return (
            totalClicks === 0
                ? "0.00"
                : ((browserClicks / totalClicks) * 100).toFixed(2)
        ) + "%";
    }

    // --- Event handler for sorting ---
    function handleSelectChange(option) {
        // IMPORTANT: Create a copy of the state array before sorting to avoid mutation
        let sortedStats = [...stats]; 

        if (option === "h") {
            // High to Low (Descending)
            sortedStats.sort((a, b) => b[1] - a[1]);
        } else if (option === "l") {
            // Low to High (Ascending)
            sortedStats.sort((a, b) => a[1] - b[1]);
        }
        
        // Update state with the newly sorted array copy
        setStats(sortedStats);
    }

    return (
        <div>
            <div className="overflow-x-auto w-md">
                <div className="flex justify-end mb-2">
                    <select
                        className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-0"
                        // FIX: Pass the event object 'e' to the change handler
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
                            <th></th>
                            <th>Browser Name</th>
                            <th>Total Clicks</th>
                            <th>Percentage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stats.map((data, idx) => {
                            return (
                                // FIX: Add a unique 'key' prop for list rendering
                                <tr key={data[0]}>
                                    <th>{idx + 1}</th>
                                    <td>{data[0]}</td>
                                    <td>{data[1]}</td>
                                    {/* FIX: Percentage is now formatted inside helper function */}
                                    <td>{calculatePercentage(data[1])}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BrowserStatsTable;