import { useState } from "react";
import axios from "axios";

const SearchUrl = ({ setUrls }) => {
  const [tag, setTag] = useState("");

  const handleSearch = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/search?tag=${tag}`,{withCredentials:true});
      setUrls(res.data.results);
    } catch (err) {
      alert(err.response?.data?.message || "Error searching URLs");
    }
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        placeholder="Search by tag"
        className="border p-2 rounded grow"
        value={tag}
        onChange={(e) => setTag(e.target.value)}
      />
      <button
        onClick={handleSearch}
        className="bg-green-600 text-white p-2 rounded"
      >
        Search
      </button>
    </div>
  );
};

export default SearchUrl;
