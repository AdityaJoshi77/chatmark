
import React from "react";

interface BookmarkIconProps {
  top: number;
  left: number;
  onClick: () => void;
}

const BookmarkIcon: React.FC<BookmarkIconProps> = ({ top, left, onClick }) => {
  return (
    <button
      style={{
        position: "absolute",
        top: `${top}px`,
        left: `${left}px`,
        zIndex: 9999,
        cursor: "pointer",
      }}
      title="Add Bookmark"
      onClick={onClick}
    >
      🔖
    </button>
  );
};

export default BookmarkIcon;
