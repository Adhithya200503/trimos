import React, { useContext, useState } from "react";
import { AuthContext } from "../context/authContext";
import { Copy, Eye, EyeClosed } from "lucide-react";

const Setting = () => {
  const { user } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div>
      <div>API KEY</div>
      <div className="w-sm flex items-center border border-gray-400 gap-2 px-4">
        <input
        value={user?._id}
        type={showPassword ? "text" : "password"}
        className="px-4 py-2 outline-none flex-1"
      ></input>
      <span onClick={toggleShowPassword} className="cursor-pointer">
        {showPassword ? <Eye /> : <EyeClosed />}
      </span>
      </div>
    </div>
  );
};

export default Setting;
