import React, { useContext } from "react";
import { Outlet, NavLink, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { Link2, Plus, QrCode, Tags } from "lucide-react";

const TrimosLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="drawer lg:drawer-open">
      {/* Drawer toggle checkbox */}
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />

      {/* Drawer content (main page area) */}
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
          <div className="flex-none">
            {user ? (
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar"
                >
                  <div className="bg-primary text-primary-content rounded-full w-24 flex items-center justify-center">
                    <span className="text-sm font-bold">
                      {user.username.charAt(0)}
                    </span>
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="mt-3 z-1 p-2 shadow menu menu-sm dropdown-content bg-base-200 rounded-box w-52"
                >
                  <li>
                    <NavLink to="/user-profile">Profile</NavLink>
                  </li>
                  <li>
                    <button onClick={logout}>Logout</button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  className="btn btn-outline btn-primary"
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/signup")}
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main content */}
        <main className="p-6 min-h-screen bg-[#F4F6FA] dark:bg-gray-800">
          <Outlet />
        </main>
      </div>

      {/* Sidebar (drawer side) */}
      <div className="drawer-side">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu pt-[70px] p-4 w-80 lg:w-[250px] min-h-full bg-base-200 text-base-content gap-y-4">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "active font-semibold" : ""
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
                isActive ? "active font-semibold" : ""
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
                isActive ? "active font-semibold" : ""
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
                isActive ? "active font-semibold" : ""
              }
            >
              <QrCode size={20} />
              QR Code
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TrimosLayout;
