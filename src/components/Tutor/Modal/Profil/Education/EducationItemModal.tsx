"use client";

import { useAppDispatch, useAppSelector } from "@/store/store";
import styles from "../Fio/Fio.module.css";
import buttonStyles from "../../../../../app/tutor/button.module.css";
import componentStyles from "./Education.module.css";
import { deleteTutorEducation } from "@/store/features/tutorSlice";
import { setIsModalEducationItem } from "@/store/features/modalSlice";
import { useParams, useRouter } from "next/navigation";

export const EducationItemModal = () => {
  const dispatch = useAppDispatch();
  // Получаем значение tutor из Redux
  const token = useAppSelector((state) => state.auth.token);
  const tutor = useAppSelector((state) => state.tutor.tutor);

  const route = useRouter();
  const { education } = useParams();
  // Преобразуем educationId в строку, если это массив
  const educationId = Array.isArray(education) ? education[0] : education;

  const deleteEducation = (tutorId: string) => {
    token &&
      dispatch(deleteTutorEducation({ tutorId, educationId, token })).then(
        () => {
          dispatch(setIsModalEducationItem(false));
          route.push("/tutor/profile/educations");
        }
      );
  };

  return (
    <>
      <div className={styles.description}>
        Вы действительно хотите удалить запись об образовании?
      </div>

      <div className={componentStyles.containerFlxRw}>
        <button
          className={buttonStyles.buttonGr}
          onClick={() => tutor && deleteEducation(tutor?.id)}
          type="button"
        >
          Удалить образование
        </button>
        <button
          className={buttonStyles.buttonBlc}
          onClick={() => dispatch(setIsModalEducationItem(false))}
          type="button"
        >
          Отмена
        </button>
      </div>
    </>
  );
};
