import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "../components/Login.jsx";
import Signup from "../components/SignUp.jsx";
import UserProfile from "../components/UserProfile.jsx";
import TrimosLayout from "../Layout/TrimosLayout.jsx";
import ShortLinksDashboard from "../components/ShortLinksDashboard.jsx";
import LinkDetails from "../components/LinkDetails.jsx";
import NotFoundPage from "../components/NotFoundPage.jsx";
import ListByTags from "../components/ListByTags.jsx";
import LinkProtection from "../components/LinkProtection.jsx";
 
import UserQrCodes from "../components/UserQrCodes.jsx";
import ProtectedRoute from "../components/ProtectedRouted.jsx";
import LinkAnalytics from "../components/LinkAnalytics.jsx";
import LinkInactive from "../components/LinkInActive.jsx";
import FilterLinksPage from "../components/FilterLinksPage.jsx";
import AnalyticsPage from "../components/AnalyticsPage.jsx";
import Setting from "../components/Setting.jsx";
import ShortUrlAndQR from "../components/ShortUrlAndQR.jsx";


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
    element: <TrimosLayout />,
    children: [
      {
        index: true,
        element: <ShortUrlAndQR />
      },
      {
        path: "/user-profile",
        element: (
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/links",
        element: (
          <ProtectedRoute>
            <ShortLinksDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/link-details/:slugName",
        element: (
          <ProtectedRoute>
            <LinkDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "/tags",
        element: (
          <ProtectedRoute>
            <ListByTags />
          </ProtectedRoute>
        ),
      },
  
      {
        path: "/qr-codes",
        element: (
          <ProtectedRoute>
            <UserQrCodes />
          </ProtectedRoute>
        ),
      },
      {
        path: "/analytics/:slugName",
        element: (
          <ProtectedRoute>
            <LinkAnalytics />
          </ProtectedRoute>
        ),
      },
      {
        path: "/filter/:sort",
        element: <FilterLinksPage />,
      },
      {
        path: "/analytics",
        element: <AnalyticsPage />,
      },
      {
        path: "/settings",
        element: <Setting />,
      },

      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
  {
    path: "/in-active",
    element: <LinkInactive />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
