import axios from "axios";
import React, { useState } from "react";
import { useParams } from "react-router-dom";

const LinkProtection = () => {
  const { slugName } = useParams();
  const [password, setPassword] = useState("");

  function handlePasswordFieldChange(e) {
    setPassword(e.target.value);
  }

  async function submitForm() {
    try {
      const res = await axios.post(
        "https://trim-url-gpxt.onrender.com/protected-url",
        { slugName, password },
        { withCredentials: true }
      );
      if (res?.data?.redirectUrl) {
        window.location.href = res.data.redirectUrl;
      }
    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.message || "An error occurred");
    }
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div>
        <p className="capitalize pb-4 text-2xl">
          Enter Password to unlock the page
        </p>
        <div className="flex gap-2">
          <label className="input">
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
              </g>
            </svg>
            <input
              type="password"
              required
              placeholder="Password"
              onChange={handlePasswordFieldChange}
              value={password}
            />
          </label>
          <button className="btn btn-primary" onClick={submitForm}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default LinkProtection;
