import React, { useContext, useEffect, useState } from "react";
import { Mail, Calendar, Globe, ProjectorIcon, Lock } from "lucide-react";
import { AuthContext } from "../context/authContext";
import axios from "axios";
import { FaCircle } from "react-icons/fa";
const UserProfile = () => {
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [domainName, setDomainName] = useState("");
  const [loading, setLoading] = useState(false);
  const [domains, setDomains] = useState([]);

  // ✅ Load user data
  useEffect(() => {
    if (user) {
      setUserData(user);
      fetchUserDomains();
    }
  }, [user]);

  // ✅ Fetch user domains from backend
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

  // ✅ Add new domain
  const handleAddDomain = async (e) => {
    e.preventDefault();
    if (!domainName.trim()) return;

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/add-domain`,
        { domainName },
        { withCredentials: true }
      );
      setDomains(res.data.domains);
      setDomainName("");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add domain");
    } finally {
      setLoading(false);
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
                <span className="font-semibold text-gray-700">500</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FaCircle size={10} className="text-red-500" />
                  <span className="hover:underline decoration-gray-300  underline-offset-4 cursor-pointer">
                    Active URLs:
                  </span>
                </div>
                <span className="font-semibold">400</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FaCircle size={10} className="text-gray-400" />
                  <span className="hover:underline decoration-gray-300  underline-offset-4 cursor-pointer">
                    Deactive URLs:
                  </span>
                </div>
                <span className="font-semibold">120</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Lock size={14} className="text-blue-500" />
                  <span className="hover:underline decoration-gray-300  underline-offset-4 cursor-pointer">
                    Protected URLs:
                  </span>
                </div>
                <span className="font-semibold">100</span>
              </div>
            </div>
          </div>

 
          <div className="p-6 bg-white rounded-md shadow-md border border-base-300">
            <h2 className="text-xl  mb-2 border-b border-gray-200 pb-2">
              Custom Domains
            </h2>
            {domains.length > 0 ? (
              <ul className="mt-3 space-y-2">
                {domains.map((domain, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-base-200 transition"
                  >
                    <Globe className="w-4 h-4 text-primary" />
                    <span>{domain}</span>
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
