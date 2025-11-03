import {
  Share2,
  Eye,
  Copy,
  Mail,
  MessageCircle,
  Send,
  Twitter,
} from "lucide-react";
import { NavLink } from "react-router-dom";
 

const ShareDropdown = ({ link }) => {
 
  const fullLink = link;
  const copyToClipboard = () => {
    navigator.clipboard.writeText(link);
    alert("Link copied to clipboard!");
  };

  return (
    <ul
      tabIndex={0}
      className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-48"
    >

      <li>
        <a
          href={`https://wa.me/?text=${encodeURIComponent(fullLink)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2"
        >
          <MessageCircle size={16} /> WhatsApp
        </a>
      </li>

      <li>
        <a
          href={`https://t.me/share/url?url=${encodeURIComponent(fullLink)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2"
        >
          <Send size={16} /> Telegram
        </a>
      </li>

      <li>
        <a
          href={`mailto:?subject=Check this link&body=${encodeURIComponent(
            fullLink
          )}`}
          className="flex items-center gap-2"
        >
          <Mail size={16} /> Email
        </a>
      </li>

      <li>
        <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
            fullLink
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2"
        >
          <Twitter size={16} /> X (Twitter)
        </a>
      </li>

      <li>
        <button onClick={copyToClipboard} className="flex items-center gap-2">
          <Copy size={16} /> Copy Link
        </button>
      </li>
    </ul>
  );
};

export default ShareDropdown;
