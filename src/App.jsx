import { useState } from "react";
import Signup from "./components/SignUp";
import Login from "./components/Login";
import CreateShortUrl from "./components/CreateShortUrl";
import SearchUrl from "./components/SearchUrl";
import UrlList from "./components/UrlList";
import { RouterProvider } from "react-router-dom";
import router from "./routes/route";
import { AuthProvider } from "./context/authContext";
import { Toaster, toast } from "react-hot-toast";
function App() {
  const [urls, setUrls] = useState([]);

  return (
    <>
      <Toaster />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
