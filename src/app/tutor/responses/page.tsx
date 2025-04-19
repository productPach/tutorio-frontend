"use client";
import styles from "../layout.module.css";
import clsx from "clsx";
import LeftBar from "@/components/Tutor/LeftBar/LeftBar";
import SideBar from "@/components/Tutor/SideBar/SideBar";
import { ChatComponent } from "@/components/Tutor/Chat/Chat";
import { ChatSidbar } from "@/components/Tutor/SideBar/ChatSidebar/ChatSideBar";
import { useEffect, useState } from "react";
import { getChatsByUserId } from "@/store/features/chatSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useChat } from "@/context/ChatContext";
import { useChatSocket } from "@/hooks/useChatSocket";

const ResponsesPage: React.FC = () => {
  const page = "Responses";

  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const chats = useAppSelector((state) => state.chat.chats);
  const tutor = useAppSelector((state) => state.tutor.tutor);
  // Стейт для эмодзи в чате
  const [visibleEmoji, setVisibleEmoji] = useState(false);

  useEffect(() => {
    tutor &&
      token &&
      dispatch(
        getChatsByUserId({ userId: tutor?.userId, role: "tutor", token: token })
      );
  }, [tutor?.userId, token]);

  const currentUserId = tutor?.userId;

  const unreadCount = chats.reduce((total, chat) => {
    const unreadMessages = chat.messages?.filter(
      (msg) => !msg.isRead && msg.senderId !== currentUserId
    );
    return unreadMessages?.length;
  }, 0);

  return (
    <>
      <section className={clsx(styles.container, styles.center)}>
        <LeftBar page={page} />
        <div className={clsx(styles.contentChat)}>
          <ChatComponent
            visibleEmoji={visibleEmoji}
            setVisibleEmoji={setVisibleEmoji}
          />
        </div>
        <ChatSidbar chats={chats} />
      </section>
    </>
  );
};

export default ResponsesPage;
