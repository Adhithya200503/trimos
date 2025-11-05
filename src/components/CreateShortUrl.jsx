import { useState } from "react";
import axios from "axios";

const CreateShortUrl = () => {
  const [formData, setFormData] = useState({
    destinationUrl: "",
    slugName: "",
    tags: "",
    protected: false,
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [shortUrl, setShortUrl] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShortUrl("");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/create`,
        {
          destinationUrl: formData.destinationUrl,
          slugName: formData.slugName,
          protected: formData.protected,
          password: formData.protected ? formData.password : "", // send only if protected
          tags: formData.tags
            ? formData.tags.split(",").map((tag) => tag.trim())
            : [],
        },
        { withCredentials: true }
      );
      console.log("the hello :",res.data)
      setShortUrl(res.data?.data?.shortUrl);
    } catch (err) {
      alert(err.response?.data?.message || "Error creating URL");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="card w-[350px] sm:w-[500px]">
        <div className="card-body">
          <h2 className="card-title text-center text-2xl font-semibold mb-4">
             Create Short URL
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

            {/* Password Input (visible only if protected is true) */}
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

            {/* Submit Button */}
            <button
              type="submit"
              className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
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
