import { Dispatch, SetStateAction, useRef, useState } from "react";
import chatStyle from "./Chat.module.css";

export const EmojiPicker = ({
  onSelect,
  textareaRef,
  visibleEmoji,
  setVisibleEmoji,
}: {
  onSelect: (emoji: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  visibleEmoji: boolean;
  setVisibleEmoji: Dispatch<SetStateAction<boolean>>;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const emojis = [
    "😀",
    "😁",
    "😂",
    "🤣",
    "😃",
    "😄",
    "😅",
    "😆",
    "😉",
    "😊",
    "😋",
    "😎",
    "😍",
    "😘",
    "😗",
    "😙",
    "😚",
    "🙂",
    "🤗",
    "🤩",
    "🤔",
    "🤨",
    "😐",
    "😑",
    "😶",
    "🙄",
    "😏",
    "😣",
    "😥",
    "😮",
    "🤐",
    "😯",
    "😪",
    "😫",
    "🥱",
    "😴",
    "😌",
    "😛",
    "😜",
    "😝",
    "🤤",
    "😒",
    "😓",
    "😔",
    "😕",
    "🙃",
    "🤑",
    "😲",
    "☹️",
    "🙁",
    "😖",
    "😞",
    "😟",
    "😤",
    "😢",
    "😭",
    "😦",
    "😧",
    "😨",
    "😩",
    "🤯",
    "😬",
    "😰",
    "😱",
    "🥵",
    "🥶",
    "😳",
    "🤪",
    "😵",
    "😡",
    "😠",
    "🤬",
    "😷",
    "🤒",
    "🤕",
    "🤢",
    "🤮",
    "🥴",
    "😇",
    "🤠",
    "🥳",
    "🥺",
    "🫠",
    "🤓",
    "🧐",
    "😈",
    "👿",
    "👹",
    "👺",
    "💀",
    "👻",
    "👽",
    "🤖",
    "🔥",
    "✨",
    "🌟",
    "💫",
    "💥",
    "💨",
    "🫶",
    "💖",
    "💗",
    "💓",
    "💞",
    "💕",
    "❣️",
    "❤️",
    "🧡",
    "💛",
    "💚",
    "💙",
    "💜",
    "🖤",
    "🤍",
    "🤎",
    "💔",
    "💋",
    "👋",
    "🤚",
    "🖐️",
    "✋",
    "🖖",
    "👌",
    "🤌",
    "🤏",
    "✌️",
    "🤞",
    "🤟",
    "🤘",
    "🤙",
    "👈",
    "👉",
    "👆",
    "👇",
    "☝️",
    "👍",
    "👎",
    "✊",
    "👊",
    "🤛",
    "🤜",
    "👏",
    "🙌",
    "🫶",
    "👐",
    "🤲",
    "🙏",
    "✍️",
    "💅",
    "🤳",
    "💪",
  ];

  const hideTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    setVisibleEmoji(true);
  };

  const handleMouseLeave = () => {
    hideTimeout.current = setTimeout(() => {
      setVisibleEmoji(false);
    }, 800);
  };

  return (
    <div
      className={chatStyle.emojiWrapper}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button className={chatStyle.emojiButton}>😊</button>
      <div
        className={`${chatStyle.emojiPopup} ${visibleEmoji ? chatStyle.visible : ""}`}
      >
        {emojis.map((emoji) => (
          <span
            key={emoji}
            className={chatStyle.emojiItem}
            onClick={() => {
              onSelect(emoji);
              textareaRef.current?.focus();
            }}
          >
            {emoji}
          </span>
        ))}
      </div>
    </div>
  );
};
