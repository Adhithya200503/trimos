import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/authContext";
import QRCode from "qrcode";
import LinksList from "./LinksList";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ShortLinksDashboard = () => {
  const { user } = useContext(AuthContext);
  const [links, setLinks] = useState([]);
  const [tag, setTag] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  // Fetch all URLs created by user
  useEffect(() => {
    const fetchUserLinks = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:3000/short-urls", {
          withCredentials: true,
        });
        setLinks(res.data);
      } catch (err) {
        setMessage(err.response?.data?.message || "Failed to fetch URLs");
      } finally {
        setLoading(false);
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
        `http://localhost:3000/search?tag=${encodeURIComponent(tag)}`,
        { withCredentials: true }
      );
      setLinks(res.data.results);
    } catch (err) {
      setLinks([]);
      setMessage(err.response?.data?.message || "No results found");
    } finally {
      setLoading(false);
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
        `http://localhost:3000/search?date=${encodeURIComponent(date)}`,
        { withCredentials: true }
      );
      setLinks(res.data.results);
      if (res.data.counts === 0) setMessage("No links found for this date.");
    } catch (err) {
      setLinks([]);
      setMessage(err.response?.data?.message || "No results found");
    } finally {
      setLoading(false);
    }
  };

  // Delete link
  const handleDelete = async (slugName) => {
    if (!window.confirm("Are you sure you want to delete this link?")) return;
    try {
      await axios.delete(`http://localhost:3000/delete/${slugName}`, {
        withCredentials: true,
      });
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
            <button type="submit" className="btn btn-primary">
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
            <button type="submit" className="btn btn-secondary">
              Filter
            </button>
          </form>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-10">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
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
