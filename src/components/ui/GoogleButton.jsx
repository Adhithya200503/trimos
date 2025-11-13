import { useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";

const { setUser } = useContext(AuthContext);

export default function GoogleButton() {
  const navigate = useNavigate();
 
  useEffect(() => {
  
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleResponse,
    });

    window.google.accounts.id.renderButton(
      document.getElementById("googleButton"),
      { theme: "outline", size: "large" }
    );
  }, []);

  const handleResponse = async (response) => {
    try {
      const res = await axios.post(
        `https://trim-url-gpxt.onrender.com/auth/google`,
        { tokenId: response.credential },
        { withCredentials: true } 
      );

   
      console.log("Google login successful", res.data.userData);
      setUser(res.data.userData);
      
      navigate("/");
    } catch (err) {
      console.error("Google login failed", err);
    }
  };

  return <div id="googleButton"></div>;
}
