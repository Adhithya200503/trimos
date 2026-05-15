import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import { NavLink } from "react-router-dom";
import {
  Unlock,
  Lock,
  Calendar,
  MousePointerClick,
  Activity,
  Globe,
  Share2,
  Info
} from "lucide-react";
import { CiLocationOn } from "react-icons/ci";
import { FaCircle, FaMicrosoft } from "react-icons/fa";
import { CgBrowser } from "react-icons/cg";
import { CiEdit } from "react-icons/ci";
import { IoMdLink } from "react-icons/io";

import LinkStatsPDF from "./analytics-component/LinkStatsPdf";
import RegionStatsTable from "./analytics-component/LocationStats";
import BrowserStatsTable from "./analytics-component/BrowserStatsTable";
import OperatingSystemStats from "./analytics-component/OperatingSystemStats";

const AnalyticsPage = () => {
  const [urls, setUrls] = useState([]);
  const [currentAnalyticsPage, setCurrentAnalyticsPage] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    async function getUserLinks() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/short-urls`,
          { withCredentials: true }
        );
        setUrls(res.data);
        if (res.data && res.data.length > 0) {
          setCurrentAnalyticsPage(res.data[0]);
        }
      } catch (error) {
        console.error("Error fetching URLs", error);
      }
    }

    getUserLinks();
  }, [user]);

  const handleSelect = (e) => {
    const selectedUrl = urls.find((url) => e.target.value === url.slugName);
    setCurrentAnalyticsPage(selectedUrl);
  };

  if (!currentAnalyticsPage) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const isClickEmpty = currentAnalyticsPage.clicks === 0;

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-base-100 p-6 rounded-xl shadow-sm border border-base-300 gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Activity className="text-primary" />
            Analytics Dashboard
          </h1>
          <p className="text-sm text-base-content/70 mt-1">
            Track clicks, locations, and devices for your short links.
          </p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={currentAnalyticsPage.slugName}
            className="select select-bordered w-full md:w-64"
            onChange={handleSelect}
          >
            {urls.map((url, idx) => (
              <option value={url.slugName} key={idx}>
                {url.slugName}
              </option>
            ))}
          </select>
          {!isClickEmpty && (
             <LinkStatsPDF linkData={currentAnalyticsPage} />
          )}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat bg-base-100 rounded-xl shadow-sm border border-base-300">
          <div className="stat-figure text-primary">
            <MousePointerClick size={32} />
          </div>
          <div className="stat-title">Total Clicks</div>
          <div className="stat-value text-primary">{currentAnalyticsPage.clicks}</div>
          <div className="stat-desc">Lifetime clicks</div>
        </div>
        
        <div className="stat bg-base-100 rounded-xl shadow-sm border border-base-300">
          <div className="stat-figure text-secondary">
             {currentAnalyticsPage.isActive ? (
                <FaCircle size={28} className="text-success" />
              ) : (
                <FaCircle size={28} className="text-error" />
              )}
          </div>
          <div className="stat-title">Status</div>
          <div className="stat-value text-lg mt-2">
            {currentAnalyticsPage.isActive ? "Active" : "Inactive"}
          </div>
          <div className="stat-desc text-xs mt-1">Link is currently {currentAnalyticsPage.isActive ? "working" : "disabled"}</div>
        </div>

        <div className="stat bg-base-100 rounded-xl shadow-sm border border-base-300">
          <div className="stat-figure text-accent">
            {currentAnalyticsPage.protected ? (
              <Lock size={32} />
            ) : (
              <Unlock size={32} />
            )}
          </div>
          <div className="stat-title">Protection</div>
          <div className="stat-value text-lg mt-2">
             {currentAnalyticsPage.protected ? "Password" : "Public"}
          </div>
          <div className="stat-desc text-xs mt-1">Access requirement</div>
        </div>

        <div className="stat bg-base-100 rounded-xl shadow-sm border border-base-300">
          <div className="stat-figure text-neutral">
            <Calendar size={32} />
          </div>
          <div className="stat-title">Created At</div>
          <div className="stat-value text-lg mt-2">
            {new Date(currentAnalyticsPage.createdAt).toLocaleDateString()}
          </div>
          <div className="stat-desc text-xs mt-1">Link generation date</div>
        </div>
      </div>

      {/* Link Information Panel */}
      <div className="bg-base-100 p-6 rounded-xl shadow-sm border border-base-300">
        <div className="flex justify-between items-center mb-4 border-b border-base-300 pb-2">
           <h2 className="text-lg font-semibold flex items-center gap-2">
             <IoMdLink size={20} className="text-primary"/> Link Details
           </h2>
           <NavLink to={`/link-details/${currentAnalyticsPage.slugName}`} className="btn btn-sm btn-outline">
              <CiEdit size={16} /> Edit Link
           </NavLink>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="flex flex-col gap-1">
             <span className="text-xs font-semibold text-base-content/60 uppercase">Short URL</span>
             <a href={currentAnalyticsPage.shortUrl} target="_blank" rel="noreferrer" className="text-primary font-medium hover:underline truncate">
               {currentAnalyticsPage.shortUrl}
             </a>
           </div>
           <div className="flex flex-col gap-1 md:col-span-1">
             <span className="text-xs font-semibold text-base-content/60 uppercase">Destination URL</span>
             <a href={currentAnalyticsPage.destinationUrl} target="_blank" rel="noreferrer" className="text-base-content hover:underline truncate" title={currentAnalyticsPage.destinationUrl}>
               {currentAnalyticsPage.destinationUrl}
             </a>
           </div>
        </div>
      </div>

      {/* Advanced Metrics / Empty State */}
      {isClickEmpty ? (
        <div className="flex flex-col items-center justify-center bg-base-100 p-12 rounded-xl shadow-sm border border-base-300 text-center gap-4 mt-2">
           <div className="bg-base-200 p-6 rounded-full">
              <Info size={48} className="text-primary opacity-80" />
           </div>
           <h3 className="text-2xl font-bold mt-2">No Clicks Yet!</h3>
           <p className="text-base-content/70 max-w-md">
             This link hasn't received any clicks. Share it with your audience to start gathering insights on regions, browsers, and devices.
           </p>
           <button 
             className="btn btn-primary mt-2" 
             onClick={() => navigator.clipboard.writeText(currentAnalyticsPage.shortUrl)}
           >
             <Share2 size={18}/> Copy Short URL
           </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-2">
           {/* Region Analytics */}
           <div className="bg-base-100 rounded-xl shadow-sm border border-base-300 flex flex-col h-full">
             <div className="p-4 border-b border-base-300 flex items-center gap-3">
               <div className="bg-primary/10 p-2 rounded-lg text-primary">
                 <CiLocationOn size={24} />
               </div>
               <h3 className="text-lg font-semibold">Region Wise Analytics</h3>
             </div>
             <div className="p-4 overflow-auto flex-1">
               <RegionStatsTable regionStats={currentAnalyticsPage.stats} />
             </div>
           </div>

           {/* Device Analytics container */}
           <div className="flex flex-col gap-6">
             {/* Browser Analytics */}
             <div className="bg-base-100 rounded-xl shadow-sm border border-base-300">
               <div className="p-4 border-b border-base-300 flex items-center gap-3">
                 <div className="bg-secondary/10 p-2 rounded-lg text-secondary">
                   <CgBrowser size={24} />
                 </div>
                 <h3 className="text-lg font-semibold">Browser Analytics</h3>
               </div>
               <div className="p-4 overflow-auto">
                 <BrowserStatsTable browserStats={currentAnalyticsPage.browserStats} />
               </div>
             </div>

             {/* OS Analytics */}
             <div className="bg-base-100 rounded-xl shadow-sm border border-base-300">
               <div className="p-4 border-b border-base-300 flex items-center gap-3">
                 <div className="bg-accent/10 p-2 rounded-lg text-accent">
                   <FaMicrosoft size={24} />
                 </div>
                 <h3 className="text-lg font-semibold">OS Analytics</h3>
               </div>
               <div className="p-4 overflow-auto">
                 <OperatingSystemStats OsStats={currentAnalyticsPage.osStats} />
               </div>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;