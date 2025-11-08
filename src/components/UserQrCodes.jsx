import { useEffect, useState } from "react";
import axios from "axios";
import { Download, Share2, Trash2, Loader2 } from "lucide-react";

const UserQrCodes = () => {
  const [qrCodes, setQrCodes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQrCodes = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/my-qrcodes`,
        { withCredentials: true }
      );
      setQrCodes(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching QR codes:", error);
      setLoading(false);
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
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin h-6 w-6 text-gray-500" /> Loading...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {qrCodes.length === 0 ? (
        <p>No QR codes found. Create one to get started!</p>
      ) : (
        qrCodes.map((code, index) => (
          <div key={code._id} className=" rounded-lg p-4">
            <img
              src={code.qrUrl}
              alt={`QR Code ${index + 1}`}
              className="w-[250px] sm:w-[300px] h-auto rounded-md mb-4"
            />
            <div className="w-[250px] sm:w-[300px] ">
              <p className="text-sm text-gray-600 dark:text-white mb-2">
                <strong>Destination:</strong> {code.destinationUrl}
              </p>
              <p className="text-sm text-gray-400 mb-2">
                <strong>Created At:</strong> {code.createdAt.slice(0,10)}
              </p>
            </div>
            <div className="flex justify-between w-[250px] sm:w-[300px]">
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
