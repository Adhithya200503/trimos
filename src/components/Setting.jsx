import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/authContext";
import { Trash2 } from "lucide-react";
import Loader from "./ui/Loader";
import axios from "axios";
import toast from "react-hot-toast";
import { IoSunnyOutline } from "react-icons/io5";
import { MdOutlineDarkMode } from "react-icons/md";

const Setting = () => {
  const { user } = useContext(AuthContext);
  const [userTokens, setUserTokens] = useState([]);
  const [tokenName, setTokenName] = useState("");
  const { theme, toggleTheme } = useContext(AuthContext);
  // Fetch tokens
  useEffect(() => {
    async function getUserTokens() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/tokens`,
          { withCredentials: true }
        );

        setUserTokens(res.data.tokens);
      } catch (error) {
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    }
    if (user) getUserTokens();
  }, [user]);

  // Create token
  const createToken = async () => {
    if (!tokenName) {
      toast.error("Enter a valid token name");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/create-token`,
        { tokenName },
        { withCredentials: true }
      );

      setUserTokens(res.data.updatedTokenList);
      setTokenName("");

      document.getElementById("my_modal_1").close(); // close modal
      toast.success("Token created");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create token");
    }
  };

  // Delete token
  const deleteToken = async (tokenName) => {
    if (!tokenName) return;

    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/delete-token`,
        {
          data: { tokenName }, // Correct way to send DELETE body
          withCredentials: true,
        }
      );

      setUserTokens(res.data.updatedTokenList);
      toast.success("Token Deleted Successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting token");
    }
  };
  
  if (!user) return <Loader />;

  return (
    <div className="p-4">
      <div className="text-xl font-semibold mb-3">API Tokens</div>

      {/* Buttons Row */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <button
          className="btn btn-primary"
          onClick={() => document.getElementById("my_modal_1").showModal()}
        >
          Create Token
        </button>

        <a
          href={`${import.meta.env.VITE_BACKEND_URL.replace("/api/v1", "")}/api/docs`}
          target="_blank"
          rel="noreferrer"
          className="btn btn-outline btn-accent flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm1 1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1"/>
            <path d="M8.5 6.5a.5.5 0 0 0-1 0v1H6.5a.5.5 0 0 0 0 1h1v1a.5.5 0 0 0 1 0v-1h1a.5.5 0 0 0 0-1h-1z"/>
          </svg>
          Try it out
        </a>
      </div>

  
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-2">Create New Token</h3>

          <input
            type="text"
            className="input input-bordered w-full rounded-sm"
            placeholder="Enter Token Name"
            value={tokenName}
            onChange={(e) => setTokenName(e.target.value)}
          />

          <div className="modal-action">
            <form method="dialog">
              <div className="flex gap-3">
                <button className="btn">Close</button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={createToken}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>

      {userTokens.length === 0 ? (
        <p>No Tokens Found</p>
      ) : (
        <ul className="bg-base-100 shadow-sm rounded-md p-4 md:w-lg">
          {userTokens.map((token, idx) => (
            <li key={idx} className="flex justify-between items-center py-2">
              <span className="font-medium text-base-content">{token.tokenName}</span>
              <span className="text-base-content/70">{token.tokenId}</span>
              <Trash2
                size={20}
                className="text-error cursor-pointer"
                onClick={() => deleteToken(token.tokenName)}
              />
            </li>
          ))}
        </ul>
      )}
      <div className="flex-col h-[30vh]   mt-8">
        <span className="text-xl font-bold">Set Theme</span>
        <div className="pt-4">
          <span className="flex gap-2">
            <span>Current Theme:</span>
            <span className="font-bold">{theme === "LightMode" ? "Light Mode" : "Dark Mode"}</span>
          </span>
        </div>
        <div className="pt-4">
          <button className="btn btn-outline rounded-none" onClick={toggleTheme}>
            {theme == "DarkMode" ? (
              <>
                <IoSunnyOutline size={20} />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <MdOutlineDarkMode size={20} />
                <span >Dark Mode</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Setting;
