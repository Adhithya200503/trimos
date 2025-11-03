import React from "react";
import {
  MoreVertical,
  Trash,
  Eye,
  QrCode,
  Calendar,
  Copy,
  Share2,
} from "lucide-react";
import { CiLock } from "react-icons/ci";
import { CiUnlock } from "react-icons/ci";

import CopyButton from "./ui/CopyButton";
import { NavLink } from "react-router-dom";
import ShareDropdown from "./ShareDropDown";
const LinksList = ({ links, handleDelete, handleQRCode }) => {
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
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(link.shortUrl);
                    }}
                    className="flex items-center gap-2"
                  >
                    <Copy size={16} /> Copy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleQRCode(link.shortUrl,link.slugName)}
                    className="flex items-center gap-2"
                  >
                    <QrCode size={16} /> QR Code
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleDelete(link.slugName)}
                    className="flex items-center text-red-500 gap-2"
                  >
                    <Trash size={16} /> Delete
                  </button>
                </li>
              </ul>
            </div>
            {/* Card Content */}
            <h3 className="text-lg font-semibold text-primary wrap-break-word pt-4 sm:pt-0">
              <a
                href={link.shortUrl}
                target="_blank"
                rel="noreferrer"
                className="link text-black"
              >
                {`${import.meta.env.VITE_BACKEND_URL}/${link.slugName}`}
              </a>
            </h3>

            <p className="text-sm text-gray-500 truncate">
              <a
                href={link.destinationUrl}
                target="_blank"
                rel="noreferrer"
                className="link"
              >
                {link.destinationUrl}
              </a>
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mt-2">
              {link.tags?.length > 0 ? (
                link.tags.map((tag) => (
                  <span key={tag} className="badge badge-outline badge-primary">
                    {tag}
                  </span>
                ))
              ) : (
                <span className="text-gray-400 text-sm">No tags</span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-2">
              <span>
                Created: {new Date(link.createdAt).toLocaleDateString("en-IN")}
              </span>
              {link.protected ? (
                <CiLock className="text-gray-500 text-sm" />
              ) : (
                <CiUnlock className="text-gray-400 text-sm" />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LinksList;
