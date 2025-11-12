import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import QRCode from "qrcode"; // ✅ FIXED: Added this import
import { AuthContext } from "../context/authContext";
import LinksList from "./LinksList";
import Loader from "./ui/Loader";

const FilterLinksPage = () => {
  const { sort } = useParams();
  const { user } = useContext(AuthContext);

  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [activeLoading, setActiveLoading] = useState(null);
  const [passwordChangeLoading, setPasswordChangeLoading] = useState(null);


  useEffect(() => {
    const fetchFilteredLinks = async () => {
      if (!user || !sort) return;

      setLoading(true);
      setMessage("");

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/filter/${sort}`,
          {
            withCredentials: true,
          }
        );
        setLinks(res.data.results || []);
      } catch (err) {
        setLinks([]);
        setMessage(err.response?.data?.message || "No URLs found.");
      } finally {
        setTimeout(() => setLoading(false), 1000);
      }
    };

    fetchFilteredLinks();
  }, [user, sort]);


  const handleDelete = async (slugName) => {
    if (!window.confirm("Are you sure you want to delete this link?")) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/delete/${slugName}`,
        {
          withCredentials: true,
        }
      );
      setLinks((prev) => prev.filter((link) => link.slugName !== slugName));
    } catch {
      alert("Failed to delete the link");
    }
  };


  const handleQRCode = async (shortUrl, slugName) => {
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(shortUrl);
      const link = document.createElement("a");
      link.href = qrCodeDataUrl;
      link.download = `${slugName || "qrcode"}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };


  const handleActiveToggle = async (linkId, slugName) => {
    try {
      setActiveLoading(linkId);
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/short-url/${slugName}`
      );
      const prevIsActiveValue = res.data.result.isActive;

      const postresponse = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/short-url/${linkId}`,
        { isActive: !prevIsActiveValue },
        { withCredentials: true }
      );

      if (postresponse.data.result) {
        alert(`Link status: ${prevIsActiveValue} → ${!prevIsActiveValue}`);
      }

      setLinks((prevLinks) =>
        prevLinks.map((link) =>
          link.slugName === slugName
            ? { ...link, isActive: !link.isActive }
            : link
        )
      );
    } catch (error) {
      console.error(error);
      alert("Error toggling active status: " + error.message);
    } finally {
      setTimeout(() => setActiveLoading(null), 2000);
    }
  };

 
  const handleProtectedToggle = async (linkId, slugName) => {
    try {
      setPasswordChangeLoading(linkId);

      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/short-url/${slugName}`
      );
      const prevProtectedValue = res.data.result.protected;

      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/short-url/${linkId}`,
        { protected: !prevProtectedValue },
        { withCredentials: true }
      );

      setLinks((prevLinks) =>
        prevLinks.map((link) =>
          link.slugName === slugName
            ? { ...link, protected: !link.protected }
            : link
        )
      );
    } catch (error) {
      console.error(error);
      alert("Error toggling protected status: " + error.message);
    } finally {
      setTimeout(() => setPasswordChangeLoading(null), 1000);
    }
  };


  return (
    <div className="min-h-screen p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <h2 className="text-2xl font-semibold text-center mb-6 capitalize">
          {sort} URLs
        </h2>

        {loading && <Loader />}

        {!loading && message && (
          <div className="alert alert-warning text-center">{message}</div>
        )}

        {!loading && links.length > 0 && (
          <LinksList
            links={links}
            handleDelete={handleDelete}
            handleQRCode={handleQRCode}
            handleActiveToggle={handleActiveToggle}
            activeLoading={activeLoading}
            setActiveLoading={setActiveLoading}
            handleProtectedToggle={handleProtectedToggle}
            passwordChangeLoading={passwordChangeLoading}
            setPasswordChangeLoading={setPasswordChangeLoading}
          />
        )}

        {!loading && links.length === 0 && !message && (
          <div className="text-center py-10 text-gray-500">
            No {sort} links found.
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterLinksPage;
