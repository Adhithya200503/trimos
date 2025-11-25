import React, { useContext, useEffect, useState } from "react";
import {
  Mail,
  Calendar,
  Globe,
  ProjectorIcon,
  Lock,
  Trash2,
  Unlock,
} from "lucide-react";
import { AuthContext } from "../context/authContext";
import axios from "axios";
import { FaCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
const UserProfile = () => {
  const { user } = useContext(AuthContext);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [userData, setUserData] = useState(null);
  const [domainName, setDomainName] = useState("");
  const [linkStatusCount, setLinkStatusCount] = useState({
    active: 0,
    inactive: 0,
    protected: 0,
    notprotected: 0,
    totalLinks: 0,
  });
  const [loading, setLoading] = useState(false);
  const [domains, setDomains] = useState([]);
  const navigate = useNavigate();
  // ✅ Load user data
  useEffect(() => {
    if (user) {
      setUserData(user);
      fetchUserDomains();
    }
  }, [user]);

  useEffect(() => {
    const fetchFilteredLinks = async () => {
      if (!user) return;

      const filterOptions = ["active", "inactive", "protected", "notprotected"];
      const counts = {};

      try {
        for (const filter of filterOptions) {
          const res = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/filter/${filter}`,
            { withCredentials: true }
          );
          counts[filter] = res.data.results.length;
        }
        let totalLinks = 0;
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/total-short-urls`,
            { withCredentials: true }
          );

          totalLinks = res.data.count;
        } catch (error) {
          window.alert(error.message);
        }
        setLinkStatusCount({
          ...counts,
          totalLinks:totalLinks,
        });

        console.log("Counts with total:", {
          ...counts,
          totalLinks: Object.values(counts).reduce((acc, num) => acc + num, 0),
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchFilteredLinks();
  }, [user]);

  const fetchUserDomains = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/domains`,
        { withCredentials: true }
      );
      setDomains(res.data.domains || []);
    } catch (error) {
      console.error(error);
    }
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: "", message: "" }), 4000);
  };

  const handleAddDomain = async (e) => {
    e.preventDefault();
    if (!domainName.trim()) return;
    if (domainName.startsWith("https") || domainName.startsWith("http")){
      toast.error("Enter Domain Name");
      return 
    }
    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/add-domain`,
        { domainName },
        { withCredentials: true }
      );
      setDomains(res.data.domains);
      setDomainName("");
      console.log(res.data.domains);
      showAlert("success", "Domain added successfully!");
    } catch (error) {
      showAlert(
        "error",
        error.response?.data?.message || "Failed to add domain"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDomainDeletion = async (domainName) => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/domain/${domainName}`
      );
      const updatedDomainList = res.data.results;
      setDomains(updatedDomainList);
      window.alert(res.data.message);
    } catch (error) {
      window.alert(error.message);
    }
  };

  if (!userData) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 ">
      <div className="flex flex-col sm:flex-row w-[90%] max-w-6xl gap-6 justify-center">
        {/* User Info Card */}
        <div className="card w-full sm:w-[45%] bg-base-100 shadow-lg border border-base-300">
          <div className="card-body">
            {alert.message && (
              <div
                className={`alert ${
                  alert.type === "success" ? "alert-success" : "alert-error"
                } shadow-lg mb-3`}
              >
                <span>{alert.message}</span>
              </div>
            )}
            {/* Profile Section */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="avatar placeholder">
                <div className="bg-primary text-primary-content rounded-full w-24 flex items-center justify-center">
                  <span className="text-3xl font-bold">
                    {userData.username.charAt(0)}
                  </span>
                </div>
              </div>

              <h2 className="text-2xl font-semibold mt-2">
                {userData.username}
              </h2>
              <p className="text-sm text-gray-500 break-all">
                User ID: {userData._id}
              </p>
            </div>

            {/* Divider */}
            <div className="divider">Account Info</div>

            {/* Account Info */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <span>{userData.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary" />
                <span>
                  Joined on{" "}
                  {new Date(userData.createdAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="divider">Custom Domains</div>

            {/* Add Domain Form */}
            <form onSubmit={handleAddDomain} className="flex gap-2">
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="e.g. links.yourdomain.com"
                value={domainName}
                onChange={(e) => setDomainName(e.target.value)}
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Add"
                )}
              </button>
            </form>
          </div>
        </div>
        <div className="flex flex-col gap-6 w-full sm:w-[45%]">
          <div className="p-6 bg-white rounded-md shadow-md border border-base-300 flex flex-col gap-4">
            <h2 className="text-xl  mb-2 border-b border-gray-200 pb-2">
              URL Statistics
            </h2>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="hover:underline decoration-gray-300  underline-offset-4 cursor-pointer">
                  Total URLs:
                </span>
                <span className="font-semibold text-gray-500">
                  {linkStatusCount.totalLinks}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FaCircle size={10} className="text-red-500" />
                  <span
                    className="hover:underline decoration-gray-300  underline-offset-4 cursor-pointer"
                    onClick={() => {
                      navigate("/filter/active");
                    }}
                  >
                    Active URLs:
                  </span>
                </div>
                <span className="font-semibold text-gray-500">
                  {linkStatusCount.active}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FaCircle size={10} className="text-gray-400" />
                  <span
                    className="hover:underline decoration-gray-300  underline-offset-4 cursor-pointer"
                    onClick={() => {
                      navigate("/filter/inactive");
                    }}
                  >
                    Deactive URLs:
                  </span>
                </div>
                <span className="font-semibold text-gray-500">
                  {linkStatusCount.inactive}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Lock size={14} className="text-blue-500" />
                  <span
                    className="hover:underline decoration-gray-300  underline-offset-4 cursor-pointer"
                    onClick={() => {
                      navigate("/filter/protected");
                    }}
                  >
                    Protected URLs:
                  </span>
                </div>
                <span className="font-semibold text-gray-500">
                  {linkStatusCount.protected}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Unlock size={14} className="text-red-500" />
                  <span
                    className="hover:underline decoration-gray-300  underline-offset-4 cursor-pointer"
                    onClick={() => {
                      navigate("/filter/notprotected");
                    }}
                  >
                    Not Protected URLs:
                  </span>
                </div>
                <span className="font-semibold text-gray-500">
                  {linkStatusCount.notprotected}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white rounded-md shadow-md border border-base-300">
            <h2 className="text-xl  mb-2 border-b border-gray-200 pb-2">
              Custom Domains{" "}
              <span className="text-sm text-gray-500 capitalize">
                (total custom domaims {domains.length})
              </span>
            </h2>
            {domains.length > 0 ? (
              <ul className="mt-3 space-y-2 h-[250px] overflow-y-scroll">
                {domains.map((domain, index) => (
                  <li
                    key={domain._id || index}
                    className="flex items-center gap-2 p-2 rounded-md"
                  >
                    <Globe className="w-4 h-4 text-primary" />

                    {/* ✅ Safely show domain name */}
                    <div className="flex flex-col">
                      <span className="font-medium">{domain.name}</span>
                      <span
                        className={`text-xs ${
                          domain.verified ? "text-green-500" : "text-yellow-500"
                        }`}
                      >
                        {domain.verified ? "Verified" : "Pending Verification"}
                      </span>
                    </div>

                    <Trash2
                      className="ml-auto text-red-500 cursor-pointer"
                      size={16}
                      onClick={() => handleDomainDeletion(domain.name)}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 mt-2">
                No custom domains added yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;