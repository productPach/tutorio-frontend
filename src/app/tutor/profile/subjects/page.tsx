"use client";
import styles from "../../layout.module.css";
import clsx from "clsx";
import LeftBar from "@/components/Tutor/LeftBar/LeftBar";
import { Subject } from "@/components/Tutor/Profile/Subject/Subject";
import { Modal } from "@/components/Modal/Modal";
import { useAppSelector } from "@/store/store";
import { SubjectModal } from "@/components/Tutor/Modal/Profil/Subject/SubjectModal";

const SubjectsPage: React.FC = () => {
  const page = "Main";
  const isModalEditSubject = useAppSelector(
    (state) => state.modal.isModalEditSubject
  );

  return (
    <>
      <section className={clsx(styles.container, styles.center)}>
        <LeftBar page={page} />
        <div className={styles.content}>
          <Subject />
        </div>
      </section>
      <Modal
        titleModal={"Редактор предметов и цен"}
        contentModal={<SubjectModal />}
        isModal={isModalEditSubject}
        modalId={"editSubject"}
      ></Modal>
    </>
  );
};

export default SubjectsPage;
