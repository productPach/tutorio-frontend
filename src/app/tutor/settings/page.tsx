"use client";
import styles from "../layout.module.css";
import clsx from "clsx";
import LeftBar from "@/components/Tutor/LeftBar/LeftBar";
import { Settings } from "@/components/Tutor/Settings/Settings";
import { setLogout } from "@/store/features/authSlice";
import { setTutorLogout } from "@/store/features/tutorSlice";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { Modal } from "@/components/Modal/Modal";
import { ExitModal } from "@/components/Tutor/Modal/Settings/ExitModal";
import { TelegramModal } from "@/components/Tutor/Modal/Settings/TelegramModal";
import { SkypeModal } from "@/components/Tutor/Modal/Settings/SkypeModal";
import { EmailModal } from "@/components/Tutor/Modal/Settings/EmailModal";
import { PhoneModal } from "@/components/Tutor/Modal/Settings/PhoneModal";

const SettingsPage: React.FC = () => {
  const page = "Settings";

  const router = useRouter();
  const dispatch = useAppDispatch();
  const tutor = useAppSelector((state) => state.tutor.tutor);

  const isModalExit = useAppSelector((state) => state.modal.isModalExit);
  const isModalTelegram = useAppSelector(
    (state) => state.modal.isModalTelegram
  );
  const isModalSkype = useAppSelector((state) => state.modal.isModalSkype);
  const isModalEmail = useAppSelector((state) => state.modal.isModalEmail);
  const isModalPhone = useAppSelector((state) => state.modal.isModalPhone);

  // Функция выхода
  const logout = () => {
    dispatch(setLogout());
    dispatch(setTutorLogout());
    router.push("/");
  };

  return (
    <>
      <section className={clsx(styles.container, styles.center)}>
        <LeftBar page={page} />
        <div className={styles.content}>
          <Settings tutor={tutor} logout={logout} />
        </div>
      </section>
      <Modal
        titleModal={"Выйти из аккаунта"}
        contentModal={<ExitModal logout={logout} />}
        isModal={isModalExit}
        modalId={"exit"}
      ></Modal>
      <Modal
        titleModal={"Telegram"}
        contentModal={<TelegramModal />}
        isModal={isModalTelegram}
        modalId={"telegram"}
      ></Modal>
      <Modal
        titleModal={"Skype"}
        contentModal={<SkypeModal />}
        isModal={isModalSkype}
        modalId={"skype"}
      ></Modal>
      <Modal
        titleModal={"E-mail"}
        contentModal={<EmailModal />}
        isModal={isModalEmail}
        modalId={"email"}
      ></Modal>
      <Modal
        titleModal={"Сменить номер телефона"}
        contentModal={<PhoneModal />}
        isModal={isModalPhone}
        modalId={"phone"}
      ></Modal>
    </>
  );
};

export default SettingsPage;
