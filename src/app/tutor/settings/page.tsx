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

const SettingsPage: React.FC = () => {
  const page = "Settings";

  const router = useRouter();
  const dispatch = useAppDispatch();
  const tutor = useAppSelector((state) => state.tutor.tutor);

  const isModalExit = useAppSelector((state) => state.modal.isModalExit);

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
    </>
  );
};

export default SettingsPage;
