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

      {/* Create Button */}
      <button
        className="btn mb-4 bg-blue-600 text-white"
        onClick={() => document.getElementById("my_modal_1").showModal()}
      >
        Create Token
      </button>

  
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-2">Create New Token</h3>

          <input
            type="text"
            className="px-4 py-2 border border-gray-400 w-full rounded-sm"
            placeholder="Enter Token Name"
            value={tokenName}
            onChange={(e) => setTokenName(e.target.value)}
          />

          <div className="modal-action">
            <form method="dialog">
              <div className="flex gap-3">
                <button className="btn bg-gray-300">Close</button>
                <button
                  type="button"
                  className="btn bg-blue-600 text-white"
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
        <ul className="bg-white  p-4  md:w-lg">
          {userTokens.map((token, idx) => (
            <li key={idx} className="flex justify-between items-center  py-2">
              <span className="font-medium">{token.tokenName}</span>
              <span className="text-gray-600">{token.tokenId}</span>
              <Trash2
                size={20}
                className="text-red-500 cursor-pointer"
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
          <button className={`btn rounded-none ${theme==="DarkMode"?"":"bg-gray-800 text-white"}`} onClick={toggleTheme}>
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
