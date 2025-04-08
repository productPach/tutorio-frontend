import { useRef, useState } from "react";
import chatStyle from "./Chat.module.css";

export const EmojiPicker = ({
  onSelect,
  textareaRef,
}: {
  onSelect: (emoji: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
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
    "💩",
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
    "🖕",
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

  const [visible, setVisible] = useState(false);
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    setVisible(true);
  };

  const handleMouseLeave = () => {
    hideTimeout.current = setTimeout(() => {
      setVisible(false);
    }, 1500);
  };

  return (
    <div
      className={chatStyle.emojiWrapper}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button className={chatStyle.emojiButton}>😊</button>
      <div
        className={`${chatStyle.emojiPopup} ${visible ? chatStyle.visible : ""}`}
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
