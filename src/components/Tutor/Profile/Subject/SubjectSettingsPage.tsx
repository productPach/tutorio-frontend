"use client";
import styles from "../../../../app/tutor/layout.module.css";
import clsx from "clsx";
import LeftBar from "@/components/Tutor/LeftBar/LeftBar";
import { SubjectsSettings } from "@/components/Tutor/Profile/Subject/SubjectsSettings";
import { Modal } from "@/components/Modal/Modal";
import { SubjectModal } from "@/components/Tutor/Modal/Profil/Subject/SubjectModal";
import { useAppSelector } from "@/store/store";

const SubjectsSettingsPage: React.FC = () => {
  const page = "Main";
  const isModalEditSubjectPrices = useAppSelector(
    (state) => state.modal.isModalEditSubjectPrices
  );

  return (
    <>
      <section className={clsx(styles.container, styles.center)}>
        <LeftBar page={page} />
        <div className={styles.content}>
          <SubjectsSettings />
        </div>
      </section>
      <Modal
        titleModal={"Редактор предмета:"}
        contentModal={<SubjectModal />}
        isModal={isModalEditSubjectPrices}
        modalId={"editSubjectPrices"}
      ></Modal>
    </>
  );
};

export default SubjectsSettingsPage;
