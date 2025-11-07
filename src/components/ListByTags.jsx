import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import { TagIcon, ChevronDown } from "lucide-react";
import LinksList from "./LinksList";
import QRCode from "qrcode";
import { LuRefreshCw } from "react-icons/lu";

const ListByTags = () => {
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [urls, setUrls] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeLoading, setActiveLoading] = useState(null);
  const [passwordChangeLoading, setPasswordChangeLoading] = useState(null);
  const { user } = useContext(AuthContext);

  const handleTagToggle = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  useEffect(() => {
    async function getMatchedUrls() {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/matched-urls`,
        { tagsList: selectedTags },
        { withCredentials: true }
      );
      setUrls(res.data.urls);
    }
    getMatchedUrls();
  }, [selectedTags]);

  const handleDelete = async (slugName) => {
    if (!window.confirm("Are you sure you want to delete this link?")) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/delete/${slugName}`,
        {
          withCredentials: true,
        }
      );
      setUrls((prev) => prev.filter((link) => link.slugName !== slugName));
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
    console.log("triggered handle active field");
    try {
      setActiveLoading(linkId);
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/short-url/${slugName}`
      );
      console.log("previous", res.data);
      const prevIsActiveValue = res.data.result.isActive;
      console.log("previous_val", prevIsActiveValue);

      // Toggle value
      const postresponse = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/short-url/${linkId}`,
        { isActive: !prevIsActiveValue },
        { withCredentials: true }
      );

      if (postresponse.data.result) {
        alert(`Link status: ${prevIsActiveValue} → ${!prevIsActiveValue}`);
      }
      setUrls((prevUrls) =>
        prevUrls.map((link) =>
          link.slugName === slugName
            ? { ...link, isActive: !link.isActive }
            : link
        )
      );
      console.log("after toggling", postresponse.data);
    } catch (error) {
      console.error(error);
      alert("Error toggling active status: " + error.message);
    } finally {
      setTimeout(() => {
        setActiveLoading(null);
      }, 2000);
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

      setUrls((prevUrls) =>
        prevUrls.map((link) =>
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

  useEffect(() => {
    async function getTags() {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/tags`, {
        withCredentials: true,
      });
      setTags(res.data.tags);
    }
    getTags();
  }, [user]);

  return (
    <div className="flex flex-col lg:flex-row p-4 lg:p-6 gap-4 w-full lg:w-[80vw] mx-auto">
      {/* Mobile Dropdown */}
      <div className="block lg:hidden mb-4">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center justify-between w-full bg-gray-100 px-4 py-2 rounded-md text-sm font-medium shadow-sm hover:bg-gray-200"
        >
          <span className="flex items-center gap-2">
            <TagIcon size={16} /> Filter by Tags
          </span>
          <ChevronDown
            size={18}
            className={`transition-transform duration-200 ${
              showDropdown ? "rotate-180" : ""
            }`}
          />
        </button>

        {showDropdown && (
          <div className="mt-2 bg-white border border-gray-300 rounded-md shadow-md p-3">
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {tags.map((tag, idx) => (
                <li key={idx} className="flex justify-between items-center">
                  <span className="flex items-center gap-1 text-xs sm:text-sm">
                    <TagIcon size={13} className="text-gray-500" />
                    {tag}
                  </span>
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(tag)}
                    onChange={() => handleTagToggle(tag)}
                    className="checkbox checkbox-xs checkbox-primary"
                  />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Sidebar for large screens */}
      <div className="hidden lg:block tag-filter w-[200px] border-r-2 border-gray-300 min-h-[80vh]">
        <ul className="list">
          <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">Tags</li>
          {tags.map((tag, idx) => (
            <li className="list-row" key={idx}>
              <div className="flex justify-between items-center w-[150px]">
                <span className="flex items-center gap-2 text-sm font-medium">
                  <TagIcon size={15} />
                  {tag}
                </span>
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag)}
                  onChange={() => handleTagToggle(tag)}
                  className="checkbox checkbox-xs checkbox-primary"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* URL list */}
      <div className="flex-1 flex flex-col items-center min-h-[60vh] lg:min-h-[80vh]">
        {urls.length !== 0 ? (
          <div className="w-full sm:w-[90%] lg:w-[800px]">
            <LinksList
              links={urls}
              handleDelete={handleDelete}
              handleQRCode={handleQRCode}
              handleActiveToggle={handleActiveToggle}
              activeLoading={activeLoading}
              setActiveLoading={setActiveLoading}
              handleProtectedToggle={handleProtectedToggle}
              passwordChangeLoading={passwordChangeLoading}
              setPasswordChangeLoading={setPasswordChangeLoading}
            />
          </div>
        ) : (
          <p className="text-center mt-10 text-sm sm:text-base text-gray-500">
            No URL Found
          </p>
        )}
      </div>
    </div>
  );
};

export default ListByTags;
