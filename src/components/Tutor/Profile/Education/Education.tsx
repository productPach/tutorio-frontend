import { useDispatch } from "react-redux";
import generalStyle from "../../../../app/general.module.css";
import styles from "../../../../app/tutor/layout.module.css";
import componentStyle from "../GeneralInfo/GeneralInfo.module.css";

import clsx from "clsx";
import { AppDispatch, useAppSelector } from "@/store/store";
import Image from "next/image";
import {
  setIsModalEducation,
  setIsModalExperience,
} from "@/store/features/modalSlice";
import { getYearWord } from "@/utils/words/getYearWord";
import Link from "next/link";
import { deleteTutorEducation } from "@/store/features/tutorSlice";

export const Education = () => {
  const dispatch = useDispatch<AppDispatch>();
  const tutor = useAppSelector((state) => state.tutor.tutor);
  const educationLength = tutor?.educations?.length || 0;

  return (
    <>
      <div className={styles.content_block}>
        <h3>Образование и опыт</h3>
      </div>

      <div className={styles.content_block}>
        <div className={clsx(generalStyle.dplFlxRwNwrAiCntrJcBtwn)}>
          <div className={componentStyle.container}>
            <span>Общий репетиторский стаж</span>
            <h2
              onClick={(e) => {
                e.preventDefault();
                dispatch(setIsModalExperience(true));
              }}
              title="Изменить"
            >
              {tutor?.experience
                ? tutor?.experience +
                  " " +
                  getYearWord(Number(tutor?.experience))
                : "Добавить стаж"}
            </h2>
          </div>
          <Image
            onClick={(e) => {
              e.preventDefault();
              dispatch(setIsModalExperience(true));
            }}
            title="Изменить"
            className={componentStyle.img}
            src="/../img/icon/tutor/pencilSimple.svg"
            alt="Изменить стаж"
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
                dispatch(setIsModalEducation(true));
              }}
            >
              Образование
            </h2>
          </div>
          <Image
            onClick={(e) => {
              e.preventDefault();
              dispatch(setIsModalEducation(true));
            }}
            className={componentStyle.img}
            src={"/../img/icon/tutor/plus.svg"}
            alt="Образование"
            title="Добавить образование"
            width={21}
            height={21}
          />
        </div>
        <div
          className={clsx(componentStyle.container, componentStyle.description)}
        >
          <span
            onClick={(e) => {
              e.preventDefault();
              dispatch(setIsModalEducation(true));
            }}
          >
            {educationLength === 0 && (
              <>
                Укажите полное наименование учебного заведения и период
                обучения. Это поможет ученикам создать представление о вашем
                образовании.
                <br></br>
                <br></br>
                При желании вы также можете приложить диплом или сертификат для
                подтверждения ваших квалификаций. Если у вас есть дополнительные
                курсы или тренинги, их также стоит упомянуть.
              </>
            )}
          </span>
        </div>

        <div
          onClick={(e) => {
            e.preventDefault();
          }}
          className={componentStyle.profileInfo}
        >
          <ul className={componentStyle.edicationListUl}>
            {educationLength > 0 &&
              tutor?.educations.map((item) => {
                return (
                  <li key={item.id} className={componentStyle.edicationListLi}>
                    <h3>
                      <Link href={`educations/${item.id}`}>
                        {item.educationInfo}
                      </Link>
                    </h3>
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
    </>
  );
};
