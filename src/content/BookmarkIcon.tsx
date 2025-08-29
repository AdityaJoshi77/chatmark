// src/content/BookmarkIcon.tsx
import React, { useEffect, useState } from "react";
import { FaPencil } from "react-icons/fa6";
import type { IconType } from "react-icons/lib";

interface AddNoteIconProps {
  onClick: (e: React.MouseEvent) => void;
  BookmarkIcon: IconType;
}

const AddNoteIcon: React.FC<AddNoteIconProps> = ({ onClick, BookmarkIcon }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      const isDark =
        document.documentElement.classList.contains("dark") ||
        document.body.classList.contains("dark-mode") ||
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDarkMode(isDark);
    };

    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", checkDarkMode);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener("change", checkDarkMode);
    };
  }, []);

  const styles: React.CSSProperties = {
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    borderRadius: "8px",
    border: isDarkMode ? "1px solid #4b5563" : "1px solid #d1d5db",
    background: isDarkMode ? "#374151" : "#ffffff",
    boxShadow: isDarkMode
      ? "0 4px 6px -1px rgba(0,0,0,0.3), 0 2px 4px -1px rgba(0,0,0,0.2)"
      : "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
    transition: "all 0.2s ease",
    pointerEvents: "auto",
  };

  return (
    <>
      <style>
        {`
          .bookmark-icon-btn:hover {
            background: ${isDarkMode ? "#4b5563" : "#f9fafb"} !important;
            border-color: ${isDarkMode ? "#6b7280" : "#9ca3af"} !important;
            transform: scale(1.05);
          }
          .bookmark-icon-btn:active {
            transform: scale(0.95);
          }
        `}
      </style>

      <button
        className="bookmark-icon-btn"
        style={styles}
        title={
          BookmarkIcon.toString() === FaPencil.toString()
            ? "Add Note"
            : "Instant Bookmark"
        }
        onClick={onClick}
      >
        <BookmarkIcon size={18} color={isDarkMode ? "#d1d5db" : "#374151"} />
      </button>
    </>
  );
};

export default AddNoteIcon;
