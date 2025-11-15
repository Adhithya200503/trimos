import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";


export default function GoogleButton() {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false); // 👈 loader state

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
        width: "100%",
      }
    );
  }, []);

  const handleResponse = async (response) => {
    setLoading(true); // 👈 start loader
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
    } finally {
      setLoading(false); // 👈 stop loader
    }
  };

  return (
    <div className="w-full">
      {loading ? (
        <div className="flex items-center justify-center h-12">
          <div className="loader border-4 border-t-blue-500 border-gray-300 rounded-full w-6 h-6 animate-spin" />
        </div>
      ) : (
        <div
          id="googleButton"
          className="w-full h-12 flex items-center justify-center"
        />
      )}
    </div>
  );
}
