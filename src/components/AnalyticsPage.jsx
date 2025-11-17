import axios from "axios";
import React from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { AuthContext } from "../context/authContext";
import { IoMdLink } from "react-icons/io";
import { Unlock } from "lucide-react";
import { CiLocationOn, CiLock } from "react-icons/ci";
import { FaCircle, FaMicrosoft } from "react-icons/fa";
import LinkStatsPDF from "./analytics-component/LinkStatsPdf";
import RegionStatsTable from "./analytics-component/LocationStats";
import BrowserStatsTable from "./analytics-component/BrowserStatsTable";
import OperatingSystemStats from "./analytics-component/OperatingSystemStats";
import { CgBrowser } from "react-icons/cg";
import { CiEdit } from "react-icons/ci";
import { NavLink } from "react-router-dom";

const AnalyticsPage = () => {
  const [urls, setUrls] = useState([]);
  const [currentAnalyticsPage, setCurrentAnalyticsPage] = useState({});
  const { user } = useContext(AuthContext);
  useEffect(() => {
    async function getUserLinks() {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/short-urls`
      );
      setUrls(res.data);
      setCurrentAnalyticsPage(res.data[0]);
      console.log("url", res);
    }

    getUserLinks();
  }, [user]);

  const handleSelect = (e) => {
    const selectedUrl = urls.filter((url) => e.target.value === url.slugName);
    setCurrentAnalyticsPage(selectedUrl[0]);
    console.log(selectedUrl[0]);
  };
  return (
    <div>
      <select
        defaultValue="Pick a color"
        className="select"
        onChange={(e) => handleSelect(e)}
      >
        <option disabled={true}>select a slugname</option>
        {urls.map((url, idx) => {
          return (
            <option value={url.slugName} key={idx}>
              {url.slugName}
            </option>
          );
        })}
      </select>

      <div className="url-Data flex flex-col md:flex-row w-full justify-between gap-4">
        <ul className="mt-6 list bg-base-100 rounded-sm flex-1">
          <li className="p-4 pb-2 text-xs opacity-60 tracking-wide flex items-center gap-2.5">
            <div></div>
            <IoMdLink size={20} />
            URL
            <NavLink to={`/link-details/${currentAnalyticsPage.slugName}`}>
              <span className="flex items-center gap-2.5 hover:text-blue-800 dark:hover:text-white">
                <CiEdit size={20} />
                Edit
              </span>
            </NavLink>
          </li>

          <li className="list-row">
            <span className="font-bold">Slug Name</span>
            <span>{currentAnalyticsPage.slugName}</span>
          </li>
          <li className="list-row">
            <span className="font-bold">Short Url</span>
            <span>{currentAnalyticsPage.shortUrl}</span>
          </li>
          <li className="list-row">
            <span className="font-bold">Destination Url</span>
            <span>{currentAnalyticsPage.destinationUrl}</span>
          </li>
        </ul>
        <ul className="mt-6 list bg-base-100 rounded-sm flex-1">
          <li className="list-row">
            <span className="font-bold">Domaim Name</span>
            <span>{currentAnalyticsPage.domain}</span>
          </li>
          <li className="list-row">
            <span className="font-bold">Clicks</span>
            <span>{currentAnalyticsPage.clicks}</span>
          </li>
          <li className="list-row">
            <div className="flex gap-2.5 items-center">
              <span>
                {currentAnalyticsPage.protected ? (
                  <CiLock size={14} />
                ) : (
                  <Unlock size={14} />
                )}
              </span>
              <span>
                {currentAnalyticsPage.protected ? "Protected" : "Not Protected"}
              </span>
            </div>
            <div className="flex gap-2.5 items-center">
              <span>
                {currentAnalyticsPage.isActive ? (
                  <FaCircle size={14} className="text-green-500" />
                ) : (
                  <FaCircle size={14} className="text-red-500" />
                )}
              </span>
              <span>
                {currentAnalyticsPage.protected
                  ? "Active Link"
                  : "InActive Link"}
              </span>
            </div>
          </li>
          <li className="list-row">
            <span className="font-bold">Created At</span>
            <span>{currentAnalyticsPage.createdAt}</span>
          </li>
        </ul>
      </div>

      {currentAnalyticsPage.clicks === 0 ? (
        <p>Not a Single click occurred</p>
      ) : (
        <div className="relative mt-4">
          <div className="flex justify-end">
            <LinkStatsPDF linkData={currentAnalyticsPage} />
          </div>
          <div className="flex flex-col gap-12">
            <p className="text-2xl mb-4 flex gap-4 items-center">
              <CiLocationOn size={24} />
              Region Wise Analytics
            </p>
            <RegionStatsTable regionStats={currentAnalyticsPage.stats} />
            <p className="text-2xl mb-4 flex gap-4 items-center">
              <CgBrowser size={24} />
              Browser Analytics
            </p>
            <BrowserStatsTable
              browserStats={currentAnalyticsPage.browserStats}
            />
            <p className="text-2xl mb-4 flex gap-4 items-center">
              <FaMicrosoft size={24} />
              OS Analytics
            </p>
            <OperatingSystemStats OsStats={currentAnalyticsPage.osStats} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;
