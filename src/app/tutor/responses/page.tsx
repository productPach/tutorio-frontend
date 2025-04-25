"use client";
import styles from "../layout.module.css";
import clsx from "clsx";
import LeftBar from "@/components/Tutor/LeftBar/LeftBar";
import { ChatComponent } from "@/components/Tutor/Chat/Chat";
import { ChatSidbar } from "@/components/Tutor/SideBar/ChatSidebar/ChatSideBar";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/store/store";
import { useChat } from "@/context/ChatContext";
import { useSearchParams } from "next/navigation";

const ResponsesPage: React.FC = () => {
  const page = "Responses";

  const tutor = useAppSelector((state) => state.tutor.tutor);
  const token = useAppSelector((state) => state.auth.token);
  // Стейт для эмодзи в чате
  const [visibleEmoji, setVisibleEmoji] = useState(false);

  const { chats, loadChats, chatsLoaded, setChatsLoaded, chatsLoading } =
    useChat();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Проверяем наличие параметра chatUpdateData в URL
    const chatUpdateData = searchParams.get("chatUpdateData");

    // Если параметр chatUpdateData существует, вызываем setChatsLoaded
    if (chatUpdateData) {
      loadChats();
    }
  }, [searchParams, loadChats]);

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
        <ChatSidbar chats={chats} tutor={tutor} />
      </section>
    </>
  );
};

export default ResponsesPage;
