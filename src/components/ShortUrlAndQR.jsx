import { useContext, useState, useRef, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/authContext";
import { useNavigate, Link } from "react-router-dom";
import ImageUrlCutter from "../assets/image.png";
import toast from "react-hot-toast";
import { FaSpinner } from "react-icons/fa";
import QRCode from "qrcode";
import { QrCode as QRCOde } from "lucide-react";
import { FiLink2 } from "react-icons/fi";
const countries = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo, Democratic Republic of the",
  "Congo, Republic of the",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Korea, North",
  "Korea, South",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

const ShortUrlAndQR = () => {
  const [activeTab, setActiveTab] = useState("shortener");
  const [formData, setFormData] = useState({
    destinationUrl: "",
    slugName: "",
    tags: "",
    protected: false,
    password: "",
    domain: "",
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [shortUrl, setShortUrl] = useState("");
  const { user, theme } = useContext(AuthContext);
  const [blockedCountries, setBlockedCountries] = useState([]);

  const handleCountrySelect = (e) => {
    const value = e.target.value;
    const checked = e.target.checked;

    if (checked) {
      setBlockedCountries((prev) => [...prev, value]);
    } else {
      setBlockedCountries((prev) => prev.filter((c) => c !== value));
    }
  };

  useEffect(()=>{
    console.log(blockedCountries)
  },[blockedCountries])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const buildUrlWithUTM = () => {
    try {
      let url = new URL(formData.destinationUrl.trim());

      if (formData.utm_source)
        url.searchParams.set("utm_source", formData.utm_source);

      if (formData.utm_medium)
        url.searchParams.set("utm_medium", formData.utm_medium);

      if (formData.utm_campaign)
        url.searchParams.set("utm_campaign", formData.utm_campaign);

      return url.toString();
    } catch {
      return formData.destinationUrl;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Login and Start to create Short Url");
      navigate("/login");
      return;
    }

    setLoading(true);
    setShortUrl("");

    const finalUrl = buildUrlWithUTM();

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/create`,
        {
          destinationUrl: finalUrl,
          slugName: formData.slugName,
          protected: formData.protected,
          blockedCountries:blockedCountries,
          password: formData.protected ? formData.password : "",
          tags: formData.tags
            ? formData.tags.split(",").map((tag) => tag.trim())
            : [],
          domain: formData.domain || "trim-url-gpxt.onrender.com",
        },
        { withCredentials: true }
      );

      setShortUrl(res.data?.data?.shortUrl);
      toast.success("Short Url Created Successfully");
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  // ------ QR CODE STATES ------
  const [url, setUrl] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const canvas = useRef(null);
  const [error, setError] = useState("");

  function handleQrInput(e) {
    setUrl(e.target.value);
    setError("");
    setQrUrl("");
  }

  function createQRCode() {
    try {
      new URL(url);
      setError("");
      setQrUrl(url);
    } catch {
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
    const link = document.createElement("a");
    link.download = "qrcode.png";
    link.href = canvas.current.toDataURL();
    link.click();
  }

  async function saveToDataBase() {
    const canva = canvas.current;

    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/qrcode`,
      {
        destinationUrl: url,
        qrUrl: canva.toDataURL(),
      },
      { withCredentials: true }
    );

    if (res.data.qrCodeData) alert("Saved to database");
    else alert(res.data.message);
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center p-6">
      <div>
        {/* Tabs */}
        <div role="tablist" className="tabs tabs-lift mb-6 ml-4">
          <a
            role="tab"
            className={`tab ${
              activeTab === "shortener" ? "tab-active" : ""
            } flex items-center gap-2`}
            onClick={() => setActiveTab("shortener")}
          >
            <FiLink2 /> Create Short URL
          </a>

          <a
            role="tab"
            className={`tab ${
              activeTab === "qr" ? "tab-active" : ""
            } flex items-center gap-2`}
            onClick={() => setActiveTab("qr")}
          >
            <QRCOde size={14} /> Generate QR Code
          </a>
        </div>

        {/* ---------------- Short URL Section ---------------- */}
        {activeTab === "shortener" && (
          <div className="card w-[350px] sm:w-[600px]">
            <div className="card-body">
              <h2 className="card-title text-center text-2xl sm:text-3xl font-semibold mb-4 flex items-center gap-6">
                <span>Create Short URL</span>
                <img
                  className="hidden sm:block w-[100px] h-[50px]"
                  src={ImageUrlCutter}
                />
              </h2>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Destination URL */}
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">
                      Destination URL
                    </span>
                  </label>
                  <input
                    type="text"
                    name="destinationUrl"
                    placeholder="https://example.com"
                    className="input input-bordered w-full"
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* UTM */}
                <div className="border border-gray-300 p-3 rounded-md">
                  <p className="font-semibold mb-2 text-sm text-gray-700">
                    Add UTM Parameters (optional)
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium">utm_source</label>
                      <input
                        type="text"
                        name="utm_source"
                        className="input input-bordered w-full input-sm"
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium">utm_medium</label>
                      <input
                        type="text"
                        name="utm_medium"
                        className="input input-bordered w-full input-sm"
                        onChange={handleChange}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-medium">
                        utm_campaign
                      </label>
                      <input
                        type="text"
                        name="utm_campaign"
                        className="input input-bordered w-full input-sm"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Domain + Slug */}
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  <div className="flex-1">
                    <label className="label">
                      <span className="label-text font-semibold">Domain</span>
                    </label>

                    <select
                      name="domain"
                      value={formData.domain}
                      onChange={handleChange}
                      className="select select-bordered select-neutral w-full"
                    >
                      <option value="trim-url-gpxt.onrender.com">
                        trim-url-gpxt.onrender.com (Default)
                      </option>

                      {user?.customDomain?.length > 0 ? (
                        user.customDomain.map((domain, idx) => (
                          <option key={idx} value={domain.name}>
                            {domain.name}
                          </option>
                        ))
                      ) : (
                        <option disabled>No Custom Domain</option>
                      )}
                    </select>
                  </div>

                  <div className="flex-1">
                    <label className="label">
                      <span className="label-text font-semibold">
                        Custom Slug
                      </span>
                    </label>
                    <input
                      type="text"
                      name="slugName"
                      placeholder="e.g., my-link"
                      className="input input-bordered w-full"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">Tags</span>
                  </label>
                  <input
                    type="text"
                    name="tags"
                    className="input input-bordered w-full"
                    onChange={handleChange}
                  />
                </div>

                {/* Protection */}
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Protect this URL</span>
                  <input
                    type="checkbox"
                    name="protected"
                    className="toggle toggle-primary"
                    checked={formData.protected}
                    onChange={handleChange}
                  />
                </div>

                {formData.protected && (
                  <div>
                    <label className="label">
                      <span className="label-text font-semibold">
                        Set a Password
                      </span>
                    </label>
                    <input
                      type="text"
                      name="password"
                      className="input input-bordered w-full"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                )}

                {/* Preview */}
                {formData.destinationUrl && (
                  <div className="text-xs text-gray-600 break-words border p-2 rounded bg-gray-50 mt-2">
                    <strong>Preview:</strong> {buildUrlWithUTM()}
                  </div>
                )}

                <div className="flex flex-col gap-y-2.5">
                  <span className="font-bold">Restrict Countries</span>

                  <div className="max-h-40 overflow-y-auto border-none p-3 rounded-lg">
                    {countries.map((country, idx) => (
                      <label
                        key={idx}
                        className="flex items-center gap-x-2 mb-1"
                      >
                        <input
                          type="checkbox"
                          value={country}
                          onChange={(e) => handleCountrySelect(e)}
                        />
                        <span>{country}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Button */}
                <button
                  type="submit"
                  className={`w-full bg-blue-500 text-white py-2 rounded-sm flex items-center justify-center ${
                    loading
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:bg-blue-600"
                  }`}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <FaSpinner className="animate-spin" />
                      <span>Creating...</span>
                    </div>
                  ) : (
                    "Create Short URL"
                  )}
                </button>
              </form>

              {/* Short URL Output */}
              {shortUrl && (
                <div className="alert alert-success mt-4 flex justify-between">
                  <span>
                    <strong>Short URL:</strong>{" "}
                    <a
                      href={shortUrl}
                      target="_blank"
                      className="link link-primary"
                    >
                      {shortUrl}
                    </a>
                  </span>

                  <button
                    className="btn btn-sm"
                    onClick={() => navigator.clipboard.writeText(shortUrl)}
                  >
                    Copy
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ---------------- QR CODE Section ---------------- */}
        {activeTab === "qr" && (
          <div className="card w-[350px] sm:w-[550px]">
            <div className="card-body items-center gap-4">
              <Link
                className="btn btn-sm bg-blue-500 text-white self-end"
                to="/qr-codes"
              >
                Saved QR codes
              </Link>

              <span className="font-bold text-2xl">Create QR Code</span>

              <input
                type="text"
                placeholder="Enter destination URL"
                className="input w-full"
                value={url}
                onChange={handleQrInput}
                onKeyDown={(e) => e.key === "Enter" && createQRCode()}
              />

              {error && <div className="text-sm text-red-500">{error}</div>}

              <button
                className="btn bg-blue-500 text-white w-full"
                onClick={createQRCode}
                disabled={!url.trim()}
              >
                Generate QR
              </button>

              {/* QR Preview */}
              {qrUrl && (
                <div className="flex flex-col items-center gap-3">
                  <canvas ref={canvas} width={200} height={200}></canvas>

                  <div className="flex gap-3">
                    <button
                      className="btn bg-amber-500"
                      onClick={downloadQRCode}
                    >
                      Download
                    </button>

                    <button
                      className="btn bg-primary text-white"
                      onClick={saveToDataBase}
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShortUrlAndQR;
