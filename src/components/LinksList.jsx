import React from "react";
import {
  MoreVertical,
  Trash,
  Eye,
  QrCode,
  Calendar,
  Copy,
  Share2,
  EyeIcon,
  RefreshCcw,
} from "lucide-react";
import { CiLock } from "react-icons/ci";
import { CiUnlock } from "react-icons/ci";
import { SiSimpleanalytics } from "react-icons/si";
import { FaCircle } from "react-icons/fa";

import CopyButton from "./ui/CopyButton";
import { NavLink, useNavigate } from "react-router-dom";
import ShareDropdown from "./ShareDropDown";
const LinksList = ({
  links,
  handleDelete,
  handleQRCode,
  handleActiveToggle,
  activeLoading,
  setActiveLoading,
  handleProtectedToggle,
  passwordChangeLoading,
  setPasswordChangeLoading,
}) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-y-4">
      {links.map((link) => (
        <div
          key={link._id}
          className="card bg-base-100 shadow-sm border border-base-200 rounded-none"
        >
          <div className="card-body relative">
            {/* 3-dot Menu */}
            <div className="absolute top-3 right-16 dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-sm">
                <Share2 className="h-5 w-5" />
              </div>
              <ShareDropdown link={link.shortUrl} />
            </div>
            <div className="absolute top-3 right-3 dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-sm">
                <MoreVertical className="h-5 w-5" />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40"
              >
                <li>
                  <NavLink
                    to={`/link-details/${link.slugName}`}
                    className="flex items-center gap-2"
                  >
                    <Eye size={16} /> View
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to={`/analytics/${link.slugName}`}
                    className="flex items-center gap-2"
                  >
                    <SiSimpleanalytics size={16} />
                    Analytics
                  </NavLink>
                </li>
                <li>
                  <button
                    onClick={() => handleQRCode(link.shortUrl, link.slugName)}
                    className="flex items-center gap-2"
                  >
                    <QrCode size={16} /> QR Code
                  </button>
                </li>
                <hr className="my-1 border-gray-600 opacity-30" />
                <li>
                  <button
                    onClick={() => handleDelete(link.slugName)}
                    className="flex items-center text-red-500 gap-2 "
                  >
                    <Trash size={16} /> Delete
                  </button>
                </li>
              </ul>
            </div>
            {/* Card Content */}
            <div className="text-lg font-semibold text-primary wrap-break-word pt-4 sm:pt-0 flex items-center gap-4">
              <a
                href={link.shortUrl}
                target="_blank"
                rel="noreferrer"
                className="link text-[#2A5BDA] dark:text-white no-underline"
              >
                {link.shortUrl}
              </a>
              <CopyButton text={link.shortUrl} />
            </div>

            <p className="text-sm text-gray-500 truncate flex items-center gap-2">
              <RefreshCcw size={14} />
              <a
                href={link.destinationUrl}
                target="_blank"
                rel="noreferrer"
                className="link"
              >
                <span className="sm:hidden">{link.destinationUrl.length <= 30 ?link.destinationUrl:link.destinationUrl.slice(0,30)+"..."}</span>
                <span className="hidden md:block">{link.destinationUrl.length <= 30 ?link.destinationUrl:link.destinationUrl.slice(0,80)+"..."}</span>
              </a>
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mt-2">
              {link.tags?.length > 0 ? (
                link.tags.map((tag) => (
                  <span
                    key={tag}
                    className="badge select-none rounded-sm bg-gray-200 dark:bg-blue-500"
                  >
                    {tag}
                  </span>
                ))
              ) : (
                <span className="text-gray-400 text-sm">No tags</span>
              )}
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-400 mt-2">
              <div
                className="tooltip hover:tooltip-open hover:tooltip-top"
                data-tip="Analytics"
              >
                <SiSimpleanalytics
                  className="hover:text-black cursor-pointer"
                  size={10}
                  onClick={() => navigate(`/analytics/${link.slugName}`)}
                />
              </div>
              <span>
                Created: {new Date(link.createdAt).toLocaleDateString("en-IN")}
              </span>
              {passwordChangeLoading === link._id ? (
                <span className="flex gap-1.5 cursor-pointer select-none items-center">
                  Switching
                </span>
              ) : (
                <span
                  className="flex gap-1.5 items-center cursor-pointer select-none"
                  onClick={() => handleProtectedToggle(link._id, link.slugName)}
                >
                  {link.protected ? (
                    <CiLock className="text-gray-500 text-sm" />
                  ) : (
                    <CiUnlock className="text-gray-400 text-sm" />
                  )}
                </span>
              )}

              <span className="flex gap-1.5">
                <EyeIcon size={14} />
                {link.clicks}
              </span>
              {activeLoading == link._id ? (
                <span className="flex gap-1.5 cursor-pointer select-none ">
                  <FaCircle size={14} className="text-green-800" />
                  Switching
                </span>
              ) : (
                <span className="flex gap-1.5">
                  <FaCircle
                    size={14}
                    onClick={() => handleActiveToggle(link._id, link.slugName)}
                    className={`${
                      link.isActive
                        ? "text-red-700"
                        : "text-black dark:text-white"
                    } cursor-pointer`}
                  />
                  {link.isActive ? "Active" : "Inactive"}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LinksList;
