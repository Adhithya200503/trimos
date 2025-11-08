import React, { useState, useRef, useEffect } from "react";
import QRCode from "qrcode";
import axios from "axios";
import { Link } from "react-router-dom";

const QRcode = () => {
  const [url, setUrl] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const canvas = useRef(null);
  const [error, setError] = useState("");

  function handleInputChange(e) {
    setUrl(e.target.value);
    setError("");
    setQrUrl("");
  }

  function createQRCode() {
    try {
      new URL(url);
      setError("");
      setQrUrl(url);
    } catch (e) {
      setError("Please enter a valid URL");
    }
  }

  useEffect(() => {
    if (!qrUrl || !canvas.current) return;

    QRCode.toCanvas(canvas.current, qrUrl, { width: 200 }, (err) => {
      if (err) {
        setError("Error generating QR code: " + err.message);
        setQrUrl("");
      }
    });
  }, [qrUrl]);

  function downloadQRCode() {
    if (!canvas.current) return;
    const link = document.createElement("a");
    link.download = "qrcode.png";
    link.href = canvas.current.toDataURL();
    link.click();
  }

  async function saveToDataBase() {
    const canva = canvas.current;
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/qrcode`,
      { destinationUrl: url, qrUrl: canva.toDataURL() },
      { withCredentials: true }
    );
    if (res.data.qrCodeData) {
      alert("saved to data base");
    } else {
      alert(res.data.message);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center w-full relative">
      <Link className="absolute top-4 right-8 btn bg-blue-500 text-white" to="/qr-codes" >Saved QR codes</Link>
      <div className="flex flex-col w-md items-center gap-4">
        <span className="font-bold text-2xl">Create QR code</span>
        <input
          type="text"
          placeholder="Enter destination URL"
          className="input w-full"
          value={url}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === "Enter" && createQRCode()}
        />
        {error && <div className="text-sm text-red-500">{error}</div>}

        <button
          className="btn bg-blue-500 text-white"
          onClick={createQRCode}
          disabled={!url.trim()}
        >
          Submit
        </button>

        {qrUrl && (
          <div className="flex flex-col items-center gap-2">
            <canvas ref={canvas} width={200} height={200}></canvas>
            <div className="flex gap-2.5">
              <button className="btn bg-amber-500 " onClick={downloadQRCode}>
                Download
              </button>
              <button className="btn bg-primary text-white" onClick={saveToDataBase}>
                save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRcode;
