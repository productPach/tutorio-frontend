"use client";
import styles from "../../layout.module.css";
import clsx from "clsx";
import LeftBar from "@/components/Tutor/LeftBar/LeftBar";
import { Education } from "@/components/Tutor/Profile/Education/Education";
import { Modal } from "@/components/Modal/Modal";
import { EducationModal } from "@/components/Tutor/Modal/Profil/Education/EducationModal";
import { useAppSelector } from "@/store/store";
import { ExperienceModal } from "@/components/Tutor/Modal/Profil/Education/ExperienceModal";

const EducationPage: React.FC = () => {
  const page = "Main";
  const isModalEducation = useAppSelector(
    (state) => state.modal.isModalEducation
  );
  const isModalExperience = useAppSelector(
    (state) => state.modal.isModalExperience
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
        contentModal={<ExperienceModal />}
        isModal={isModalExperience}
        modalId={"experience"}
      ></Modal>

      <Modal
        titleModal={"Образование"}
        contentModal={<EducationModal educationId={null} />}
        isModal={isModalEducation}
        modalId={"education"}
      ></Modal>
    </>
  );
};

export default EducationPage;
