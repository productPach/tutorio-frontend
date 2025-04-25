import { useEffect, useState } from "react";
import { useSocket } from "@/context/SocketContext";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { addMessageToChat, getChatById, markMessagesAsRead } from "@/store/features/chatSlice";
import { fetchGetChatById } from "@/api/server/chatApi";

type Message = {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  createdAt: string;
  isRead: boolean;
};

export const useChatSocket = (chatId: string) => {
  const { socket } = useSocket();
  const dispatch = useAppDispatch();
    const token = useAppSelector((state) => state.auth.token);
  const studentId = useAppSelector((state) => state.student.student?.id);
  const tutorUserId: string | null = useAppSelector(
    (state) => state.tutor.tutor?.userId ?? null
  );
  const tutorId: string | null = useAppSelector(
    (state) => state.tutor.tutor?.id ?? null
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    if (!socket || !chatId || !(studentId || tutorUserId)) return;

    const userId = studentId || tutorUserId; // Выбираем правильный userId в зависимости от роли

    // Присоединяемся к чату
    socket.emit("joinChat", { userId, chatIds: [chatId] });

    // Загружаем чат с сервера через Redux
    const fetchChat = async () => {
        try {
          if (!token) return;
          // Подписываемся на чат через Redux
          const response = await fetchGetChatById(chatId, token);
          setMessages(response.messages); // <-- напрямую из payload
          markAsRead(response.messages);
        } catch (error) {
          console.error("Ошибка загрузки чата:", error);
        }
      };
  
      fetchChat(); // Загружаем чат

    const handleNewMessage = (message: Message) => {
      if (message.chatId === chatId) {
        
        setMessages((prev) => {
          const updated = [...prev, message];
          // после обновления вызываем markAsRead с новым списком
          setTimeout(() => markAsRead(updated), 0); // небольшой хак
          return updated;
        });
        dispatch(addMessageToChat(message)); // Добавляем новое сообщение в состояние

      }
    };

    const handleMessagesRead = (data: { chatId: string; messageIds: string[] }) => {
      
      if (data.chatId === chatId) {
        dispatch(markMessagesAsRead({ chatId: data.chatId, messageIds: data.messageIds }));
      }
    };

    const handleUnreadCount = (data: { chatId: string; userId: string; unreadCount: number }) => {
      if (data.chatId === chatId && data.userId === userId) {
        setUnreadCount(data.unreadCount);
      }
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("messagesRead", handleMessagesRead);
    socket.on("updateUnreadCount", handleUnreadCount);

    return () => {
      // Удаляем обработчики и отписываемся от чата
      socket.off("newMessage", handleNewMessage);
      socket.off("messagesRead", handleMessagesRead);
      socket.off("updateUnreadCount", handleUnreadCount);
    };
  }, [socket, chatId, studentId, tutorUserId, dispatch, token]); // Обновляем зависимости

  const sendMessageSocket = (message: Message) => {
    if (!socket || !(studentId || tutorUserId)) return;
    
    socket.emit("sendMessage", {
      chatId,
      message,
    });
  };

  const markAsRead = (msgs: Message[]) => {

    if (!socket || !(studentId || tutorId)) return;
  
    const userId = studentId || tutorId;

    const unreadMessageIds = msgs
      .filter(
        (msg) =>
          !msg.isRead &&
          msg.senderId !== userId &&
          !msg.id.startsWith("temp-") // фильтруем временные ID
      )
      .map((msg) => msg.id);      
      
    if (unreadMessageIds.length === 0) return;
  
    socket.emit("markAsRead", {
      chatId,
      messageIds: unreadMessageIds,
      userId,
    });
  };
  
  return {
    messages,
    unreadCount,
    sendMessageSocket,
    markAsRead,
  };
};