import { Message } from "@/types/types";

export function getVisibleMessagesForRole(
  messages: Message[],
  role: "student" | "tutor" | null
): Message[] {
  return messages.filter((message) => {
    if (message.type === "service") {
      return (
        message.recipientRole === null ||
        message.recipientRole === undefined ||
        message.recipientRole === role
      );
    }
    return true;
  });
}