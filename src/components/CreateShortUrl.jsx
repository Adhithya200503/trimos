import { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import ImageUrlCutter from "../assets/image.png"
const CreateShortUrl = () => {
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
  const { user } = useContext(AuthContext);

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
      // If not a valid URL yet (user still typing)
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
          password: formData.protected ? formData.password : "",
          tags: formData.tags
            ? formData.tags.split(",").map((tag) => tag.trim())
            : [],
        },
        { withCredentials: true }
      );

      console.log("Response:", res.data);
      setShortUrl(res.data?.data?.shortUrl);
    } catch (err) {
      alert(err.response?.data?.message || "Error creating URL");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="card w-[350px] sm:w-[600px]">
        <div className="card-body">
          <h2 className="card-title text-center text-2xl sm:text-3xl font-semibold mb-4 flex items-center gap-6">
           <span >Create Short URL</span> <img className="hidden sm:block w-[100px] h-[50px]" src={ImageUrlCutter} />
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

            {/* UTM Parameters */}
            <div className="border border-gray-300 p-3 rounded-md">
              <p className="font-semibold mb-2 text-sm text-gray-700">
                Add UTM Parameters (optional)
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="label-text text-xs font-medium">
                    utm_source
                  </label>
                  <input
                    type="text"
                    name="utm_source"
                    placeholder="e.g., newsletter, facebook"
                    className="input input-bordered w-full input-sm"
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="label-text text-xs font-medium">
                    utm_medium
                  </label>
                  <input
                    type="text"
                    name="utm_medium"
                    placeholder="e.g., email, cpc"
                    className="input input-bordered w-full input-sm"
                    onChange={handleChange}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="label-text text-xs font-medium">
                    utm_campaign
                  </label>
                  <input
                    type="text"
                    name="utm_campaign"
                    placeholder="e.g., black-friday, product-launch"
                    className="input input-bordered w-full input-sm"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Custom Slug */}
            <div>
              <label className="label">
                <span className="label-text font-semibold">Custom Slug</span>
              </label>
              <input
                type="text"
                name="slugName"
                placeholder="e.g., my-link"
                className="input input-bordered w-full"
                onChange={handleChange}
              />
            </div>

            {/* Tags */}
            <div>
              <label className="label">
                <span className="label-text font-semibold">Tags</span>
              </label>
              <input
                type="text"
                name="tags"
                placeholder="e.g., marketing, blog"
                className="input input-bordered w-full"
                onChange={handleChange}
              />
            </div>

            {/* Protect URL Switch */}
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

            {/* Password Input */}
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
                  placeholder="Enter a password"
                  className="input input-bordered w-full"
                  value={formData.password}
                  onChange={handleChange}
                  required={formData.protected}
                />
              </div>
            )}

            {/* Preview of Final URL */}
            {formData.destinationUrl && (
              <div className="text-xs text-gray-600 break-words border p-2 rounded bg-gray-50 mt-2">
                <strong>Preview:</strong> {buildUrlWithUTM()}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className={`btn bg-blue-500 text-white rounded-sm w-full ${
                loading ? "loading" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Short URL"}
            </button>
          </form>

          {/* Success Message */}
          {shortUrl && (
            <div className="alert alert-success mt-4 flex flex-col sm:flex-row items-center justify-between">
              <div>
                <span className="font-medium">Short URL Created:</span>{" "}
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link link-primary"
                >
                  {shortUrl}
                </a>
              </div>
              <button
                className="btn btn-sm btn-outline"
                onClick={() => navigator.clipboard.writeText(shortUrl)}
              >
                Copy
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateShortUrl;
