import { useState } from "react";
import { Copy, Check } from "lucide-react";

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500); // Reset after 1.5s
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 text-sm text-gray-600 hover:text-black"
    >
      {copied ? (
        <Check size={16} className="text-green-600" />
      ) : (
        <Copy size={16} />
      )}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
};

export default CopyButton;
