"use client"; // Указание компонента как клиентского

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useSocket } from "./SocketContext";
import { useAppSelector, useAppDispatch } from "@/store/store";

import { Chat, Message } from "@/types/types";
import {
  fetchGetChatsByOrderId,
  fetchGetChatsByUserIdAndRole,
} from "@/api/server/chatApi";
import { setChats } from "@/store/features/chatSlice";

type ChatContextType = {
  chats: Chat[];
  sendMessage: (chatId: string, text: string) => void;
  markAsRead: (chatId: string) => void;
  setChatsState: (newChats: Chat[]) => void;
};

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const { socket } = useSocket();
  const token = useAppSelector((state) => state.auth.token);
  const studentId = useAppSelector(
    (state) => state.student.student?.id ?? null
  );
  const tutorUserId = useAppSelector(
    (state) => state.tutor.tutor?.userId ?? null
  );
  const tutorId = useAppSelector((state) => state.tutor.tutor?.id ?? null);
  const orderId = useAppSelector((state) => state.orders.orderById);
  const dispatch = useAppDispatch();

  const [chats, setChatsState] = useState<Chat[]>([]);

  const loadChats = useCallback(async () => {
    if (!token) return;

    try {
      let combinedChats: Chat[] = [];

      if (studentId && orderId) {
        const studentChats = await fetchGetChatsByOrderId(orderId.id, token);
        combinedChats = [...combinedChats, ...studentChats];
      }

      if (tutorUserId) {
        const tutorChats = await fetchGetChatsByUserIdAndRole(
          tutorUserId,
          "tutor",
          token
        );
        combinedChats = [...combinedChats, ...tutorChats];
      }

      setChatsState(combinedChats);
      dispatch(setChats(combinedChats));

      const chatIds = combinedChats.map((chat) => chat.id);
      socket?.emit("joinChat", { userId: studentId || tutorId, chatIds });
    } catch (err) {
      console.error("Ошибка загрузки чатов:", err);
    }
  }, [studentId, tutorUserId, tutorId, token, socket, orderId, dispatch]);

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  const playNotificationSound = () => {
    const audio = new Audio("/sounds/intuition-561.mp3");
    audio
      .play()
      .catch((e) => console.warn("Не удалось воспроизвести звук:", e));
  };

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message: Message) => {
      setTimeout(() => {
        setChatsState((prev) => {
          const updatedChats = prev.map((chat) =>
            chat.id === message.chatId
              ? {
                  ...chat,
                  messages: [...chat.messages, message],
                  lastMessage: message,
                }
              : chat
          );
          dispatch(setChats(updatedChats));
          return updatedChats;
        });
      }, 0);
      playNotificationSound();
    };

    const handleReadMessages = (data: { chatId: string; userId: string }) => {
      setTimeout(() => {
        setChatsState((prev) => {
          const updatedChats = prev.map((chat) =>
            chat.id === data.chatId
              ? {
                  ...chat,
                  messages: chat.messages.map((msg) =>
                    msg.senderId !== data.userId
                      ? { ...msg, isRead: true }
                      : msg
                  ),
                }
              : chat
          );

          dispatch(setChats(updatedChats));
          return updatedChats;
        });
      }, 0);
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("messagesRead", handleReadMessages);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("messagesRead", handleReadMessages);

      const chatIds = chats.map((c) => c.id);
      if (studentId || tutorId) {
        socket.emit("leaveChat", { userId: studentId || tutorId, chatIds });
      }
    };
  }, [socket, chats, studentId, tutorId, dispatch]);

  const sendMessage = (chatId: string, text: string) => {
    if (!socket || (!studentId && !tutorId)) return;

    socket.emit("sendMessage", {
      chatId,
      senderId: studentId || tutorId,
      text,
    });
  };

  const markAsRead = (chatId: string) => {
    if (!socket || (!studentId && !tutorId)) return;

    const chat = chats.find((c) => c.id === chatId);
    if (!chat) return;

    const unreadMessages = chat.messages.filter(
      (m) => !m.isRead && m.senderId !== studentId && m.senderId !== tutorId
    );

    const unreadIds = unreadMessages.map((m) => m.id);

    if (unreadIds.length > 0) {
      socket.emit("markAsRead", {
        chatId,
        userId: studentId || tutorId,
        messageIds: unreadIds,
      });
    }
  };

  return (
    <ChatContext.Provider
      value={{ chats, sendMessage, markAsRead, setChatsState }}
    >
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
