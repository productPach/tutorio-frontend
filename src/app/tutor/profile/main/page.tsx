"use client";
import styles from "../../layout.module.css";
import clsx from "clsx";
import LeftBar from "@/components/Tutor/LeftBar/LeftBar";
import { GeneralInfo } from "@/components/Tutor/Profile/GeneralInfo/GeneralInfo";
import { Modal } from "@/components/Modal/Modal";
import { Fio } from "@/components/Tutor/Modal/Profil/Fio/Fio";
import { useAppSelector } from "@/store/store";
import { ProfileInfo } from "@/components/Tutor/Modal/Profil/ProfileInfo/ProfileInfo";

const MainPage: React.FC = () => {
  const page = "Main";
  const isModalFio = useAppSelector((state) => state.modal.isModalFio);
  const isModalProfileInfo = useAppSelector(
    (state) => state.modal.isModalProfileInfo
  );

  return (
    <>
      <section className={clsx(styles.container, styles.center)}>
        <LeftBar page={page} />
        <div className={styles.content}>
          <GeneralInfo />
        </div>
      </section>
      <Modal
        titleModal={"ФИО"}
        contentModal={<Fio />}
        isModal={isModalFio}
        modalId={"fio"}
      ></Modal>
      <Modal
        titleModal={"О себе"}
        contentModal={<ProfileInfo />}
        isModal={isModalProfileInfo}
        modalId={"profileInfo"}
      ></Modal>
    </>
  );
};

export default MainPage;
