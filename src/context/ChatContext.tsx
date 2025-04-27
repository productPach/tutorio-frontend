"use client"; // Указание компонента как клиентского

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import { useSocket } from "./SocketContext";
import { useAppSelector, useAppDispatch } from "@/store/store";

import { Chat, Message } from "@/types/types";
import {
  fetchGetChatsByOrderId,
  fetchGetChatsByUserIdAndRole,
} from "@/api/server/chatApi";
import { setChats } from "@/store/features/chatSlice";
import { useIsMounted } from "@/utils/chat/useIsMounted";

type ChatContextType = {
  chats: Chat[];
  sendMessage: (chatId: string, text: string) => void;
  markAsRead: (chatId: string) => void;
  newChat: (chatId: string) => void;
  setChatsState: (newChats: Chat[]) => void;
  loadChats: () => Promise<void>;
  chatsLoading: boolean;
  chatsLoaded: boolean;
  setChatsLoaded: Dispatch<SetStateAction<boolean>>;
  clearChats: () => void;
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

  const [chats, _setChatsState] = useState<Chat[]>([]);
  const [chatsLoading, setChatsLoading] = useState(true);
  const [chatsLoaded, setChatsLoaded] = useState(false);
  const clearChats = () => {
    setChatsLoaded(false);
    _setChatsState([]);
  };

  const setChatsState = (newChats: Chat[] | ((prev: Chat[]) => Chat[])) => {
    queueMicrotask(() => {
      //console.trace("❗ setChatsState вызван через microtask");
      _setChatsState(newChats);
    });
  };

  const isMountedRef = useIsMounted();

  const loadChats = useCallback(async () => {
    if (!token) return; // Если чаты уже загружены, не запускаем загрузку
    setChatsLoading(true); // 👈 устанавливаем загрузку
    console.log("load!!");

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

      setTimeout(() => {
        if (!isMountedRef.current) return;
        setChatsState(combinedChats);
        //console.trace("setChatsState called 1");
        dispatch(setChats(combinedChats));
        //console.log(combinedChats);

        setChatsLoading(false); // 👈 когда всё готово — снимаем флаг
      }, 0);

      const chatIds = combinedChats.map((chat) => chat.id);
      socket?.emit("joinChat", { userId: studentId || tutorId, chatIds });
    } catch (err) {
      console.error("Ошибка загрузки чатов:", err);
      setChatsLoading(false); // 👈 даже при ошибке — снимаем флаг
    }
  }, [studentId, tutorUserId, tutorId, token, socket, orderId, dispatch]);

  useEffect(() => {
    //console.log("Chats are loading... Calling loadChats");
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
      console.log("Получили сообщение");

      //loadChats();
      setTimeout(() => {
        if (!isMountedRef.current) return;
        setChatsState((prev) => {
          //console.trace("setChatsState called 2");
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
        if (!isMountedRef.current) return;
        setChatsState((prev) => {
          //console.trace("setChatsState called 3");
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

          //dispatch(setChats(updatedChats));
          return updatedChats;
        });
      }, 0);
    };

    const handleNewChat = (data: Chat) => {
      console.log("Новый чат получен", data);

      if (!isMountedRef.current) return;

      setChatsState((prev) => {
        const chatExists = prev.some((chat) => chat.id === data.id); // Проверка, существует ли уже чат
        if (chatExists) {
          // Обновляем существующий чат, если он есть
          const updatedChats = prev.map((chat) =>
            chat.id === data.id
              ? {
                  ...chat,
                  messages: chat.messages.map((msg) =>
                    msg.senderId !== data.tutorId
                      ? { ...msg, isRead: true }
                      : msg
                  ),
                }
              : chat
          );
          return updatedChats;
        } else {
          // Если чат не найден, добавляем его в начало списка
          const updatedChats = [data, ...prev];
          return updatedChats;
        }
      });
      playNotificationSound();
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("messagesRead", handleReadMessages);
    socket.on("newChatCreated", handleNewChat);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("messagesRead", handleReadMessages);
      socket.off("newChatCreated", handleNewChat);

      const chatIds = chats.map((c) => c.id);
      if (studentId || tutorId) {
        socket.emit("leaveChat", { userId: studentId || tutorId, chatIds });
      }
    };
  }, [socket, studentId, tutorId, dispatch, chats]);

  const sendMessage = (chatId: string, text: string) => {
    if (!socket || (!studentId && !tutorId)) return;
    console.log("Отправка сокета");

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

  const newChat = (chatId: string) => {
    if (!socket || (!studentId && !tutorId)) return;
    console.log("Отправка нового чата");

    socket.emit("createChat", {
      chatId,
    });
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        sendMessage,
        markAsRead,
        newChat,
        setChatsState,
        loadChats,
        chatsLoading,
        chatsLoaded,
        setChatsLoaded,
        clearChats,
      }}
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
