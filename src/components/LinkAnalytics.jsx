import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import BrowserStatsTable from "./analytics-component/BrowserStatsTable";

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
    <div>
      <BrowserStatsTable browserStats={url.browserStats} />
    </div>
  );
};

export default LinkAnalytics;
