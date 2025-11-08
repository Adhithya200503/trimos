import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, X, Copy, TagIcon } from "lucide-react";
import { Eye, EyeOff } from "lucide-react";


const LinkEditPage = () => {
  const { slugName } = useParams();
  const navigate = useNavigate();

  const [linkData, setLinkData] = useState({
    destinationUrl: "",
    slugName: "",
    tags: [],
    protected: false,
    password: "",
    showPassword: false,
  });

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [newTag, setNewTag] = useState("");
  const [allTags, setAllTags] = useState([]); // ✅ all distinct tags
  const [selectedExistingTag, setSelectedExistingTag] = useState([]);

  // Fetch link data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/short-url/${slugName}`,
          { withCredentials: true }
        );
        setLinkData((prev) => ({
          ...prev,
          ...res.data.result,
          showPassword: false,
        }));
      } catch (err) {
        setErrorMsg(err.response?.data?.message || "Failed to fetch link data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slugName]);

  // Fetch all distinct tags for this user
  useEffect(() => {
    async function fetchAllTags() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/tags`,
          {
            withCredentials: true,
          }
        );
        setAllTags(res.data.tags);
      } catch (error) {
        console.error("Failed to fetch distinct tags:", error.message);
      }
    }
    fetchAllTags();
  }, []);

  const handleChange = (e) => {
    setLinkData({ ...linkData, [e.target.name]: e.target.value });
  };

  const handleAddTag = () => {
    if (newTag.trim() && !linkData.tags.includes(newTag.trim())) {
      setLinkData({ ...linkData, tags: [...linkData.tags, newTag.trim()] });
      setNewTag("");
    }
  };

  const handleSelectTag = () => {
    if (selectedExistingTag && !linkData.tags.includes(selectedExistingTag)) {
      setLinkData({
        ...linkData,
        tags: [...linkData.tags, selectedExistingTag],
      });
      setSelectedExistingTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setLinkData({
      ...linkData,
      tags: linkData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleSave = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/short-url/${linkData._id}`,
        {
          destinationUrl: linkData.destinationUrl,
          slugName: linkData.slugName,
          tags: linkData.tags,
          protected: linkData.protected || false,
          password: linkData.protected ? linkData.password : null,
        },
        { withCredentials: true }
      );

      setSuccessMsg("✅ Short URL updated successfully!");
      setLinkData(res.data.data);
    } catch (err) {
      if (err.response?.status === 409) {
        setErrorMsg("⚠️ Slug name already exists, please choose another one.");
      } else {
        setErrorMsg(err.response?.data?.message || "Failed to update link");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!linkData) {
    return (
      <div className="flex justify-center items-center min-h-screen text-error">
        {errorMsg || "Link not found"}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6">
      <div className="flex justify-between items-center mb-6 ">
        <h2 className="text-2xl font-semibold">Edit Short Link</h2>
        <button onClick={() => navigate(-1)} className="btn btn-outline btn-sm">
          ← Back
        </button>
      </div>

      {/* Success / Error Alerts */}
      {errorMsg && (
        <div className="alert alert-error mb-4 text-sm">{errorMsg}</div>
      )}
      {successMsg && (
        <div className="alert alert-success mb-4 text-sm">{successMsg}</div>
      )}

      {/* Destination URL */}
      <div className="form-control mb-4">
        <label className="label">Destination URL</label>
        <input
          type="text"
          name="destinationUrl"
          value={linkData.destinationUrl}
          onChange={handleChange}
          className="input input-bordered w-full"
        />
      </div>

      {/* Slug */}
      <div className="form-control mb-4">
        <label className="label">Slug Name</label>
        <input
          type="text"
          name="slugName"
          value={linkData.slugName}
          onChange={handleChange}
          className="input input-bordered w-full"
        />
      </div>

      {/* Short URL */}
      <div className="form-control mb-4">
        <label className="label">Short URL</label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={linkData.shortUrl}
            readOnly
            className="input input-bordered w-full"
          />
          <button
            className="btn btn-outline btn-sm"
            onClick={() => navigator.clipboard.writeText(linkData.shortUrl)}
          >
            <Copy size={16} />
          </button>
        </div>
      </div>
      {/* 🆕 Password Protection Section */}
      <div className="form-control mb-4">
        <label className="label cursor-pointer flex justify-between items-center">
          <span className="label-text text-sm font-medium">
            Enable Password Protection
          </span>
          <input
            type="checkbox"
            className="toggle toggle-primary"
            checked={!!linkData.protected}
            onChange={(e) => {
              const checked = e.target.checked;
              setLinkData((prev) => ({
                ...prev,
                protected: checked,
                password: checked ? prev.password || "" : "",
              }));
            }}
          />
        </label>

        {/* Password input visible only if protection is enabled */}
        {linkData.protected && (
          <div className="mt-3 relative">
            <input
              type={linkData.showPassword ? "text" : "password"}
              placeholder="Enter password"
              className="input input-bordered w-full pr-10"
              value={linkData.password || ""}
              onChange={(e) =>
                setLinkData((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              onClick={() =>
                setLinkData((prev) => ({
                  ...prev,
                  showPassword: !prev.showPassword,
                }))
              }
            >
              {linkData.showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        )}
      </div>

      {/* Tags Section */}
      <div className="form-control mb-4">
        <label className="label flex items-center gap-2">
          <TagIcon size={16} /> Tags
        </label>

        {/* Display current tags */}
        <div className="flex flex-wrap gap-2 mb-2">
          {linkData.tags?.length > 0 ? (
            linkData.tags.map((tag, index) => (
              <div
                key={index}
                className="badge select-none rounded-sm bg-gray-200 dark:bg-blue-500 gap-2 px-3 py-3 text-sm"
              >
                {tag}
                <X
                  size={14}
                  className="cursor-pointer hover:text-error"
                  onClick={() => handleRemoveTag(tag)}
                />
              </div>
            ))
          ) : (
            <span className="text-sm opacity-70">No tags added yet</span>
          )}
        </div>

        {/* Add existing tag (select) */}
        {/* Add existing tags (multi-select) */}
        <div className="form-control mb-3">
          <label className="label text-sm opacity-70">
            Select existing tags
          </label>

          {/* Use details/summary for dropdown but position content absolutely so it doesn't push layout */}
          <details className="relative" ref={null}>
            <summary className="flex items-center justify-between cursor-pointer w-full px-3 py-2 border rounded-md bg-white dark:bg-[#1D232A]">
              <span className="text-sm">
                {selectedExistingTag.length > 0
                  ? `${selectedExistingTag.length} selected`
                  : "Select tags to add"}
              </span>
              <span className="text-xs opacity-60">▾</span>
            </summary>

            {/* Dropdown panel */}
            <div className="absolute left-0 right-0 mt-2 z-50 bg-white dark:bg-[#1D232A] border rounded-md shadow-md p-2">
              <ul className="max-h-44 overflow-y-auto space-y-1">
                {allTags
                  .filter((t) => !linkData.tags.includes(t)) // hide tags already attached to this link
                  .map((tag, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between px-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-800 rounded"
                    >
                      <label className="flex items-center gap-2 w-full cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedExistingTag.includes(tag)}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setSelectedExistingTag((prev) =>
                              checked
                                ? [...prev, tag]
                                : prev.filter((t) => t !== tag)
                            );
                          }}
                          className="checkbox checkbox-sm checkbox-primary"
                        />
                        <span className="text-sm">{tag}</span>
                      </label>
                    </li>
                  ))}

                {/* If there are no available tags show helpful text */}
                {allTags.filter((t) => !linkData.tags.includes(t)).length ===
                  0 && (
                  <li className="px-2 py-1 text-xs text-gray-500">
                    No available existing tags
                  </li>
                )}
              </ul>

              {/* Add button aligned right */}
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    if (selectedExistingTag.length === 0) return;

                    // only add tags that are not already present (defensive)
                    const newTagsToAdd = selectedExistingTag.filter(
                      (t) => !linkData.tags.includes(t)
                    );

                    setLinkData((prev) => ({
                      ...prev,
                      tags: [...(prev.tags || []), ...newTagsToAdd],
                    }));

                    // clear selection
                    setSelectedExistingTag([]);

                    // optional: close the <details> automatically by blurring the summary
                    // Find open <details> and close it:
                    const openDetails =
                      document.querySelectorAll("details[open]");
                    openDetails.forEach((d) => d.removeAttribute("open"));
                  }}
                >
                  Add Selected Tags
                </button>
              </div>
            </div>
          </details>
        </div>

        {/* Add new tag manually */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Add a new tag..."
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            className="input input-sm input-bordered w-full"
            onKeyDown={(e) =>
              e.key === "Enter" && (e.preventDefault(), handleAddTag())
            }
          />
          <button className="btn btn-primary btn-sm" onClick={handleAddTag}>
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button className="btn btn-primary" onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default LinkEditPage;
