import { useEffect } from "react";
import axios from "axios";

export default function GoogleButton() {
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
      const res = await axios.post(`https://trim-url-gpxt.onrender.com/auth/google`, {
        tokenId: response.credential
      });

      localStorage.setItem("token", res.data.token);
      console.log("Google login successful", res.data.userData);
    } catch (err) {
      console.error(err);
    }
  };

  return <div id="googleButton"></div>;
}
