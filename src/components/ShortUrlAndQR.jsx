import { useContext, useState, useRef, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/authContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import QRCode from "qrcode";
import { QrCode as QRIcon, Link2, Copy, Check, ChevronDown, Lock, Tag, Zap, Globe } from "lucide-react";

const countries = [
  "Afghanistan","Albania","Algeria","Andorra","Angola","Argentina","Armenia","Australia","Austria","Azerbaijan",
  "Bahamas","Bahrain","Bangladesh","Belarus","Belgium","Bolivia","Brazil","Bulgaria","Cambodia","Cameroon",
  "Canada","Chile","China","Colombia","Croatia","Cuba","Cyprus","Czech Republic","Denmark","Dominican Republic",
  "Ecuador","Egypt","Estonia","Ethiopia","Finland","France","Germany","Ghana","Greece","Guatemala",
  "Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy",
  "Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kuwait","Latvia","Lebanon","Libya","Lithuania",
  "Luxembourg","Malaysia","Mexico","Moldova","Morocco","Myanmar","Nepal","Netherlands","New Zealand",
  "Nicaragua","Nigeria","Norway","Pakistan","Panama","Peru","Philippines","Poland","Portugal","Qatar",
  "Romania","Russia","Rwanda","Saudi Arabia","Senegal","Serbia","Singapore","Slovakia","South Africa",
  "South Korea","Spain","Sri Lanka","Sudan","Sweden","Switzerland","Syria","Taiwan","Tanzania","Thailand",
  "Tunisia","Turkey","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States",
  "Uruguay","Uzbekistan","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe",
];

const ShortUrlAndQR = () => {
  const [activeTab, setActiveTab] = useState("shortener");
  const [formData, setFormData] = useState({
    destinationUrl: "",
    slugName: "",
    tags: "",
    protected: false,
    password: "",
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const { user } = useContext(AuthContext);
  const [blockedCountries, setBlockedCountries] = useState([]);
  const [countrySearch, setCountrySearch] = useState("");

  const handleCountrySelect = (e) => {
    const value = e.target.value;
    const checked = e.target.checked;
    setBlockedCountries((prev) =>
      checked ? [...prev, value] : prev.filter((c) => c !== value)
    );
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const buildUrlWithUTM = () => {
    try {
      const url = new URL(formData.destinationUrl.trim());
      if (formData.utm_source) url.searchParams.set("utm_source", formData.utm_source);
      if (formData.utm_medium) url.searchParams.set("utm_medium", formData.utm_medium);
      if (formData.utm_campaign) url.searchParams.set("utm_campaign", formData.utm_campaign);
      return url.toString();
    } catch {
      return formData.destinationUrl;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to create a short URL");
      navigate("/login");
      return;
    }
    setLoading(true);
    setShortUrl("");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/create`,
        {
          destinationUrl: buildUrlWithUTM(),
          slugName: formData.slugName,
          protected: formData.protected,
          blockedCountries,
          password: formData.protected ? formData.password : "",
          tags: formData.tags ? formData.tags.split(",").map((t) => t.trim()) : [],
          domain: "trim-url-gpxt.onrender.com",
        },
        { withCredentials: true }
      );
      setShortUrl(res.data?.data?.shortUrl);
      toast.success("Short URL created!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── QR CODE ───────────────────────────────────────────────────────────────
  const [qrInput, setQrInput] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [qrError, setQrError] = useState("");
  const canvas = useRef(null);

  function generateQR() {
    try {
      new URL(qrInput);
      setQrError("");
      setQrUrl(qrInput);
    } catch {
      setQrError("Please enter a valid URL");
    }
  }

  useEffect(() => {
    if (!qrUrl || !canvas.current) return;
    QRCode.toCanvas(canvas.current, qrUrl, { width: 200 }, (err) => {
      if (err) { setQrError("Error generating QR: " + err.message); setQrUrl(""); }
    });
  }, [qrUrl]);

  function downloadQR() {
    const link = document.createElement("a");
    link.download = "qrcode.png";
    link.href = canvas.current.toDataURL();
    link.click();
  }

  async function saveQRtoDB() {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/qrcode`,
        { destinationUrl: qrInput, qrUrl: canvas.current.toDataURL() },
        { withCredentials: true }
      );
      toast.success(res.data.qrCodeData ? "Saved!" : res.data.message);
    } catch {
      toast.error("Failed to save QR code");
    }
  }

  const filteredCountries = countries.filter((c) =>
    c.toLowerCase().includes(countrySearch.toLowerCase())
  );

  return (
    <div className="min-h-[80vh] flex flex-col items-center py-6 px-4">

      {/* Tabs */}
      <div role="tablist" className="tabs tabs-lifted mb-6">
        <a
          role="tab"
          className={`tab gap-2 ${activeTab === "shortener" ? "tab-active font-medium" : ""}`}
          onClick={() => setActiveTab("shortener")}
        >
          <Link2 size={15} /> Create Short URL
        </a>
        <a
          role="tab"
          className={`tab gap-2 ${activeTab === "qr" ? "tab-active font-medium" : ""}`}
          onClick={() => setActiveTab("qr")}
        >
          <QRIcon size={15} /> Generate QR Code
        </a>
      </div>

      {/* ── SHORT URL TAB ── */}
      {activeTab === "shortener" && (
        <div className="w-full max-w-xl bg-base-100 rounded-xl border border-base-300 shadow-sm">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-5 text-base-content">Create Short URL</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              {/* Destination URL */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-base-content">
                  Destination URL <span className="text-error">*</span>
                </label>
                <input
                  type="url"
                  name="destinationUrl"
                  placeholder="https://example.com/your-long-url"
                  className="input input-bordered w-full"
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Custom Slug + Tags in a row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-base-content flex items-center gap-1">
                    <Link2 size={13} className="text-base-content/50" /> Custom Slug
                  </label>
                  <input
                    type="text"
                    name="slugName"
                    placeholder="my-link (optional)"
                    className="input input-bordered w-full"
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-base-content flex items-center gap-1">
                    <Tag size={13} className="text-base-content/50" /> Tags
                  </label>
                  <input
                    type="text"
                    name="tags"
                    placeholder="marketing, launch (comma separated)"
                    className="input input-bordered w-full"
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Protect toggle */}
              <div className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Lock size={15} className="text-base-content/60" />
                  <span className="text-sm font-medium">Password protect this link</span>
                </div>
                <input
                  type="checkbox"
                  name="protected"
                  className="toggle toggle-primary toggle-sm"
                  checked={formData.protected}
                  onChange={handleChange}
                />
              </div>

              {formData.protected && (
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-base-content">Password</label>
                  <input
                    type="text"
                    name="password"
                    placeholder="Set a password"
                    className="input input-bordered w-full"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              {/* UTM Parameters — collapsible */}
              <details className="group border border-base-300 rounded-lg">
                <summary className="flex items-center justify-between p-3 cursor-pointer text-sm font-medium select-none list-none">
                  <span className="flex items-center gap-2">
                    <Zap size={14} className="text-base-content/50" />
                    UTM Parameters <span className="text-base-content/40 font-normal">(optional)</span>
                  </span>
                  <ChevronDown size={15} className="text-base-content/50 transition-transform group-open:rotate-180" />
                </summary>
                <div className="p-3 pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-base-300">
                  <div>
                    <label className="text-xs text-base-content/60 mb-1 block">utm_source</label>
                    <input type="text" name="utm_source" className="input input-bordered input-sm w-full" onChange={handleChange} />
                  </div>
                  <div>
                    <label className="text-xs text-base-content/60 mb-1 block">utm_medium</label>
                    <input type="text" name="utm_medium" className="input input-bordered input-sm w-full" onChange={handleChange} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs text-base-content/60 mb-1 block">utm_campaign</label>
                    <input type="text" name="utm_campaign" className="input input-bordered input-sm w-full" onChange={handleChange} />
                  </div>
                  {formData.destinationUrl && (
                    <div className="sm:col-span-2 text-xs text-base-content/50 bg-base-200 p-2 rounded break-all">
                      <strong>Preview:</strong> {buildUrlWithUTM()}
                    </div>
                  )}
                </div>
              </details>

              {/* Country Restriction — collapsible */}
              <details className="group border border-base-300 rounded-lg">
                <summary className="flex items-center justify-between p-3 cursor-pointer text-sm font-medium select-none list-none">
                  <span className="flex items-center gap-2">
                    <Globe size={14} className="text-base-content/50" />
                    Restrict Countries
                    {blockedCountries.length > 0 && (
                      <span className="badge badge-sm badge-neutral">{blockedCountries.length} blocked</span>
                    )}
                  </span>
                  <ChevronDown size={15} className="text-base-content/50 transition-transform group-open:rotate-180" />
                </summary>
                <div className="p-3 border-t border-base-300 flex flex-col gap-2">
                  <input
                    type="text"
                    placeholder="Search countries..."
                    className="input input-bordered input-sm w-full"
                    value={countrySearch}
                    onChange={(e) => setCountrySearch(e.target.value)}
                  />
                  <div className="max-h-40 overflow-y-auto grid grid-cols-2 gap-x-4 gap-y-1 pr-1">
                    {filteredCountries.map((country, idx) => (
                      <label key={idx} className="flex items-center gap-2 text-sm cursor-pointer py-0.5">
                        <input
                          type="checkbox"
                          value={country}
                          className="checkbox checkbox-xs checkbox-primary"
                          checked={blockedCountries.includes(country)}
                          onChange={handleCountrySelect}
                        />
                        <span className="truncate">{country}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </details>

              {/* Submit */}
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  "Create Short URL"
                )}
              </button>
            </form>

            {/* Result */}
            {shortUrl && (
              <div className="mt-4 flex items-center justify-between gap-2 p-3 bg-success/10 border border-success/30 rounded-lg">
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-success font-medium truncate hover:underline"
                >
                  {shortUrl}
                </a>
                <button
                  className="btn btn-sm btn-ghost gap-1 shrink-0"
                  onClick={handleCopy}
                >
                  {copied ? <Check size={15} className="text-success" /> : <Copy size={15} />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── QR CODE TAB ── */}
      {activeTab === "qr" && (
        <div className="w-full max-w-md bg-base-100 rounded-xl border border-base-300 shadow-sm">
          <div className="p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Generate QR Code</h2>
              <Link className="btn btn-sm btn-ghost" to="/qr-codes">
                Saved codes
              </Link>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Destination URL</label>
              <input
                type="text"
                placeholder="https://example.com"
                className="input input-bordered w-full"
                value={qrInput}
                onChange={(e) => { setQrInput(e.target.value); setQrError(""); setQrUrl(""); }}
                onKeyDown={(e) => e.key === "Enter" && generateQR()}
              />
              {qrError && <span className="text-xs text-error">{qrError}</span>}
            </div>

            <button
              className="btn btn-primary w-full"
              onClick={generateQR}
              disabled={!qrInput.trim()}
            >
              Generate QR
            </button>

            {qrUrl && (
              <div className="flex flex-col items-center gap-4 pt-2">
                <div className="p-4 bg-white rounded-lg border border-base-300">
                  <canvas ref={canvas} width={200} height={200} />
                </div>
                <div className="flex gap-2 w-full">
                  <button className="btn btn-outline flex-1" onClick={downloadQRCode}>
                    Download
                  </button>
                  <button className="btn btn-primary flex-1" onClick={saveQRtoDB}>
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShortUrlAndQR;
