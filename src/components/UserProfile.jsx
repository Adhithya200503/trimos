import React, { useContext, useEffect, useState } from "react";
import {
  Mail,
  Calendar,
  Lock,
  Unlock,
} from "lucide-react";
import { AuthContext } from "../context/authContext";
import axios from "axios";
import { FaCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [linkStatusCount, setLinkStatusCount] = useState({
    active: 0,
    inactive: 0,
    protected: 0,
    notprotected: 0,
    totalLinks: 0,
  });
  const navigate = useNavigate();

  // ✅ Load user data
  useEffect(() => {
    if (user) {
      setUserData(user);
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

      } catch (err) {
        console.error(err);
      }
    };

    fetchFilteredLinks();
  }, [user]);


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
              <p className="text-sm text-base-content/70 break-all">
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

          </div>
        </div>
        <div className="flex flex-col gap-6 w-full sm:w-[45%]">
          <div className="p-6 bg-base-100 rounded-md shadow-md border border-base-300 flex flex-col gap-4 h-full">
            <h2 className="text-xl  mb-2 border-b border-base-300 pb-2">
              URL Statistics
            </h2>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="hover:underline decoration-base-300  underline-offset-4 cursor-pointer">
                  Total URLs:
                </span>
                <span className="font-semibold text-base-content/70">
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
        </div>
      </div>
    </div>
  );
};

export default UserProfile;