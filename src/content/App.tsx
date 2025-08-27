import { useState, useEffect, useRef } from "react";
import { MdSearch, MdSort, MdBookmark, MdClose } from "react-icons/md";
import { VscPinned } from "react-icons/vsc";
import type { BookmarkData } from "./types";
import { getBookmarks } from "./storage";
import { scrollToAndHighlight } from "./scrollAndHighlight";
import Bookmark from "./Bookmark";
import BookmarkSaveForm from "./BookmarkSaveForm";
import ChatPinForm from "./ChatPinForm";

// Function called by the floating selection icon
let openPanelFn: (snippet?: string, bubble?: HTMLElement) => void;
export function openPanelWithSnippet(snippet?: string, bubble?: HTMLElement) {
  if (openPanelFn) openPanelFn(snippet, bubble);
}

function App() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [bookmarks, setBookmarks] = useState<BookmarkData[]>([]);
  const [chatId, setChatId] = useState<string>("");
  const [snippet, setSnippet] = useState("");
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [showBookMarkForm, setShowBookMarkForm] = useState<boolean>(false);
  const [showPinForm, setShowPinForm] = useState<boolean>(false);
  const [sortLatest, setSortLatest] = useState<boolean>(true);
  const [roleFilter, setRoleFilter] = useState<"all" | "user" | "assistant">(
    "all"
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const panelRef = useRef<HTMLDivElement>(null);

  // setup openPanelFn once
  useEffect(() => {
    openPanelFn = (newSnippet?: string, bubble?: HTMLElement) => {
      setSnippet(newSnippet || "");
      setAnchor(bubble || null);
      setIsPanelOpen(true);
      setShowBookMarkForm(true);
    };
  }, []);

  // periodic check for chatId
  useEffect(() => {
    let lastId = "";

    const interval = setInterval(() => {
      const id = window.location.href.split("/c/")[1] || "";
      if (id !== lastId) {
        lastId = id;
        setChatId(id);
      }
    }, 500); // check every half second

    return () => clearInterval(interval);
  }, []);

  // load bookmarks whenever chatId changes
  useEffect(() => {
    if (!chatId) return;
    const loadBookmarks = async () => {
      const stored = await getBookmarks(chatId);
      setBookmarks(stored);
    };
    loadBookmarks();
  }, [chatId]);

  // push content when panel opens
  useEffect(() => {
    const mainContent = document.querySelector(
      "main, .main, #root > div, body > div"
    );
    if (mainContent) {
      (mainContent as HTMLElement).style.transition =
        "margin-right 0.3s ease-out";
      (mainContent as HTMLElement).style.marginRight = isPanelOpen
        ? "320px"
        : "0";
    }

    return () => {
      if (mainContent) {
        (mainContent as HTMLElement).style.marginRight = "0";
      }
    };
  }, [isPanelOpen]);

  // close panel on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isPanelOpen &&
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        setIsPanelOpen(false);
        setShowBookMarkForm(false);
        setSnippet("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isPanelOpen]);

  const handleCancel = () => {
    setIsPanelOpen(false);
    setSnippet("");
    setShowBookMarkForm(false);
  };

  const handleBookmarkClick = async (bm: BookmarkData) => {
    try {
      scrollToAndHighlight(bm.anchor, bm.snippet);
      setIsPanelOpen(false);
    } catch (err) {
      console.error("Failed to load highlighter:", err);
    }
  };

  const filteredBookmarks = bookmarks
    .filter((b) => roleFilter === "all" || b.role === roleFilter)
    .filter((b) =>
      [b.title, b.snippet]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    )
    .sort((a, b) =>
      sortLatest ? b.timestamp - a.timestamp : a.timestamp - b.timestamp
    );

  return (
    // EXTENSION TOGGLE BUBBLE
    <div className="relative">
      {!isPanelOpen && (
        <button
          className="fixed top-32 right-4 flex items-center justify-center 
                     bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300
                     w-10 h-10 rounded-full shadow-lg border border-gray-200 dark:border-gray-700
                     hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900  dark:hover:text-gray-100
                     transition-all duration-200 z-50"
          onClick={() => setIsPanelOpen(true)}
          title="Open ChatMark"
        >
          <MdBookmark size={18} />
        </button>
      )}

      {!isPanelOpen && (
        <button
          className="fixed top-44 right-4 flex items-center justify-center 
                     bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300
                     w-10 h-10 rounded-full shadow-lg border border-gray-200 dark:border-gray-700
                     hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900  dark:hover:text-gray-100
                     transition-all duration-200 z-50"
          onClick={() => {
            setIsPanelOpen(true);
            setShowBookMarkForm(true);
          }}
          title="Pin this Chat"
        >
          <VscPinned size={18} />
        </button>
      )}

      {/* EXTENSION PANEL */}
      <div
        ref={panelRef}
        className={`fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-800 
                   border-l border-gray-200 dark:border-gray-700
                   transform transition-transform duration-300 ease-out z-40
                   ${isPanelOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-4 h-full flex flex-col">
          <div className="flex justify-between items-center pb-3 mb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <MdBookmark
                size={16}
                className="text-gray-600 dark:text-gray-300"
              />
              <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Bookmarks
              </h2>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                ({bookmarks.length})
              </span>
            </div>
            <button
              onClick={handleCancel}
              className="p-1 text-black dark:text-gray-300
                         hover:bg-gray-100 dark:hover:bg-gray-700 rounded 
                         transition-colors duration-200"
            >
              <MdClose size={16} />
            </button>
          </div>

          {!showBookMarkForm && (
            <>
              {/* SEARCH BAR */}
              <div className="relative mb-3">
                <MdSearch
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={14}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-7 pr-3 py-2 text-sm rounded border border-gray-200 dark:border-gray-600
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                           placeholder-gray-400 dark:placeholder-gray-500
                           focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-600 focus:border-gray-300
                           transition-colors duration-200"
                />
              </div>

              {/* BOOKMARK SORT/FILTER BUTTONS */}
              {bookmarks.length > 0 && (
                <div className="flex space-x-2 mb-4">
                  {/* Oldest/Latest */}
                  <button
                    onClick={() => setSortLatest(!sortLatest)}
                    className="flex items-center space-x-1 px-2 py-1 text-xs rounded
                             bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600
                             text-gray-600 dark:text-gray-300 transition-colors duration-200"
                  >
                    <MdSort size={12} />
                    <span>{sortLatest ? "Latest" : "Oldest"}</span>
                  </button>

                  {/* Filter: User/Assistant */}
                  <select
                    value={roleFilter}
                    onChange={(e) =>
                      setRoleFilter(
                        e.target.value as "all" | "user" | "assistant"
                      )
                    }
                    className="px-2 py-1 text-xs rounded border border-gray-200 dark:border-gray-600
                             bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300
                             focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-600 cursor-pointer"
                  >
                    <option value="all">All msgs</option>
                    <option value="user">User's msgs</option>
                    <option value="assistant">GPT's msgs</option>
                  </select>

                  {/* Pinned Chats */}
                  <button
                    onClick={() => setSortLatest(!sortLatest)}
                    className="flex items-center space-x-1 px-2 py-1 text-xs rounded
                             bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600
                             text-gray-600 dark:text-gray-300 transition-colors duration-200"
                  >
                    <VscPinned size={16} />
                    <span>Pinned Chats</span>
                  </button>
                </div>
              )}
            </>
          )}

          {/* BOOKMARK SAVING FORM */}
          {showBookMarkForm && (
            <BookmarkSaveForm
              snippet={snippet}
              chatId={chatId}
              anchor={anchor}
              bookmarks={bookmarks}
              setSnippet={setSnippet}
              setAnchor={setAnchor}
              setBookmarks={setBookmarks}
              setIsPanelOpen={setIsPanelOpen}
              setShowBookMarkForm={setShowBookMarkForm}
            />
          )}

          {/* THE BOOKMARKS */}
          {!showBookMarkForm && (
            <div className="flex-1 overflow-hidden">
              {filteredBookmarks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-center">
                  {/* Fallback for no bookmarks */}
                  <MdBookmark
                    size={24}
                    className="text-gray-300 dark:text-gray-600 mb-2"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {searchQuery ? "No matches" : "No bookmarks for this Chat"}
                  </p>
                </div>
              ) : (
                <div className="space-y-2 h-full overflow-y-auto custom-scrollbar">
                  {filteredBookmarks.map((bm, index) => (
                    <Bookmark
                      key={index}
                      bm={bm}
                      chatId={chatId}
                      bookmarks={bookmarks}
                      handleBookmarkClick={handleBookmarkClick}
                      setBookmarks={setBookmarks}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {/* #1f2937,  */}
      <style>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #9ca3af #f9fafb;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f9fafb;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #9ca3af;
          border-radius: 10px;
          border: 2px solid #f9fafb;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #6b7280;
        }
        .dark .custom-scrollbar {
          scrollbar-color: #5a5a5a #181818;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
      `}</style>
    </div>
  );
}

export function bubbleToSelector(el: Element | null): string {
  if (!el) return "";
  const id = el.getAttribute("data-message-id");
  return id ? `[data-message-id="${id}"]` : "";
}

export const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
  if (diffInHours < 48) return "Yesterday";
  return date.toLocaleDateString();
};

export default App;
