"use client";
import styles from "../../../app/tutor/layout.module.css";
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
import { DeleteModal } from "@/components/Tutor/Modal/Settings/DeleteModal";
import { BottomSheet } from "@/components/BottomSheet/BottomSheet";
import {
  setIsSheetConnectTelegram,
  setIsSheetDelete,
  setIsSheetEmail,
  setIsSheetExit,
  setIsSheetPhone,
  setIsSheetTelegram,
} from "@/store/features/modalSlice";
import { TelegramConnectModal } from "../Modal/Settings/TelegramConnectModal";

const SettingsPage: React.FC = () => {
  const page = "Settings";

  const router = useRouter();
  const dispatch = useAppDispatch();
  const tutor = useAppSelector((state) => state.tutor.tutor);

  const isModalExit = useAppSelector((state) => state.modal.isModalExit);
  const isSheetExit = useAppSelector((state) => state.modal.isSheetExit);

  const isModalTelegram = useAppSelector(
    (state) => state.modal.isModalTelegram
  );
  const isSheetTelegram = useAppSelector(
    (state) => state.modal.isSheetTelegram
  );

  const isModalSkype = useAppSelector((state) => state.modal.isModalSkype);

  const isModalEmail = useAppSelector((state) => state.modal.isModalEmail);
  const isSheetEmail = useAppSelector((state) => state.modal.isSheetEmail);

  const isModalPhone = useAppSelector((state) => state.modal.isModalPhone);
  const isSheetPhone = useAppSelector((state) => state.modal.isSheetPhone);

  const isModalDelete = useAppSelector((state) => state.modal.isModalDelete);
  const isSheetDelete = useAppSelector((state) => state.modal.isSheetDelete);

  // Функция выхода
  const logout = () => {
    dispatch(setLogout());
    dispatch(setTutorLogout());
    router.push("/");
  };

  return (
    <>
      <section
        className={clsx(styles.container, styles.center, styles.paddingBottM)}
      >
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
      <BottomSheet
        isOpen={isSheetExit}
        onClose={() => dispatch(setIsSheetExit(false))}
      >
        <ExitModal logout={logout} />
      </BottomSheet>

      <Modal
        titleModal={"Telegram"}
        contentModal={<TelegramModal />}
        isModal={isModalTelegram}
        modalId={"telegram"}
      ></Modal>
      <BottomSheet
        isOpen={isSheetTelegram}
        onClose={() => dispatch(setIsSheetTelegram(false))}
      >
        <TelegramModal />
      </BottomSheet>

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
      <BottomSheet
        isOpen={isSheetEmail}
        onClose={() => dispatch(setIsSheetEmail(false))}
      >
        <EmailModal />
      </BottomSheet>

      <Modal
        titleModal={"Сменить номер телефона"}
        contentModal={<PhoneModal />}
        isModal={isModalPhone}
        modalId={"phone"}
      ></Modal>
      <BottomSheet
        isOpen={isSheetPhone}
        onClose={() => dispatch(setIsSheetPhone(false))}
      >
        <PhoneModal />
      </BottomSheet>

      <Modal
        titleModal={"Удаление аккаунта 💔"}
        contentModal={<DeleteModal logout={logout} />}
        isModal={isModalDelete}
        modalId={"delete"}
      ></Modal>
      <BottomSheet
        isOpen={isSheetDelete}
        onClose={() => dispatch(setIsSheetDelete(false))}
      >
        <DeleteModal logout={logout} />
      </BottomSheet>
    </>
  );
};

export default SettingsPage;
