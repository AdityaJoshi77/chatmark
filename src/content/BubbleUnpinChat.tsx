import { useState } from "react";
import { RiUnpinFill } from "react-icons/ri";
import { removePinnedChat } from "./storage";
import type { PinnedChat } from "./types";

interface BubbleUnpinChatProps {
  pinnedChats: PinnedChat[];
  chatId: string;
  setPinnedChats: React.Dispatch<React.SetStateAction<PinnedChat[]>>;
  setShowPinOption: React.Dispatch<React.SetStateAction<boolean>>;
}

export const BubbleUnpinChat = ({
  pinnedChats,
  chatId,
  setPinnedChats,
  setShowPinOption,
}: BubbleUnpinChatProps) => {
  const [showWarning, setShowWarning] = useState(false);

  const handleUnpin = async () => {
    const updated = pinnedChats.filter((c) => c.id !== chatId);
    setPinnedChats(updated);
    await removePinnedChat(chatId);
    setShowPinOption(true);
    setShowWarning(false);
  };

  return (
    <>
      {/* Unpin Button */}
      <button
        className="fixed top-44 right-4 flex items-center justify-center bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 w-10 h-10 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-200 z-50"
        onClick={(e) => {
          e.stopPropagation();
          setShowWarning(true);
        }}
        title="Unpin this Chat"
      >
        <RiUnpinFill size={18} />
      </button>

      {/* Warning Popup */}
      {showWarning && (
        <div className="fixed top-56 right-4 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-4 z-[60] transition-all duration-200">
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
            ⚠️ You’re about to unpin this chat.
            <br />
            Don’t worry — your bookmarks will be preserved.
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowWarning(false)}
              className="px-3 py-1 rounded-lg text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleUnpin}
              className="px-3 py-1 rounded-lg text-sm bg-red-500 text-white hover:bg-red-600 transition"
            >
              Unpin
            </button>
          </div>
        </div>
      )}
    </>
  );
};
