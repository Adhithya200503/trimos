import { useState } from "react";
import { Copy } from "lucide-react";

const CopyButton = ({ text }) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <button onClick={handleCopy} className="">
      <Copy size={16} />
    </button>
  );
};

export default CopyButton;
