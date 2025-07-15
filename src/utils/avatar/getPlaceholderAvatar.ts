export function getPlaceholderAvatar(chatId: string, name?: string) {
  const hash = Array.from(chatId).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hue = hash % 360;
  const backgroundColor = `hsl(${hue}, 70%, 80%)`;
  const textColor = `hsl(${hue}, 70%, 30%)`;

  let initials = "?";
  if (name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      initials = parts[0][0] + parts[1][0];
    } else if (parts.length === 1) {
      initials = parts[0][0];
    }
    initials = initials.toUpperCase();
  }

  return { backgroundColor, textColor, initials };
}
