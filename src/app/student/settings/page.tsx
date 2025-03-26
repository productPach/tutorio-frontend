"use client";
import styles from "../layout.module.css";
import clsx from "clsx";
import { setLogout } from "@/store/features/authSlice";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { Modal } from "@/components/Modal/Modal";
import { EmailModal } from "@/components/Tutor/Modal/Settings/EmailModal";
import LeftBar from "@/components/Student/LeftBar/LeftBar";
import { setStudentLogout } from "@/store/features/studentSlice";
import { Settings } from "@/components/Student/Settings/Settings";
import { TelegramModal } from "@/components/Student/Modal/Settings/TelegramModal";
import { SkypeModal } from "@/components/Student/Modal/Settings/SkypeModal";
import { ExitModal } from "@/components/Student/Modal/Settings/ExitModal";
import { PhoneModal } from "@/components/Student/Modal/Settings/PhoneModal";
import { DeleteModal } from "@/components/Student/Modal/Settings/DeleteModal";

const SettingsPage: React.FC = () => {
  const page = "Settings";

  const router = useRouter();
  const dispatch = useAppDispatch();
  const student = useAppSelector((state) => state.student.student);

  const isModalExit = useAppSelector((state) => state.modal.isModalExit);
  const isModalTelegram = useAppSelector(
    (state) => state.modal.isModalTelegram
  );
  const isModalSkype = useAppSelector((state) => state.modal.isModalSkype);
  const isModalEmail = useAppSelector((state) => state.modal.isModalEmail);
  const isModalPhone = useAppSelector((state) => state.modal.isModalPhone);
  const isModalDelete = useAppSelector((state) => state.modal.isModalDelete);

  // Функция выхода
  const logout = () => {
    dispatch(setLogout());
    dispatch(setStudentLogout());
    router.push("/");
  };

  return (
    <>
      <section className={clsx(styles.container, styles.center)}>
        <LeftBar page={page} />
        <div className={styles.content}>
          <Settings student={student} logout={logout} />
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
      <Modal
        titleModal={"Удаление аккаунта 💔"}
        contentModal={<DeleteModal logout={logout} />}
        isModal={isModalDelete}
        modalId={"delete"}
      ></Modal>
    </>
  );
};

export default SettingsPage;
