import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import BrowserStatsTable from "./analytics-component/BrowserStatsTable";
import OperatingSystemStats from "./analytics-component/OperatingSystemStats";
import { CgBrowser } from "react-icons/cg";
import { FaMicrosoft } from "react-icons/fa";
import RegionStatsTable from "./analytics-component/LocationStats";
import { CiLocationOn } from "react-icons/ci";

const LinkAnalytics = () => {
  const [url, setUrl] = useState({});
  const { slugName } = useParams();
  useEffect(() => {
    async function getUrlData() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/short-url/${slugName}`,
          { withCredentials: true }
        );
        setUrl(res.data.result);

        console.log("the url data", res.data.result);
      } catch (error) {
        alert(res.data.error);
      }
    }
    getUrlData();
  }, [slugName]);
  return (
    <div className="relative">
      <div className="flex justify-end">
        <button className="btn btn-primary">Export as Pdf</button>
      </div>
      <div className="flex flex-col gap-12">
        <p className="text-2xl mb-4 flex gap-4 items-center">
          <CiLocationOn size={24} />
          Region Wise Analytics
        </p>
        <RegionStatsTable regionStats={url.stats} />
        <p className="text-2xl mb-4 flex gap-4 items-center">
          <CgBrowser size={24} />
          Browser Analytics
        </p>
        <BrowserStatsTable browserStats={url.browserStats} />
        <p className="text-2xl mb-4 flex gap-4 items-center">
          <FaMicrosoft size={24} />
          OS Analytics
        </p>
        <OperatingSystemStats OsStats={url.osStats} />
      </div>
    </div>
  );
};

export default LinkAnalytics;
