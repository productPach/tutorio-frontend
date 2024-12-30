"use client";
import styles from "../../../layout.module.css";
import clsx from "clsx";
import LeftBar from "@/components/Tutor/LeftBar/LeftBar";
import { AppDispatch, useAppSelector } from "@/store/store";
import { deleteTutorEducation } from "@/store/features/tutorSlice";
import { useDispatch } from "react-redux";
import { useParams } from "next/navigation";
import { EducationItem } from "@/components/Tutor/Profile/Education/EducationItem";

const EducationPage: React.FC = () => {
  const page = "Main";

  const dispatch = useDispatch<AppDispatch>();
  const token = useAppSelector((state) => state.auth.token);
  const tutor = useAppSelector((state) => state.tutor.tutor);
  const { education } = useParams();
  // Преобразуем educationId в строку, если это массив
  const id = Array.isArray(education) ? education[0] : education;

  const educationIndex = tutor?.educations.findIndex(
    (education) => education.id === id
  );

  const deleteEducation = (tutorId: string, educationId: string) => {
    token && dispatch(deleteTutorEducation({ tutorId, educationId, token }));
  };
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
    <section className={clsx(styles.container, styles.center)}>
      <LeftBar page={page} />
      <div className={styles.content}>
        <EducationItem educationId={id} educationIndex={educationIndex} />

        <span onClick={() => tutor && deleteEducation(tutor.id, id)}>
          Удалить
        </span>
      </div>
    </section>
  );
};

export default EducationPage;
