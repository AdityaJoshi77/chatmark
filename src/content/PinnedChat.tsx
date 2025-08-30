import { useState } from "react";
import type { PinnedChat } from "./types";
import { removePinnedChat } from "./storage";
import { formatTime } from "./App";
import { RiUnpinFill } from "react-icons/ri";
import { ImNewTab } from "react-icons/im";

interface PinnedChatCardProps {
  chat: PinnedChat;
  pinnedChats: PinnedChat[];
  setIsPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setPinnedChats: React.Dispatch<React.SetStateAction<PinnedChat[]>>;
  setShowPinOption: React.Dispatch<React.SetStateAction<boolean>>;
}

const PinnedChatCard: React.FC<PinnedChatCardProps> = ({
  chat,
  pinnedChats,
  setIsPanelOpen,
  setPinnedChats,
  setShowPinOption,
}) => {
  const [showWarning, setShowWarning] = useState(false);

  const handleUnpin = async () => {
    const updated = pinnedChats.filter((c) => c.id !== chat.id);
    setPinnedChats(updated);
    await removePinnedChat(chat.id);
    // setIsPanelOpen(true);
    setShowPinOption(true);
    setShowWarning(false);
  };

  if (showWarning) {
    return (
      <div
        key={chat.id}
        className="p-3 rounded border border-gray-200 dark:border-gray-700
                   bg-white dark:bg-gray-800 transition-colors duration-200 mr-2"
      >
        <p className="text-xs text-gray-700 dark:text-gray-300 mb-2">
          ⚠️ Are you sure you want to unpin this chat?  
          <br />
          Don't Worry - Bookmarks of this chat will stay safe.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setShowWarning(false)}
            className="px-2 py-0.5 rounded text-xs bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleUnpin}
            className="px-2 py-0.5 rounded text-xs bg-red-500 text-white hover:bg-red-600 transition"
          >
            Unpin
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      key={chat.id}
      className="group p-3 rounded border border-gray-200 dark:border-gray-700
                 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750
                 cursor-pointer transition-colors duration-200 mr-2"
      title="Open Chat in Current Tab"
      onClick={() => (window.location.href = chat.url)}
    >
      {/* Title Area */}
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate flex-1 mr-2">
          {chat.title}
        </h3>

        {/* Open in new tab button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            window.open(chat.url, "_blank");
          }}
          className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 
                     hover:text-yellow-500 hover:bg-gray-100 dark:hover:bg-gray-700 
                     rounded transition-all duration-200"
          title="Open Chat in New Tab"
        >
          <ImNewTab size={20} />
        </button>

        {/* Unpin button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowWarning(true);
          }}
          className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 
                     hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 
                     rounded transition-all duration-200"
          title="Unpin Chat"
        >
          <RiUnpinFill size={20} />
        </button>
      </div>

      {chat.description && (
        <p className="text-xs text-gray-700 dark:text-gray-300 mb-2 line-clamp-2">
          About: {chat.description}
        </p>
      )}

      {chat.tags && chat.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {chat.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex justify-end items-center">
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {formatTime(new Date(chat.datePinned).getTime())}
        </span>
      </div>
    </div>
  );
};

export default PinnedChatCard;
