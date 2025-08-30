import { HiOutlineTrash } from "react-icons/hi2";
import type { BookmarkData } from "./types";
import { saveBookmarks } from "./storage";
import { formatTime } from "./App";

interface BookmarkProps {
  key?: number;
  bm: BookmarkData;
  chatId: string;
  bookmarks: BookmarkData[];
  handleBookmarkClick: (bm: BookmarkData) => void;
  setBookmarks: React.Dispatch<React.SetStateAction<BookmarkData[]>>;
}

const Bookmark = ({
  bm,
  chatId,
  bookmarks,
  handleBookmarkClick,
  setBookmarks,
}: BookmarkProps) => {
  return (
    <div
      key={bm.id}
      className="group p-3 rounded border border-gray-200 dark:border-gray-700
               bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750
                 cursor-pointer transition-colors duration-200 mr-2"
      onClick={() => handleBookmarkClick(bm)}
    >
      <div className="flex justify-between items-start mb-2">
        <h3
          className="text-sm font-medium text-gray-900 
                    dark:text-gray-100 truncate flex-1 mr-2"
        >
          {bm.snippet}
        </h3>
        <button
          onClick={async (e) => {
            e.stopPropagation();
            const updated = bookmarks.filter((b) => b.id !== bm.id);
            setBookmarks(updated);
            await saveBookmarks(chatId, updated);
          }}
          className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 
                   hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 
                   rounded transition-all duration-200"
          title="Delete Bookmark"
        >
          <HiOutlineTrash size={18} />
        </button>
      </div>

      {bm.title.length > 0 && (
        <p className="text-xs text-gray-700 dark:text-gray-300 mb-2 line-clamp-2">
          About: {bm.title}
        </p>
      )}

      <div className="flex justify-between items-center">
        <span className="text-xs px-2 py-0.5 rounded text-gray-500 dark:text-gray-200 bg-gray-100 dark:bg-gray-700" title={`${bm.role}'s message`}>
          {bm.role}
        </span>
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {formatTime(bm.timestamp)}
        </span>
      </div>
    </div>
  );
};

export default Bookmark;
