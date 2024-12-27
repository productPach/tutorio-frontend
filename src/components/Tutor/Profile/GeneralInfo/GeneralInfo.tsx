import { useDispatch } from "react-redux";
import generalStyle from "../../../../app/general.module.css";
import styles from "../../../../app/tutor/layout.module.css";
import componentStyle from "../GeneralInfo/GeneralInfo.module.css";

import clsx from "clsx";
import { AppDispatch, useAppSelector } from "@/store/store";
import Image from "next/image";
import {
  setIsModalFio,
  setIsModalProfileInfo,
} from "@/store/features/modalSlice";

export const GeneralInfo = () => {
  const dispatch = useDispatch<AppDispatch>();
  const token = useAppSelector((state) => state.auth.token);
  const tutor = useAppSelector((state) => state.tutor.tutor);
  return (
    <>
      <div className={styles.content_block}>
        <h3>Общая информация</h3>
      </div>

      <div className={styles.content_block}>
        <div className={clsx(generalStyle.dplFlxRwNwrAiCntrJcBtwn)}>
          <div className={componentStyle.container}>
            <span>Фамилия Имя Отчество</span>
            <h2
              onClick={(e) => {
                e.preventDefault();
                dispatch(setIsModalFio(true));
              }}
              title="Изменить"
            >
              {tutor?.name}
            </h2>
          </div>
          <Image
            onClick={(e) => {
              e.preventDefault();
              dispatch(setIsModalFio(true));
            }}
            title="Изменить"
            className={componentStyle.img}
            src="/../img/icon/tutor/pencilSimple.svg"
            alt="Общая информация"
            width={21}
            height={21}
          />
        </div>
      </div>

      <div className={styles.content_block}>
        <div className={clsx(generalStyle.dplFlxRwNwrAiCntrJcBtwn)}>
          <div className={componentStyle.container}>
            <h2
              onClick={(e) => {
                e.preventDefault();
                dispatch(setIsModalProfileInfo(true));
              }}
            >
              О себе
            </h2>
          </div>
          <Image
            onClick={(e) => {
              e.preventDefault();
              dispatch(setIsModalProfileInfo(true));
            }}
            className={componentStyle.img}
            src={
              tutor?.profileInfo
                ? "/../img/icon/tutor/pencilSimple.svg"
                : "/../img/icon/tutor/plus.svg"
            }
            alt="Общая информация"
            width={21}
            height={21}
          />
        </div>
        <div className={componentStyle.container}>
          <span
            onClick={(e) => {
              e.preventDefault();
              dispatch(setIsModalProfileInfo(true));
            }}
          >
            {!tutor?.profileInfo &&
              "Расскажите о вашем опыте, подходе к обучению и технике, которые вы используете. Поделитесь, что мотивирует вас в преподавании и чем вы можете помочь ученикам"}
          </span>
        </div>

        <p
          onClick={(e) => {
            e.preventDefault();
            dispatch(setIsModalProfileInfo(true));
          }}
          className={componentStyle.profileInfo}
        >
          {tutor?.profileInfo && tutor?.profileInfo}
        </p>
      </div>
    </>
  );
};
