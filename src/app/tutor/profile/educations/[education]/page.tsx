"use client";
import styles from "../../../layout.module.css";
import clsx from "clsx";
import LeftBar from "@/components/Tutor/LeftBar/LeftBar";
import { AppDispatch, useAppSelector } from "@/store/store";
import { useDispatch } from "react-redux";
import { useParams } from "next/navigation";
import { EducationItem } from "@/components/Tutor/Profile/Education/EducationItem";
import { Modal } from "@/components/Modal/Modal";
import { EducationItemModal } from "@/components/Tutor/Modal/Profil/Education/EducationItemModal";
import { EditEducationModal } from "@/components/Tutor/Modal/Profil/Education/EditEducationModal";

const EducationPage: React.FC = () => {
  const page = "Main";

  const dispatch = useDispatch<AppDispatch>();
  const token = useAppSelector((state) => state.auth.token);
  const tutor = useAppSelector((state) => state.tutor.tutor);

  const isModalEducationItem = useAppSelector(
    (state) => state.modal.isModalEducationItem
  );
  const isModalEditEducation = useAppSelector(
    (state) => state.modal.isModalEditEducation
  );

  const { education } = useParams();
  // Преобразуем educationId в строку, если это массив
  const educationId = Array.isArray(education) ? education[0] : education;

  const educationIndex = tutor?.educations.findIndex(
    (education) => education.id === educationId
  );

  // Проверяем, найден ли индекс образования
  if (educationIndex === undefined || educationIndex === -1) {
    return (
      <section className={clsx(styles.container, styles.center)}>
        <LeftBar page={page} />
        <div className={styles.content}>Образование не найдено.</div>
      </section>
    );
  }

  return (
    <>
      <section className={clsx(styles.container, styles.center)}>
        <LeftBar page={page} />
        <div className={styles.content}>
          <EducationItem
            educationId={educationId}
            educationIndex={educationIndex}
          />
        </div>
      </section>
      <Modal
        titleModal={"Удалить образование?"}
        contentModal={<EducationItemModal />}
        isModal={isModalEducationItem}
        modalId={"educationItem"}
      ></Modal>
      <Modal
        titleModal={"Образование"}
        contentModal={
          <EditEducationModal
            educationId={educationId}
            educationIndex={educationIndex}
          />
        }
        isModal={isModalEditEducation}
        modalId={"editEducation"}
      ></Modal>
    </>
  );
};

export default EducationPage;
