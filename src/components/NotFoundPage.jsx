import React from "react";
import { useNavigate } from "react-router-dom";
import { Ghost } from "lucide-react";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-6">
      <div className="flex flex-col items-center">
        {/* Ghost Icon or Illustration */}
        <div className="animate-bounce mb-6">
          <Ghost size={80} className="text-primary" />
        </div>

        <h1 className="text-6xl font-extrabold text-error mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
        <p className="text-base-content/70 mb-6">
          Oops! The page you’re looking for doesn’t exist or has been moved.
        </p>

        <div className="flex gap-4">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/")}
          >
            home
          </button>
          <button
            className="btn btn-outline"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      </div>

      
    
    </div>
  );
};

export default NotFoundPage;
