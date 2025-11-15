import React, { useContext } from "react";
import { Outlet, NavLink, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { Link2, LogOut, Plus, QrCode, Tags, User } from "lucide-react";
import { RiArrowDownWideLine } from "react-icons/ri";
import { TbCaretUpDown } from "react-icons/tb";
import { BsGlobe2 } from "react-icons/bs";
import { SiSimpleanalytics } from "react-icons/si";

const TrimosLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Top navbar */}
        <div className="navbar bg-base-200 shadow-md px-4">
          {/* Hamburger button for small screens */}
          <div className="flex-none lg:hidden">
            <label htmlFor="my-drawer" className="btn btn-square btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-6 h-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </label>
          </div>

          {/* App Title */}
          <div className="flex-1">
            <NavLink to="/" className="btn btn-ghost normal-case text-xl">
              Trimos
            </NavLink>
          </div>

          {/* Profile or Auth Buttons */}
          <div className="w-full flex justify-end items-center px-6 py-3">
            {user ? (
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <div className="bg-primary text-primary-content rounded-full w-8 h-8 flex items-center justify-center">
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:flex items-center gap-2 text-md font-semibold">
                    {user?.username}
                    <TbCaretUpDown size={20} className="text-black dark:text-black"/>
                  </span>
                </div>
                <ul
                  tabIndex={0}
                  className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-200 rounded-sm w-52"
                >
                  <li>
                    <NavLink to="/user-profile">
                      <span className="flex items-center gap-2">
                        <User size={14} />
                        Profile
                      </span>
                    </NavLink>
                  </li>
                  <hr className="my-1 border-gray-600 opacity-30" />
                  <li>
                    <button onClick={logout}>
                      <span className="flex items-center gap-2 text-red-500">
                        <LogOut size={14} />
                        Logout
                      </span>
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <span className="flex gap-x-2">
                <NavLink to={"/login"} className="btn bg-blue-500 text-white">
                  Login
                </NavLink>
                <NavLink to={"/signup"} className="btn bg-red-500 text-white">
                  Signup
                </NavLink>
              </span>
            )}
          </div>
        </div>

        {/* Main content */}
        <main className="p-6 min-h-screen bg-[#F4F6FA] dark:bg-gray-800">
          <Outlet />
        </main>
      </div>

      {/* Sidebar (drawer side) */}
      <div className="drawer-side ">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu pt-[70px] p-4 w-80 lg:w-[250px] min-h-full bg-gray-800 text-white text-base-content gap-y-4">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 rounded ${
                  isActive ? "bg-blue-500 font-semibold" : "hover:bg-gray-700"
                }`
              }
            >
              <Plus size={20} />
              Create Short Link
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/links"
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 rounded ${
                  isActive ? "bg-blue-500 font-semibold" : "hover:bg-gray-700"
                }`
              }
            >
              <Link2 size={20} />
              Links
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/tags"
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 rounded ${
                  isActive ? "bg-blue-500 font-semibold" : "hover:bg-gray-700"
                }`
              }
            >
              <Tags size={20} />
              Tags
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/qr-code"
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 rounded ${
                  isActive ? "bg-blue-500 font-semibold" : "hover:bg-gray-700"
                }`
              }
            >
              <QrCode size={20} />
              QR Code
            </NavLink>
          </li>
           <li>
            <NavLink
              to="/analytics"
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 rounded ${
                  isActive ? "bg-blue-500 font-semibold" : "hover:bg-gray-700"
                }`
              }
            >
             <SiSimpleanalytics />
             Analytics
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/user-profile"
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 rounded ${
                  isActive ? "bg-blue-500 font-semibold" : "hover:bg-gray-700"
                }`
              }
            >
             <BsGlobe2 size={20} />
             Domains
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TrimosLayout;
