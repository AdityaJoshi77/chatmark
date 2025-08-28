import { HiOutlineTrash } from "react-icons/hi2";
import type { PinnedChat } from "./types";
import { removePinnedChat } from "./storage";
import { formatTime } from "./App";

interface PinnedChatCardProps {
  chat: PinnedChat;
  pinnedChats: PinnedChat[];
  setPinnedChats: React.Dispatch<React.SetStateAction<PinnedChat[]>>;
}

const PinnedChatCard: React.FC<PinnedChatCardProps> = ({ chat, pinnedChats, setPinnedChats }) => {
  return (
    <div
      key={chat.id}
      className="group p-3 rounded border border-gray-200 dark:border-gray-700
                 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750
                 cursor-pointer transition-colors duration-200 mr-2"
      onClick={() => window.open(chat.url, "_blank")}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate flex-1 mr-2">
          {chat.title}
        </h3>
        <button
          onClick={async (e) => {
            e.stopPropagation();
            const updated = pinnedChats.filter((c) => c.id !== chat.id);
            setPinnedChats(updated);
            await removePinnedChat(chat.id);
          }}
          className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 
                     hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 
                     rounded transition-all duration-200"
          title="Unpin"
        >
          <HiOutlineTrash size={20} />
        </button>
      </div>

      {chat.description && (
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
          {chat.description}
        </p>
      )}

      {chat.tags && chat.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {chat.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700"
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
