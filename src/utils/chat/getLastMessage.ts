import { Message } from "@/types/types";

export const getLastMessage = (messages: Message[]): Message | null => {
    if (!messages.length) return null;
    return [...messages].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
  };
  