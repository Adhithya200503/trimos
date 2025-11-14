import { useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";


export default function GoogleButton() {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  useEffect(() => {
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleResponse,
    });

    window.google.accounts.id.renderButton(
      document.getElementById("googleButton"),
      {
        theme: "outline",
        size: "large",
        width: "100%",      // 👈 force full width
      }
    );
  }, []);

  const handleResponse = async (response) => {
    try {
      const res = await axios.post(
        "https://trim-url-gpxt.onrender.com/auth/google",
        { tokenId: response.credential },
        { withCredentials: true }
      );

      setUser(res.data.userData);
      navigate("/");
    } catch (err) {
      console.error("Google login failed", err);
    }
  };

  // 👇 FIX: MATCH HEIGHT & WIDTH
  return (
    <div className="w-full">
      <div
        id="googleButton"
        className="w-full h-12 flex items-center justify-center"
      />
    </div>
  );
}
