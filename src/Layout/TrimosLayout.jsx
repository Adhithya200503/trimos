import React, { useContext } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { Link2, LogOut, Plus, Settings, Tags, User } from "lucide-react";
import { TbCaretUpDown } from "react-icons/tb";
import { SiSimpleanalytics } from "react-icons/si";

// ── Shared nav link class — works correctly in both Light & Dark mode ─────────
const navLinkClass = ({ isActive }) =>
  `flex items-center gap-2 p-2 rounded transition-colors duration-150 ${
    isActive
      ? "bg-primary text-primary-content font-semibold"
      : "hover:bg-base-content/10 text-base-content"
  }`;

const TrimosLayout = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">

        {/* Top navbar */}
        <div className="navbar bg-base-200 shadow-md px-4">
          {/* Hamburger for mobile */}
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
              TrimURL
            </NavLink>
          </div>

          {/* User dropdown / Auth buttons */}
          <div className="flex justify-end items-center px-6 py-3">
            {user ? (
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <div className="bg-primary text-primary-content rounded-full w-8 h-8 flex items-center justify-center font-semibold">
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:flex items-center gap-2 font-semibold">
                    {user?.username}
                    <TbCaretUpDown size={20} className="text-base-content" />
                  </span>
                </div>
                <ul
                  tabIndex={0}
                  className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-200 rounded-box w-52"
                >
                  <li>
                    <NavLink to="/user-profile" className="flex items-center gap-2">
                      <User size={14} />
                      Profile
                    </NavLink>
                  </li>
                  <li>
                    <hr className="border-base-content/20 my-1" />
                  </li>
                  <li>
                    <button onClick={logout} className="flex items-center gap-2 text-error">
                      <LogOut size={14} />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <span className="flex gap-x-2">
                <NavLink to="/login" className="btn btn-primary btn-sm">
                  Login
                </NavLink>
                <NavLink to="/signup" className="btn btn-outline btn-sm">
                  Signup
                </NavLink>
              </span>
            )}
          </div>
        </div>

        {/* Main content */}
        <main className="p-6 min-h-screen bg-base-200">
          <Outlet />
        </main>
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        />
        <ul className="menu pt-[70px] p-4 w-80 lg:w-[250px] min-h-full bg-base-300 text-base-content gap-y-1">
          <li>
            <NavLink to="/" className={navLinkClass}>
              <Plus size={20} />
              Create Short Link
            </NavLink>
          </li>
          <li>
            <NavLink to="/links" className={navLinkClass}>
              <Link2 size={20} />
              Links
            </NavLink>
          </li>
          <li>
            <NavLink to="/tags" className={navLinkClass}>
              <Tags size={20} />
              Tags
            </NavLink>
          </li>
          <li>
            <NavLink to="/analytics" className={navLinkClass}>
              <SiSimpleanalytics size={18} />
              Analytics
            </NavLink>
          </li>
          <li>
            <NavLink to="/user-profile" className={navLinkClass}>
              <User size={20} />
              Profile
            </NavLink>
          </li>
          <li className="mt-auto">
            <NavLink to="/settings" className={navLinkClass}>
              <Settings size={20} />
              Settings
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TrimosLayout;