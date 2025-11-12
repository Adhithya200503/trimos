import { useEffect, useState } from "react";
import axios from "axios";
import { Download, Share2, Trash2, Loader2 } from "lucide-react";
import Loader from "./ui/Loader";

const UserQrCodes = () => {
  const [qrCodes, setQrCodes] = useState([]);
  const [loading, setLoading] = useState();

  const fetchQrCodes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/my-qrcodes`,
        { withCredentials: true }
      );
      setQrCodes(response.data.data);
    } catch (error) {
      console.error("Error fetching QR codes:", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  const deleteQrCode = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/qrcodes/${id}`, {
        withCredentials: true,
      });
      setQrCodes(qrCodes.filter((code) => code._id !== id));
      alert("QR code deleted successfully");
    } catch (error) {
      console.error("Error deleting QR code:", error);
    }
  };

  const downloadQrCode = (qrUrl, index) => {
    const link = document.createElement("a");
    link.href = qrUrl;
    link.download = `qrcode-${index + 1}.png`;
    link.click();
  };

  const shareQrCode = async (qrUrl) => {
    try {
      // Convert base64 data URL to Blob
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const file = new File([blob], "qrcode.png", { type: "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "QR Code",
          text: "Scan this QR code",
          files: [file],
        });
      } else {
        alert("Sharing is not supported on this device/browser.");
      }
    } catch (error) {
      console.error("Error sharing QR code:", error);
    }
  };

  useEffect(() => {
    fetchQrCodes();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
      {qrCodes.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-white">
          No QR codes found. Create one to get started!
        </p>
      ) : (
        qrCodes.map((code, index) => (
          <div
            key={code._id}
            className="bg-white dark:bg-gray-800 shadow-md rounded-sm p-5 flex flex-col items-center justify-between w-full max-w-xs mx-auto"
          >
        
            <img
              src={code.qrUrl}
              alt={`QR Code ${index + 1}`}
              className="w-56 h-56 rounded-lg mb-4 object-contain"
            />

            {/* Info */}
            <div className="w-full text-center mb-4">
              <p className="text-sm text-gray-700 dark:text-gray-200 truncate">
                <strong>Destination:</strong>{" "}
                <span className="break-all text-blue-500">
                  {code.destinationUrl}
                </span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                <strong>Created At:</strong> {code.createdAt.slice(0, 10)}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex justify-between w-full">
              <button
                onClick={() => shareQrCode(code.qrUrl)}
                className="btn btn-sm btn-outline flex items-center gap-1"
              >
                <Share2 size={16} /> Share
              </button>
              <button
                onClick={() => downloadQrCode(code.qrUrl, index)}
                className="btn btn-sm btn-outline flex items-center gap-1"
              >
                <Download size={16} /> Download
              </button>
              <button
                onClick={() => deleteQrCode(code._id)}
                className="btn btn-sm btn-outline btn-error flex items-center gap-1"
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default UserQrCodes;
