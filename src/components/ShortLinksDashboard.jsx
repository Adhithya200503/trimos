import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/authContext";
import QRCode from "qrcode";
import LinksList from "./LinksList";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Loader from "./ui/Loader";

const ShortLinksDashboard = () => {
  const { user } = useContext(AuthContext);
  const [links, setLinks] = useState([]);
  const [tag, setTag] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [activeLoading, setActiveLoading] = useState(null);
  const [passwordChangeLoading, setPasswordChangeLoading] = useState(null);
  const navigate = useNavigate();
  // Fetch all URLs created by user
  useEffect(() => {
    const fetchUserLinks = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/short-urls`,
          {
            withCredentials: true,
          }
        );
        setLinks(res.data);
      } catch (err) {
        setMessage(err.response?.data?.message || "Failed to fetch URLs");
      } finally {
        setTimeout(()=>{
          setLoading(false);
        },1000)
      }
    };
    fetchUserLinks();
  }, [user]);

  // Search URLs by tag
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!tag.trim()) {
      setMessage("Please enter a tag to search.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/search?tag=${encodeURIComponent(
          tag
        )}`,
        { withCredentials: true }
      );
      setLinks(res.data.results);
    } catch (err) {
      setLinks([]);
      setMessage(err.response?.data?.message || "No results found");
    } finally {
      setTimeout(()=>{
        setLoading(false);
      },1000)
    }
  };

  // Filter URLs by Date
  const handleDateFilter = async (e) => {
    e.preventDefault();
    if (!date) {
      setMessage("Please select a date.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/search?date=${encodeURIComponent(
          date
        )}`,
        { withCredentials: true }
      );
      setLinks(res.data.results);
      if (res.data.counts === 0) setMessage("No links found for this date.");
    } catch (err) {
      setLinks([]);
      setMessage(err.response?.data?.message || "No results found");
    } finally {
      setTimeout(()=>{
        setLoading(false);
      },1000)
    }
  };

  // Delete link
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
      setLinks((prevLinks) =>
        prevLinks.map((link) =>
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
        <h2 className="text-2xl font-semibold text-center mb-6">
          Your Short Links
        </h2>

        {/* Search & Filter Form */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <button className="btn" onClick={() => navigate("/")}>
            <Plus />
          </button>
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-3 w-full sm:w-2/3"
          >
            <input
              type="text"
              placeholder="Search by tag..."
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="input input-bordered w-full sm:w-1/2"
            />
            <button type="submit" className="btn bg-blue-500 text-white rounded-sm ">
              Search
            </button>
          </form>

          {/* Date Filter */}
          <form
            onSubmit={handleDateFilter}
            className="flex flex-col sm:flex-row gap-3 items-center"
          >
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input input-bordered w-35"
              />
            </div>
            <button type="submit" className="btn bg-blue-500 text-white">
              Filter
            </button>
          </form>
        </div>

        {/* Loading */}
        { loading && (
          <Loader />
        )}

        {/* Message */}
        {!loading && message && (
          <div className="alert alert-warning text-center">{message}</div>
        )}

        {/* Card Layout */}
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

        {/* Empty State */}
        {!loading && links.length === 0 && !message && (
          <div className="text-center py-10 text-gray-500">
            You haven’t created any short links yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default ShortLinksDashboard;
