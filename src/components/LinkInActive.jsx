import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const LinkInactive = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-6">
      <div className=" p-10 rounded-2xl  max-w-md">
        <FaExclamationTriangle className="text-red-600 text-6xl mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-3 text-gray-800">
          This link is no longer active
        </h1>
        <p className="text-gray-600 mb-6">
          The owner of this link has deactivated it.  
          Please contact the creator or try again later.
        </p>

        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-none transition duration-300 cursor-pointer"
        >
          Go Home
        </button>
      </div>

      <footer className="mt-8 text-sm text-gray-400">
        &copy; {new Date().getFullYear()} TrimURL — Smart Link Manager
      </footer>
    </div>
  );
};

export default LinkInactive;
