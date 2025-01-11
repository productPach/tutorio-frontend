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
import { EducationItemDiplomasModal } from "@/components/Tutor/Modal/Profil/Education/EducationItemDiplomasModal";

const EducationPage: React.FC = () => {
  const page = "Main";

  const dispatch = useDispatch<AppDispatch>();
  const token = useAppSelector((state) => state.auth.token);
  const tutor = useAppSelector((state) => state.tutor.tutor);

  const isModalEducationItem = useAppSelector(
    (state) => state.modal.isModalEducationItem
  );

  const isModalEducationItemDiplomas = useAppSelector(
    (state) => state.modal.isModalEducationItemDiplomas
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
        titleModal={"Документы об образовании"}
        contentModal={<EducationItemDiplomasModal />}
        isModal={isModalEducationItemDiplomas}
        modalId={"educationItemDiplomas"}
      ></Modal>
    </>
  );
};

export default EducationPage;
