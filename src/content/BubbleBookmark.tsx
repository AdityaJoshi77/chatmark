import { MdBookmark } from "react-icons/md";

interface BubbleBookmarkProps {
  setIsPanelOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setShowBookMarkForm?: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPinnedMode?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const BubbleBookmark = ({
  setIsPanelOpen,
  setShowBookMarkForm,
  setIsPinnedMode,
}: BubbleBookmarkProps) => {
  return (
    <button
      className="fixed top-32 right-4 flex items-center justify-center bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 w-10 h-10 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-200 z-50"
      onClick={() => {
        if (setIsPanelOpen) setIsPanelOpen(true);
        if (setShowBookMarkForm) setShowBookMarkForm(false);
        if (setIsPinnedMode) setIsPinnedMode(false);
      }}
      title="Open ChatMark"
    >
      <MdBookmark size={18} />
    </button>
  );
};
