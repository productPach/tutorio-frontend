"use client";

import { useAppDispatch, useAppSelector } from "@/store/store";
import styles from "../Fio/Fio.module.css";
import buttonStyles from "../../../../../app/tutor/button.module.css";
import componentStyles from "./Education.module.css";
import { deleteTutorEducation } from "@/store/features/tutorSlice";
import {
  setIsModalEducationItem,
  setIsSheetDeleteEducationItem,
} from "@/store/features/modalSlice";
import { useParams, useRouter } from "next/navigation";
import { getAccessToken } from "@/api/server/auth";

export const EducationItemModal = () => {
  const dispatch = useAppDispatch();
  // Получаем значение tutor из Redux
  //const token = useAppSelector((state) => state.auth.token);
  const token = getAccessToken(); // берём из localStorage
  const tutor = useAppSelector((state) => state.tutor.tutor);

  const route = useRouter();
  const { education } = useParams();
  // Преобразуем educationId в строку, если это массив
  const educationId = Array.isArray(education) ? education[0] : education;

  const deleteEducation = (tutorId: string) => {
    if (token && educationId) {
      dispatch(deleteTutorEducation({ tutorId, educationId })).then(() => {
        dispatch(setIsModalEducationItem(false));
        dispatch(setIsSheetDeleteEducationItem(false));
        route.push("/tutor/profile/educations");
      });
    } else {
      console.error("educationId or token is missing");
    }
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
          onClick={() => {
            dispatch(setIsModalEducationItem(false));
            dispatch(setIsSheetDeleteEducationItem(false));
          }}
          type="button"
        >
          Отмена
        </button>
      </div>
    </>
  );
};
