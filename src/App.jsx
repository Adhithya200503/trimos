import { useState } from "react";
import Signup from "./components/SignUp";
import Login from "./components/Login";
import CreateShortUrl from "./components/CreateShortUrl";
import SearchUrl from "./components/SearchUrl";
import UrlList from "./components/UrlList";
import { RouterProvider } from "react-router-dom";
import router from "./routes/route";
import { AuthProvider } from "./context/authContext";

function App() {
  const [urls, setUrls] = useState([]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
