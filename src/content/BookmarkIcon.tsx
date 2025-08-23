import React, { useEffect, useState } from "react";
import { MdBookmarkAdd } from "react-icons/md";

interface BookmarkIconProps {
  top: number;
  left: number;
  onClick: () => void;
}

const BookmarkIcon: React.FC<BookmarkIconProps> = ({ top, left, onClick }) => {
  console.log("The bookmark icon attempted render");
  
  // Detect dark mode
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check for dark mode on mount
    const checkDarkMode = () => {
      const isDark = 
        document.documentElement.classList.contains('dark') ||
        document.body.classList.contains('dark-mode') ||
        window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(isDark);
    };

    checkDarkMode();

    // Listen for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });
    observer.observe(document.body, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', checkDarkMode);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', checkDarkMode);
    };
  }, []);

  const styles = {
    position: "absolute" as const,
    top: `${top}px`,
    left: `${left}px`,
    zIndex: 9999,
    cursor: "pointer",
    pointerEvents: "auto" as const,
    
    // ChatGPT-style theming
    background: isDarkMode ? "#374151" : "#ffffff", // gray-700 / white
    border: isDarkMode ? "1px solid #4b5563" : "1px solid #d1d5db", // gray-600 / gray-300
    borderRadius: "8px",
    padding: "6px",
    boxShadow: isDarkMode 
      ? "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)"
      : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "32px",
    height: "32px",
    
    // Hover effects (will be handled by pseudo-classes in a style tag)
    transition: "all 0.2s ease",
  };

  return (
    <>
      {/* Inject hover styles */}
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
        title="Add Bookmark"
        onClick={onClick}
      >
        <MdBookmarkAdd 
          size={18} 
          color={isDarkMode ? "#d1d5db" : "#374151"} // gray-300 / gray-700
        />
      </button>
    </>
  );
};

export default BookmarkIcon;