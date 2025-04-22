import { Message } from "@/types/types";

export const sortMessages = (messages: Message[]) => {
  return [...messages].sort((a, b) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
};
