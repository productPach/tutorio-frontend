"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useSocket } from "./SocketContext";
import { useAppSelector } from "@/store/store";

import { Chat, Message } from "@/types/types";
import {
  fetchGetChatsByOrderId,
  fetchGetChatsByUserIdAndRole,
} from "@/api/server/chatApi";

type ChatContextType = {
  chats: Chat[];
  sendMessage: (chatId: string, text: string) => void;
  markAsRead: (chatId: string) => void;
};

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const { socket } = useSocket(); // Используем сокет из контекста
  const token = useAppSelector((state) => state.auth.token);

  const studentId = useAppSelector(
    (state) => state.student.student?.id ?? null
  );
  const tutorUserId = useAppSelector(
    (state) => state.tutor.tutor?.userId ?? null
  );
  const orderId = useAppSelector((state) => state.orders.orderById); // если хранишь orderId

  const [chats, setChats] = useState<Chat[]>([]);

  const loadChats = useCallback(async () => {
    if (!token) return;

    try {
      let combinedChats: Chat[] = [];

      // Загружаем чаты как студент
      if (studentId && orderId) {
        const studentChats = await fetchGetChatsByOrderId(orderId.id, token);
        combinedChats = [...combinedChats, ...studentChats];
      }

      // Загружаем чаты как репетитор
      if (tutorUserId) {
        const tutorChats = await fetchGetChatsByUserIdAndRole(
          tutorUserId,
          "tutor",
          token
        );
        combinedChats = [...combinedChats, ...tutorChats];
      }

      setChats(combinedChats);

      const chatIds = combinedChats.map((chat) => chat.id);
      socket?.emit("joinChat", { userId: studentId || tutorUserId, chatIds });
    } catch (err) {
      console.error("Ошибка загрузки чатов:", err);
    }
  }, [studentId, tutorUserId, token, socket, orderId]);

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message: Message) => {
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === message.chatId
            ? { ...chat, messages: [...chat.messages, message] }
            : chat
        )
      );
    };

    const handleReadMessages = (data: { chatId: string; userId: string }) => {
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === data.chatId
            ? {
                ...chat,
                messages: chat.messages.map((msg) =>
                  msg.senderId !== data.userId ? { ...msg, isRead: true } : msg
                ),
              }
            : chat
        )
      );
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("readMessages", handleReadMessages);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("readMessages", handleReadMessages);

      const chatIds = chats.map((c) => c.id);
      if (studentId || tutorUserId) {
        socket.emit("leaveChat", { userId: studentId || tutorUserId, chatIds });
      }
    };
  }, [socket, chats, studentId, tutorUserId]);

  const sendMessage = (chatId: string, text: string) => {
    if (!socket || (!studentId && !tutorUserId)) return;

    socket.emit("sendMessage", {
      chatId,
      senderId: studentId || tutorUserId,
      text,
    });
  };

  const markAsRead = (chatId: string) => {
    if (!socket || (!studentId && !tutorUserId)) return;

    const chat = chats.find((c) => c.id === chatId);
    if (!chat) return;

    const unreadMessages = chat.messages.filter(
      (m) => !m.isRead && m.senderId !== studentId && m.senderId !== tutorUserId
    );

    if (unreadMessages.length > 0) {
      socket.emit("markMessagesAsRead", {
        chatId,
        userId: studentId || tutorUserId,
      });
    }
  };

  return (
    <ChatContext.Provider value={{ chats, sendMessage, markAsRead }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
