"use client";
import styles from "../../layout.module.css";
import clsx from "clsx";
import LeftBar from "@/components/Tutor/LeftBar/LeftBar";
import { Education } from "@/components/Tutor/Profile/Education/Education";
import { Modal } from "@/components/Modal/Modal";
import { EducationModal } from "@/components/Tutor/Modal/Profil/Education/EducationModal";
import { useAppSelector } from "@/store/store";

const EducationPage: React.FC = () => {
  const page = "Main";
  const isModalEducation = useAppSelector(
    (state) => state.modal.isModalEducation
  );

  return (
    <>
      <section className={clsx(styles.container, styles.center)}>
        <LeftBar page={page} />
        <div className={styles.content}>
          <Education />
        </div>
      </section>
      <Modal
        titleModal={"Репетиторский стаж"}
        contentModal={<EducationModal />}
        isModal={isModalEducation}
        modalId={"education"}
      ></Modal>
    </>
  );
};

export default EducationPage;
