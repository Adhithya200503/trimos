import React, { useContext, useEffect, useState } from "react";
import { Mail, Calendar, User as UserIcon } from "lucide-react";
import { AuthContext } from "../context/authContext";

const UserProfile = () => {
  const { user } = useContext(AuthContext); // ✅ Correct usage
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (user) setUserData(user);
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
      <div className="card w-full max-w-md bg-base-100 shadow-lg border border-base-300">
        <div className="card-body">
          {/* Avatar + Name */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="avatar placeholder">
              <div className="bg-primary text-primary-content rounded-full w-24 flex items-center justify-center">
                <span className="text-3xl font-bold">
                  {userData.username.charAt(0)}
                </span>
              </div>
            </div>

            <h2 className="text-2xl font-semibold mt-2">{userData.username}</h2>
            <p className="text-sm text-gray-500 break-all">
              User ID: {userData._id}
            </p>
          </div>

          {/* Divider */}
          <div className="divider">Account Info</div>

          {/* Account Info */}
          <div className="space-y-3">
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
    </div>
  );
};

export default UserProfile;
