"use client";
import styles from "../layout.module.css";
import clsx from "clsx";
import LeftBar from "@/components/Tutor/LeftBar/LeftBar";
import { ChatComponent } from "@/components/Tutor/Chat/Chat";
import { ChatSidbar } from "@/components/Tutor/SideBar/ChatSidebar/ChatSideBar";
import { useState } from "react";
import { useAppSelector } from "@/store/store";
import { useChat } from "@/context/ChatContext";

const ResponsesPage: React.FC = () => {
  const page = "Responses";

  const tutor = useAppSelector((state) => state.tutor.tutor);
  // Стейт для эмодзи в чате
  const [visibleEmoji, setVisibleEmoji] = useState(false);

  const { chats } = useChat();

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
