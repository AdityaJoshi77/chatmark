import { useState, useEffect, useRef } from "react";
import {
  MdSearch,
  MdSort,
  MdBookmark,
  MdClose,
  MdPushPin,
} from "react-icons/md";
import { VscPinned } from "react-icons/vsc";
import type { BookmarkData, PinnedChat } from "./types";
import {
  addBookmark,
  getBookmarks,
  getPinnedChats,
} from "./storage";
import { scrollToAndHighlight } from "./scrollAndHighlight";
import Bookmark from "./Bookmark";
import BookmarkSaveForm from "./BookmarkSaveForm";
import ChatPinForm from "./ChatPinForm";
import FilterSelect from "./FilterSelect";
import PinnedChatCard from "./PinnedChat";
import { BubbleBookmark } from "./BubbleBookmark";
import { BubblePinChat } from "./BubblePinChat";
import { BubbleUnpinChat } from "./BubbleUnpinChat";

let openPanelFn: (snippet?: string, bubble?: HTMLElement) => void;
export function openPanelWithSnippet(snippet?: string, bubble?: HTMLElement) {
  if (openPanelFn) openPanelFn(snippet, bubble);
}

let addInstantBookmarkFn:
  | ((snippet: string, bubble: HTMLElement) => void)
  | null = null;
export function registerAddInstantBookmark(fn: typeof addInstantBookmarkFn) {
  addInstantBookmarkFn = fn;
}

function App() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [bookmarks, setBookmarks] = useState<BookmarkData[]>([]);
  const [pinnedChats, setPinnedChats] = useState<PinnedChat[]>([]);

  const [showPinOption, setShowPinOption] = useState<boolean>(true);

  const [chatId, setChatId] = useState<string>("");
  const [snippet, setSnippet] = useState("");
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [showBookMarkForm, setShowBookMarkForm] = useState<boolean>(false);
  const [showPinForm, setShowPinForm] = useState<boolean>(false);
  const [sortLatest, setSortLatest] = useState<boolean>(true);
  const [roleFilter, setRoleFilter] = useState<"All" | "User" | "ChatGPT">(
    "All"
  );

  const [tagFilter, setTagFilter] = useState("All Tags");
  const [isPinnedMode, setIsPinnedMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    openPanelFn = (newSnippet?: string, bubble?: HTMLElement) => {
      setSnippet(newSnippet || "");
      setAnchor(bubble || null);
      setIsPanelOpen(true);
      setIsPinnedMode(false);
      setShowBookMarkForm(true);
    };
  }, []);

  useEffect(() => {
    registerAddInstantBookmark(async (snippet, bubble) => {
      if (!chatId) return;

      const newBookmark: BookmarkData = {
        id: Date.now().toString(),
        chatId,
        title: "", // empty for instant bookmark
        snippet,
        role:
          bubble.dataset.messageAuthorRole === "assistant" ? "ChatGPT" : "User",
        timestamp: Date.now(),
        anchor: bubbleToSelector(bubble),
        selectionText: snippet,
      };

      // 1️⃣ Update React state
      setBookmarks((prev) => [...prev, newBookmark]);

      // 2️⃣ Persist to storage
      await addBookmark(chatId, newBookmark);

      // setIsPanelOpen(true);
      // setIsPinnedMode(false);
    });

    // expose to window for content script
    (window as any).addInstantBookmarkFn = addInstantBookmarkFn;
  }, [chatId]);

  useEffect(() => {
    let lastId = "";
    const interval = setInterval(() => {
      const id = window.location.href.split("/c/")[1] || "";
      if (id !== lastId) {
        lastId = id;
        setChatId(id);
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!chatId) return;
    const loadBookmarks = async () => {
      const stored = await getBookmarks(chatId);
      setBookmarks(stored);
    };
    loadBookmarks();
  }, [chatId]);

  useEffect(() => {
    const loadPinned = async () => {
      const pinned = await getPinnedChats();
      setPinnedChats(pinned);
    };
    loadPinned();
  }, []);

  useEffect(() => {
    if (!chatId) return;
    const existingChat = pinnedChats.find((pc) => pc.id === chatId);
    setShowPinOption(!existingChat);
  }, [pinnedChats, chatId]);

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
      if (mainContent) (mainContent as HTMLElement).style.marginRight = "0";
    };
  }, [isPanelOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isPanelOpen &&
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        setIsPanelOpen(false);
        setShowBookMarkForm(false);
        setShowPinForm(false);
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
    setShowPinForm(false);
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
    .filter((b) => roleFilter === "All" || b.role === roleFilter)
    .filter((b) =>
      [b.title, b.snippet]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    )
    .sort((a, b) =>
      sortLatest ? b.timestamp - a.timestamp : a.timestamp - b.timestamp
    );

  const uniqueTags = Array.from(
    new Set(pinnedChats.flatMap((chat) => chat.tags || []))
  );
  const filteredPinnedChats = pinnedChats
    .filter(
      (chat) =>
        tagFilter === "All Tags" || (chat.tags || []).includes(tagFilter)
    )
    .filter((chat) =>
      [chat.title, chat.description]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    )
    .sort((a, b) =>
      sortLatest
        ? new Date(b.datePinned).getTime() - new Date(a.datePinned).getTime()
        : new Date(a.datePinned).getTime() - new Date(b.datePinned).getTime()
    );

  return (
    <div className="relative">
      {/* Floating Buttons */}
      {!isPanelOpen && (
        <>
          <BubbleBookmark
            setIsPanelOpen={setIsPanelOpen}
            setIsPinnedMode={setIsPinnedMode}
            setShowBookMarkForm={setShowBookMarkForm}
          />

          {showPinOption ? (
            <BubblePinChat
              setIsPanelOpen={setIsPanelOpen}
              setShowPinForm={setShowPinForm}
            />
          ) : (
            <BubbleUnpinChat
              pinnedChats={pinnedChats}
              chatId={chatId}
              setPinnedChats={setPinnedChats}
              setShowPinOption={setShowPinOption}
            />
          )}
        </>
      )}

      {/* Panel */}
      <div
        ref={panelRef}
        className={`fixed top-0 right-0 h-full w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-out z-40 ${
          isPanelOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 h-full flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center pb-3 mb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              {isPinnedMode ? (
                <MdPushPin
                  size={16}
                  className="text-gray-600 dark:text-gray-300"
                />
              ) : (
                <MdBookmark
                  size={16}
                  className="text-gray-600 dark:text-gray-300"
                />
              )}
              <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {isPinnedMode ? "Pinned Chats" : "Bookmarks"}
              </h2>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {isPinnedMode ? pinnedChats.length : bookmarks.length}
              </span>
            </div>
            <button
              onClick={handleCancel}
              className="p-1 text-black dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors duration-200"
            >
              <MdClose size={16} />
            </button>
          </div>

          {!showBookMarkForm && !showPinForm && (
            <>
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
                  className="w-full pl-7 pr-3 py-2 text-sm rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-600 focus:border-gray-300 transition-colors duration-200"
                />
              </div>

              {/* OPTION BUTTONS SORT/FILTER */}

              {/* BOOKMARKS / PINNNED CHATS */}
              <div className="flex space-x-2 mb-4">
                <button
                  onClick={() => setIsPinnedMode(!isPinnedMode)}
                  className="flex items-center space-x-1 px-2 py-1 text-xs rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-100 transition-colors duration-200"
                >
                  {isPinnedMode ? (
                    <MdBookmark size={12} />
                  ) : (
                    <MdPushPin size={12} />
                  )}
                  <span>
                    {isPinnedMode ? "View Bookmarks" : "View Pinned Chats"}
                  </span>
                </button>

                {((isPinnedMode && pinnedChats.length > 0) ||
                  (!isPinnedMode && bookmarks.length > 0)) && (
                  <button
                    onClick={() => setSortLatest(!sortLatest)}
                    className="flex items-center space-x-1 px-2 py-1 text-xs rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-100 transition-colors duration-200"
                  >
                    <MdSort size={12} />
                    <span>{sortLatest ? "Latest" : "Oldest"}</span>
                  </button>
                )}

                {!isPinnedMode && bookmarks.length > 0 && (
                  <FilterSelect
                    value={roleFilter + " " + "Messages"}
                    options={[
                      "All Messages",
                      "User Messages",
                      "ChatGPT Messages",
                    ]}
                    onChange={(val: string) =>
                      setRoleFilter(
                        val.split(" ")[0] as "All" | "User" | "ChatGPT"
                      )
                    }
                  />
                )}

                {isPinnedMode && pinnedChats.length > 0 && (
                  <FilterSelect
                    value={tagFilter}
                    options={["All Tags", ...uniqueTags]}
                    onChange={setTagFilter}
                  />
                )}
              </div>

              {/* LIST OF ITEMS*/}
              <div className="flex-1 overflow-hidden">
                {isPinnedMode ? (
                  filteredPinnedChats.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-32 text-center">
                      <VscPinned
                        size={24}
                        className="text-gray-300 dark:text-gray-600 mb-2"
                      />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {tagFilter !== "all"
                          ? "No chats for this category"
                          : `No Saved Chats. Pin chats with the ${<BubblePinChat/>} icon on the chat to save chats`}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 h-full overflow-y-auto custom-scrollbar">
                      {filteredPinnedChats.map((chat, index) => (
                        <PinnedChatCard
                          key={index}
                          chat={chat}
                          pinnedChats={pinnedChats}
                          setIsPanelOpen={setIsPanelOpen}
                          setPinnedChats={setPinnedChats}
                          setShowPinOption={setShowPinOption}
                        />
                      ))}
                    </div>
                  )
                ) : filteredBookmarks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-32 text-center">
                    <MdBookmark
                      size={24}
                      className="text-gray-300 dark:text-gray-600 mb-2"
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {searchQuery
                        ? "No matches"
                        : "No bookmarks for this chat.\nSelect a snippet from the chat's text to bookmark."}
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
            </>
          )}

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

          {showPinForm && (
            <ChatPinForm
              setIsPanelOpen={setIsPanelOpen}
              setShowPinForm={setShowPinForm}
              setPinnedChats={setPinnedChats}
              setShowPinOption={setShowPinOption}
            />
          )}
        </div>
      </div>
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
