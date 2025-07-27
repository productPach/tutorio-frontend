"use client";
import styles from "../../../app/tutor/layout.module.css";
import clsx from "clsx";
import LeftBar from "@/components/Tutor/LeftBar/LeftBar";
import { ChatComponent } from "@/components/Tutor/Chat/Chat";
import { ChatSidbar } from "@/components/Tutor/SideBar/ChatSidebar/ChatSideBar";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/store/store";
import { useChat } from "@/context/ChatContext";
import { useSearchParams } from "next/navigation";
import { Modal } from "@/components/Modal/Modal";
import { RejectResponseModal } from "@/components/Tutor/Modal/Response/RejectResponseModal";
import { BalanceBoost } from "@/components/Tutor/Modal/BalanceBoost/BalanceBoost";
import { AcceptResponseModal } from "@/components/Tutor/Modal/Response/AcceptResponseModal";
import { CreateContractByTutorModal } from "../Modal/Response/CreateContractByTutorModal";

const ResponsesPage: React.FC = () => {
  const page = "Responses";

  const tutor = useAppSelector((state) => state.tutor.tutor);
  const isModalBalanceBoost = useAppSelector(
    (state) => state.modal.isModalBalanceBoost
  );
  const descriptionForModalBalanceBoost =
    "Примите заказ — после этого вы сможете пообщаться с учеником и обменяться контактами";
  const isModalAcceptResponse = useAppSelector(
    (state) => state.modal.isModalAcceptResponse
  );
  const isModalRejectResponse = useAppSelector(
    (state) => state.modal.isModalRejectResponse
  );
  const isModalCreateContractByTutor = useAppSelector(
    (state) => state.modal.isModalCreateContractByTutor
  );
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
      <Modal
        titleModal={"Пополните баланс, чтобы принять заказ"}
        contentModal={
          <BalanceBoost description={descriptionForModalBalanceBoost} />
        }
        isModal={isModalBalanceBoost}
        modalId={"balanceBoost"}
      ></Modal>
      <Modal
        titleModal={"Принять заказ"}
        contentModal={<AcceptResponseModal />}
        isModal={isModalAcceptResponse}
        modalId={"acceptResponse"}
      ></Modal>
      <Modal
        titleModal={"Отклонить заказ"}
        contentModal={<RejectResponseModal />}
        isModal={isModalRejectResponse}
        modalId={"rejectResponse"}
      ></Modal>
      <Modal
        titleModal={"Отчёт по заказу\u00A0📋"}
        contentModal={<CreateContractByTutorModal />}
        isModal={isModalCreateContractByTutor}
        modalId={"createContractByTutor"}
      ></Modal>
    </>
  );
};

export default ResponsesPage;
