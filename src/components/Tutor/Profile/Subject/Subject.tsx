"use client";
import { data } from "@/utils/listSubjects";
import styles from "../../../../app/tutor/layout.module.css";
import componentSubjectStyle from "./Subject.module.css";
import { useAppDispatch, useAppSelector } from "@/store/store";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { updateTutor } from "@/store/features/tutorSlice";

export const Subject = () => {
  const dispatch = useAppDispatch();
  // Получаем значение tutor из Redux
  const token = useAppSelector((state) => state.auth.token);
  const tutor = useAppSelector((state) => state.tutor.tutor);
  // Получаем значение loading из Redux
  const isLoading = useAppSelector((state) => state.tutor.loading);
  const updateStatus = useAppSelector((state) => state.tutor.updateStatus);

  const [successUpdateTutor, setSuccessUpdateTutor] = useState(true);

  // Импортируем предметы
  const listSubjects = data;
  // Предметы-категории
  const listCategorySubjects = listSubjects.filter(
    (subject) => subject.general
  );

  // Состояние для свитча
  const [isChecked, setIsChecked] = useState(tutor?.isGroup || false);

  const toggleSwitch = () => {
    setIsChecked((prev) => {
      const newState = !prev;
      update(newState); // Передаем новое значение
      return newState;
    });
  };

  const update = (isGroup: boolean) => {
    console.log(isChecked);

    if (tutor && token) {
      const id = tutor.id;
      const status = tutor?.status;
      dispatch(
        updateTutor({
          id,
          token,
          status,
          isGroup,
        })
      ).unwrap();
    }
  };

  return (
    <>
      <div className={styles.content_block}>
        <h3>Предметы и условия</h3>
      </div>

      <div className={styles.content_block}>
        <div className={componentSubjectStyle.containerTitle}>
          <span className={styles.titleGrey}>Условия занятий</span>
          <div className={styles.containerEntityShow}>
            <div className={styles.inputContainer}>
              <label className={styles.iosSwitch}>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={toggleSwitch}
                />
                <span className={styles.slider}></span>
              </label>
            </div>
            <div className={styles.description2}>Провожу занятия в группах</div>
          </div>
        </div>
      </div>

      <div className={styles.content_block}>
        <div className={componentSubjectStyle.containerTitleAndImg}>
          <div className={componentSubjectStyle.containerTitle}>
            <span className={styles.titleGrey}>Выбранные предметы</span>
          </div>
          <div className={componentSubjectStyle.containerImg}>
            <Link
              href={"/tutor/profile/subjects/subjects-settings"}
              prefetch={true}
            >
              <Image
                title="Изменить список предметов"
                className={componentSubjectStyle.img}
                src="/../img/icon/tutor/pencilSimple.svg"
                alt="Изменить список предметов"
                width={21}
                height={21}
              />
            </Link>
            <Link
              href={"/tutor/profile/subjects/subjects-settings"}
              prefetch={true}
            >
              <Image
                className={componentSubjectStyle.img}
                src={"/../img/icon/tutor/plus.svg"}
                alt="Добавить предметы"
                title="Добавить предметы"
                width={21}
                height={21}
              />
            </Link>
          </div>
        </div>

        <ul className={componentSubjectStyle.selectSubjectUl}>
          {tutor?.subject.map((subjectId, index) => {
            const subjectTitle = listSubjects.find(
              (subject) => subject.id_p === subjectId
            )?.title;
            return (
              <li
                key={index}
                className={componentSubjectStyle.ContainerSelectSubjectLi}
              >
                <div
                  className={componentSubjectStyle.selectSubjectLiBorder}
                ></div>
                <div className={componentSubjectStyle.selectSubjectLiTitle}>
                  {subjectTitle}
                </div>
                <div className={componentSubjectStyle.selectSubjectLiPrice}>
                  Цена не указана
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};
