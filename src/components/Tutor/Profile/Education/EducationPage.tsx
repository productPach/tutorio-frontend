"use client";
import styles from "../../../../app/tutor/layout.module.css";
import clsx from "clsx";
import LeftBar from "@/components/Tutor/LeftBar/LeftBar";
import { Education } from "@/components/Tutor/Profile/Education/Education";
import { Modal } from "@/components/Modal/Modal";
import { EducationModal } from "@/components/Tutor/Modal/Profil/Education/EducationModal";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { ExperienceModal } from "@/components/Tutor/Modal/Profil/Education/ExperienceModal";
import { BottomSheet } from "@/components/BottomSheet/BottomSheet";
import {
  setIsSheetEducation,
  setIsSheetExperience,
} from "@/store/features/modalSlice";

const EducationPage: React.FC = () => {
  const page = "Main";
  const dispatch = useAppDispatch();
  const isModalEducation = useAppSelector(
    (state) => state.modal.isModalEducation
  );
  const isSheetEducation = useAppSelector(
    (state) => state.modal.isSheetEducation
  );
  const isModalExperience = useAppSelector(
    (state) => state.modal.isModalExperience
  );
  const isSheetExperience = useAppSelector(
    (state) => state.modal.isSheetExperience
  );

  return (
    <>
      <section
        className={clsx(styles.container, styles.center, styles.paddingBottM)}
      >
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
      <BottomSheet
        isOpen={isSheetExperience}
        onClose={() => dispatch(setIsSheetExperience(false))}
      >
        <ExperienceModal />
      </BottomSheet>

      <Modal
        titleModal={"Образование"}
        contentModal={<EducationModal educationId={null} />}
        isModal={isModalEducation}
        modalId={"education"}
      ></Modal>
      <BottomSheet
        isOpen={isSheetEducation}
        onClose={() => dispatch(setIsSheetEducation(false))}
      >
        <EducationModal educationId={null} />
      </BottomSheet>
    </>
  );
};

export default EducationPage;
