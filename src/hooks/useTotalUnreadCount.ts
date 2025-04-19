import { useChat } from "@/context/ChatContext";
import { useAppSelector } from "@/store/store";
import { useMemo } from "react";

export const useTotalUnreadCount = () => {
  const { chats } = useChat();
  const studentId = useAppSelector((state) => state.student.student?.id);
  const tutorUserId = useAppSelector((state) => state.tutor.tutor?.id);
  const userId = studentId || tutorUserId;

  const totalUnreadCount = useMemo(() => {
    return chats.reduce((count, chat) => {
      const unreadMessages = chat.messages.filter(
        (msg) => !msg.isRead && msg.senderId !== userId
      );
      return count + unreadMessages.length;
    }, 0);
  }, [chats, userId]);

  return totalUnreadCount;
};
