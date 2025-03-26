"use client";

import { useAppDispatch, useAppSelector } from "@/store/store";
import styles from "../../../Tutor/Modal/Profil/Fio/Fio.module.css";
import buttonStyles from "../../../../app/tutor/button.module.css";
import componentStyles from "..//../../Tutor/Modal/Profil/Education/Education.module.css";
import { setIsModalExit, setScrollY } from "@/store/features/modalSlice";

export const ExitModal = ({ logout }: { logout: () => void }) => {
  const dispatch = useAppDispatch();
  // Получаем значение tutor из Redux
  const student = useAppSelector((state) => state.student.student);

  return (
    <>
      <div className={styles.description}>
        Вы действительно хотите выйти из аккаунта?
      </div>

      <div className={componentStyles.containerFlxRw}>
        <button
          className={buttonStyles.buttonGr}
          onClick={() => {
            if (student) {
              logout();
              dispatch(setIsModalExit(false));
              dispatch(setScrollY(0));
            }
          }}
          type="button"
        >
          Выйти
        </button>
        <button
          className={buttonStyles.buttonBlc}
          onClick={(e) => {
            e.preventDefault();
            dispatch(setIsModalExit(false));
            dispatch(setScrollY(0));
          }}
          type="button"
        >
          Отмена
        </button>
      </div>
    </>
  );
};
