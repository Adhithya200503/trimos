import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "../components/Login.jsx";
import Signup from "../components/SignUp.jsx";
import UserProfile from "../components/UserProfile.jsx";
import TrimosLayout from "../Layout/TrimosLayout.jsx";
import CreateShortUrl from "../components/CreateShortUrl.jsx";
import ShortLinksDashboard from "../components/ShortLinksDashboard.jsx";
import LinkDetails from "../components/LinkDetails.jsx";
import NotFoundPage from "../components/NotFoundPage.jsx";
import ListByTags from "../components/ListByTags.jsx";
import LinkProtection from "../components/LinkProtection.jsx";
import QRcode from "../components/QRcode.jsx";
import UserQrCodes from "../components/UserQrCodes.jsx";
import ProtectedRoute from "../components/ProtectedRouted.jsx";
import LinkAnalytics from "../components/LinkAnalytics.jsx";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/protected/:slugName",
    element: <LinkProtection />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <TrimosLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <CreateShortUrl />,
      },
      {
        path: "/user-profile",
        element: <UserProfile />,
      },
      {
        path: "/links",
        element: <ShortLinksDashboard />,
      },
      {
        path: "/link-details/:slugName",
        element: <LinkDetails />,
      },
      {
        path: "/tags",
        element: <ListByTags />,
      },
      {
        path: "/qr-code",
        element: <QRcode />,
      },
      {
        path: "/qr-codes",
        element: <UserQrCodes />,
      },
      {
        path:"/analytics/:slugName",
        element:<LinkAnalytics />
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
