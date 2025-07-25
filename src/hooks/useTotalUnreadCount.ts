import { useChat } from "@/context/ChatContext";
import { useAppSelector } from "@/store/store";
import { useMemo } from "react";

  // const { chats } = useChat();
  // const studentId = useAppSelector((state) => state.student.student?.id);
  // const tutorUserId = useAppSelector((state) => state.tutor.tutor?.id);
  // const userId = studentId || tutorUserId;

  // const totalUnreadCount = useMemo(() => {
  //   return chats.reduce((count, chat) => {
  //     const unreadMessages = chat.messages.filter(
  //       (msg) => !msg.isRead && msg.senderId !== userId
  //     );
  //     return count + unreadMessages.length;
  //   }, 0);
  // }, [chats, userId]);

  // return totalUnreadCount;

export const useTotalUnreadCount = () => {
  const { chats } = useChat();

  const studentId = useAppSelector((state) => state.student.student?.id);
  const tutorId = useAppSelector((state) => state.tutor.tutor?.id);

  const userId = studentId || tutorId;
  const userRole = studentId ? "student" : tutorId ? "tutor" : null;

  const totalUnreadCount = useMemo(() => {
    if (!chats || !userId || !userRole) return 0;

    return chats.reduce((count, chat) => {
      const unreadMessages = (chat.messages || []).filter((msg) => {
        const isUnread = !msg.isRead;
        const isFromAnotherUser = msg.senderId !== userId;

        if (!isUnread || !isFromAnotherUser) return false;

        if (msg.type === "user") {
          return true;
        }

        if (msg.type === "service") {
          return (
            msg.recipientRole === null || msg.recipientRole === userRole
          );
        }

        // Прочее — не учитывать
        return false;
      });

      return count + unreadMessages.length;
    }, 0);
  }, [chats, userId, userRole]);

  return totalUnreadCount;
};
