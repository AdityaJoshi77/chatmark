import { useState } from "react";
import type { PinnedChat } from "./types";
import { savePinnedChat } from "./storage";

interface ChatPinFormProps {
  setIsPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setShowPinForm: React.Dispatch<React.SetStateAction<boolean>>;
  setPinnedChats: React.Dispatch<React.SetStateAction<PinnedChat[]>>;
  setShowPinOption: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatPinForm = ({ setIsPanelOpen, setShowPinForm, setPinnedChats, setShowPinOption }: ChatPinFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const url = window.location.href;
  const chatId = url.split("/c/")[1];

  // HANDLE SAVE
  const handleSave = async () => {
    const chatToPin: PinnedChat = {
      id: chatId,
      title,
      description,
      url,
      datePinned: new Date().toISOString(),
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
    };

    await savePinnedChat(chatToPin);
    setPinnedChats((prev) => [...prev, chatToPin])

    // Reset form
    setTitle("");
    setDescription("");
    setTags("");
    setShowPinForm(false);
    setIsPanelOpen(false);

    // Remove the pin icon from the chatgpt's screen
    setShowPinOption(false);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault(); // prevent page reload
        handleSave();
      }}
      className="border border-gray-200 dark:border-gray-600 rounded p-3 mb-4 bg-gray-50 dark:bg-gray-700"
    >
      <label className="block text-xs font-medium mb-2 text-gray-700 dark:text-gray-100">
        Title of the Chat:
      </label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-3 py-2 text-sm rounded border border-gray-200 dark:border-gray-600
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                   placeholder-gray-400 dark:placeholder-gray-500
                   focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-600
                   transition-colors duration-200 mb-3"
        placeholder="Enter a title..."
        autoFocus
      />

      <label className="block text-xs font-medium mb-2 text-gray-700 dark:text-gray-100">
        Reason to Pin (Optional):
      </label>
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full px-3 py-2 text-sm rounded border border-gray-200 dark:border-gray-600
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                   placeholder-gray-400 dark:placeholder-gray-500
                   focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-600
                   transition-colors duration-200 mb-3"
        placeholder="Why are you pinning this chat..."
      />

      <label className="block text-xs font-medium mb-2 text-gray-700 dark:text-gray-100">
        Tags (Optional, comma-separated):
      </label>
      <input
        type="text"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        className="w-full px-3 py-2 text-sm rounded border border-gray-200 dark:border-gray-600
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                   placeholder-gray-400 dark:placeholder-gray-500
                   focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-600
                   transition-colors duration-200 mb-3"
        placeholder="e.g. AI, Learning, Coding"
      />

      <label className="block text-xs font-medium mb-2 text-gray-700 dark:text-gray-100">
        Chat's URL:
      </label>
      <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600 p-2 mb-3">
        <p className="text-xs text-gray-600 dark:text-gray-400 italic">{url}</p>
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={() => {
            setTitle("");
            setDescription("");
            setTags("");
            setIsPanelOpen(false);
            setShowPinForm(false);
          }}
          className="px-3 py-1 text-xs bg-gray-900 dark:bg-gray-600 text-white
                     hover:bg-gray-800 dark:hover:bg-gray-500 rounded
                     transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!title.trim()}
          className="px-3 py-1 text-xs text-gray-600 dark:text-black
                     bg-gray-300 dark:bg-gray-500
                     hover:bg-gray-100 dark:hover:bg-gray-300 rounded
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors duration-200"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default ChatPinForm;
