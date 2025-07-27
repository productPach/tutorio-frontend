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
  fetchGetChatById,
  fetchGetChatsByOrderId,
  fetchGetChatsByUserIdAndRole,
} from "@/api/server/chatApi";
import {
  setChat,
  setChats,
  updateChatForContract,
} from "@/store/features/chatSlice";
import { useIsMounted } from "@/utils/chat/useIsMounted";
import { addChatToOrder, updateOrder } from "@/store/features/orderSlice";

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
      _setChatsState(newChats);
    });
  };

  const isMountedRef = useIsMounted();

  const loadChats = useCallback(async () => {
    if (!token) return; // Если чаты уже загружены, не запускаем загрузку
    setChatsLoading(true); // 👈 устанавливаем загрузку

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
        dispatch(setChats(combinedChats));

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

    const handleNewMessage = async (message: Message) => {
      if (!isMountedRef.current) return;

      // Если обычное сообщение — просто добавляем
      // if (message.type !== "service") {
      //   setChatsState((prev) => {
      //     const updatedChats = prev.map((chat) =>
      //       chat.id === message.chatId
      //         ? {
      //             ...chat,
      //             messages: [...chat.messages, message],
      //             lastMessage: message,
      //           }
      //         : chat
      //     );
      //     dispatch(setChats(updatedChats));
      //     return updatedChats;
      //   });

      // 🔹 Обычное сообщение — просто добавляем в чат
      if (message.type !== "service") {
        const updatedChats = chats.map((chat) =>
          chat.id === message.chatId
            ? {
                ...chat,
                messages: [...chat.messages, message],
                lastMessage: message,
              }
            : chat
        );

        setChatsState(updatedChats); // обновляем локальный стейт
        dispatch(setChats(updatedChats)); // обновляем Redux

        playNotificationSound();
        return;
      }

      // Если сервисное — грузим чат заново
      setChatsState((prev) => {
        const updatedChats = prev.map((chat) => {
          if (chat.id !== message.chatId) return chat;

          const hasContract = chat.order.contracts.some(
            (contract) => contract.tutorId === chat.tutorId
          );

          const updatedContracts = hasContract
            ? chat.order.contracts
            : [...chat.order.contracts, { tutorId: chat.tutorId }];

          return {
            ...chat,
            order: {
              ...chat.order,
              contracts: updatedContracts,
            },
            messages: [...chat.messages, message],
            lastMessage: message,
          };
        });

        // 💥 dispatch вызываем вне setState
        setTimeout(() => {
          dispatch(setChats(updatedChats));
          const currentChat = updatedChats.find((c) => c.id === message.chatId);
          if (currentChat) {
            dispatch(updateChatForContract(currentChat));
            if (currentChat.orderId && token) {
              dispatch(
                updateOrder({
                  id: currentChat.orderId,
                  token,
                  status: "Hidden",
                })
              ).unwrap();
            }
          }
        }, 0); // или можно 100, если надо ждать, но лучше 0

        return updatedChats;
      });

      playNotificationSound();
    };

    const handleReadMessages = (data: { chatId: string; userId: string }) => {
      setTimeout(() => {
        if (!isMountedRef.current) return;
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

          //dispatch(setChats(updatedChats));
          return updatedChats;
        });
      }, 0);
    };

    const handleNewChat = async (data: Chat) => {
      //console.log("новый чат");

      if (data.initiatorRole === "tutor") {
        if (orderId?.id !== data.orderId) return;
      }
      if (!isMountedRef.current) return;

      // Проверяем, есть ли чат в заказе, если нет — добавляем
      const chatExistsInOrder = orderId?.chats?.some(
        (chat) => chat.id === data.id
      );
      if (!chatExistsInOrder) {
        dispatch(addChatToOrder(data));
      }

      try {
        if (token) {
          // Подгружаем полный чат с сервера по id
          const fullChats: Chat[] = await fetchGetChatsByOrderId(
            data.orderId,
            token
          );
          const fullChat = fullChats.find((c) => c.id === data.id);

          if (!fullChat) {
            console.warn("Не удалось получить полный чат по id", data.id);
            return;
          }

          setChatsState((prev) => {
            playNotificationSound();
            const chatExists = prev.some((chat) => chat.id === data.id);
            if (chatExists) {
              // Обновляем чат полностью новым полным объектом
              const updatedChats = prev.map((chat) =>
                chat.id === data.id ? fullChat : chat
              );
              return updatedChats;
            } else {
              // Добавляем новый чат
              return [fullChat, ...prev];
            }
          });
        }
      } catch (error) {
        console.error("Ошибка при загрузке полного чата:", error);
      }
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
