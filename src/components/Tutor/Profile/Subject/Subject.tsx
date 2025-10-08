"use client";
import styles from "../../../../app/tutor/layout.module.css";
import componentSubjectStyle from "./Subject.module.css";
import { useAppDispatch, useAppSelector } from "@/store/store";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  getTutorSelectedGoalsGrouped,
  updateTutor,
} from "@/store/features/tutorSlice";
import clsx from "clsx";
import {
  setIsModalEditSubject,
  setIsModalEditSubjectPrices,
  setIsSheetEditSubject,
  setIsSheetEditSubjectPrices,
  setSubjectForEditInModal,
} from "@/store/features/modalSlice";
import { getAllSubjects } from "@/store/features/subjectSlice";

export const Subject = () => {
  const dispatch = useAppDispatch();
  // Получаем значение tutor из Redux
  const token = useAppSelector((state) => state.auth.token);
  const tutor = useAppSelector((state) => state.tutor.tutor);

  const tutorGoalsGrouped = useAppSelector(
    (state) => state.tutor.tutorGoalsGrouped
  );

  useEffect(() => {
    dispatch(getAllSubjects());
    if (tutor?.id) {
      dispatch(getTutorSelectedGoalsGrouped({ tutorId: tutor.id }));
    }
  }, [dispatch, tutor?.id]);

  // Стейт для предметов
  const subjects = useAppSelector((state) => state.subject.subjects);

  useEffect(() => {
    dispatch(getAllSubjects());
  }, [dispatch]);

  // Импортируем предметы
  const listSubjects = subjects;

  // Состояние для свитча
  const [isChecked, setIsChecked] = useState(tutor?.isGroup || false);

  const toggleSwitch = () => {
    setIsChecked((prev) => !prev);
  };

  useEffect(() => {
    if (tutor && token) {
      dispatch(
        updateTutor({
          id: tutor.id,
          isGroup: isChecked,
        })
      ).unwrap();
    }
  }, [isChecked]);

  return (
    <>
      <div className={styles.content_block}>
        <h3>Предметы и условия</h3>
      </div>

      <div className={styles.content_block}>
        <div className={componentSubjectStyle.containerTitle}>
          <span className={styles.titleGrey}>Условия занятий</span>
          <div className={styles.containerEntityShowEnd}>
            <div className={styles.containerEntityTitleDescription}>
              <div>Провожу занятия в группах</div>
              <span>
                Мы будем группировать заявки учеников с одинаковыми условиями.
                Отклик на такой заказ предоставит контакты всех учеников в
                группе
              </span>
            </div>
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

            // Отфильтруем предметы, у которых указана цена
            const subjectPrices = tutor.subjectPrices.filter(
              (item) => item.subjectId === subjectId && item.price
            );

            // берём цели для этого предмета
            const goals = tutorGoalsGrouped[subjectId] || [];
            const selectedGoals = goals.filter((g) => g.selected);

            return (
              <li
                key={index}
                className={componentSubjectStyle.subjectAndPriceLi}
              >
                <div className={componentSubjectStyle.ContainerSelectSubjectLi}>
                  <div
                    className={componentSubjectStyle.selectSubjectLiBorder}
                  ></div>
                  <div className={componentSubjectStyle.selectSubjectLiTitle}>
                    {subjectTitle}
                  </div>
                  {/* <div className={componentSubjectStyle.selectSubjectLiPrice}>
                    {subjectPrices.length === 0 ? "Стоимость не указана" : ""}
                  </div> */}

                  <div className={componentSubjectStyle.selectSubjectLiPrice}>
                    <div className={componentSubjectStyle.checkboxRightContent}>
                      {/* <div className={componentSubjectStyle.inputPriceWrapper}>
                  <input
                    type="text"
                    className={componentSubjectStyle.inputPriceSubject}
                    placeholder="Цена занятия, ₽"
                  />

                  <select className={componentSubjectStyle.inputPriceSelect}>
                    {availableDurations.map((duration) => (
                      <option key={duration} value={duration}>
                        {duration === "day" ? "день" : `${duration} мин.`}
                      </option>
                    ))}
                  </select>
                </div> */}

                      {/* <Image
                        onClick={(e) => {
                          e.preventDefault();
                          dispatch(setIsModalEditSubjectPrices(true));
                          dispatch(setSubjectForEditInModal(subjectId)); // Передаем ID предмета
                        }}
                        className={componentSubjectStyle.img}
                        src={
                          tutor?.subjectPrices?.some(
                            (item) => subjectId === item.subjectId
                          )
                            ? "/../img/icon/tutor/pencilSimple.svg"
                            : "/../img/icon/tutor/plus.svg"
                        }
                        alt="Настройки цены занятия в зависимости от места"
                        width={21}
                        height={21}
                      /> */}
                      <Link
                        href="#"
                        className={componentSubjectStyle.linkToPriceSubject}
                        onClick={(e) => {
                          e.preventDefault();
                          dispatch(setSubjectForEditInModal(subjectId)); // Передаем ID предмета
                          if (window.innerWidth < 769) {
                            dispatch(setIsSheetEditSubject(true)); // Открываем шторку
                          } else {
                            dispatch(setIsModalEditSubject(true));
                          }
                        }}
                      >
                        {/* {tutor?.subjectPrices?.some(
                          (item) => subjectId === item.subjectId
                        )
                          ? "редактировать"
                          : "добавить стоимость"} */}
                        редактировать
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Цели */}
                {selectedGoals.length > 0 ? (
                  <div className={componentSubjectStyle.subjectPrisesStart}>
                    {/* 🎯 Выбранные цели <br /> */}
                    {selectedGoals.map((g) => g.title).join(", ")}
                  </div>
                ) : (
                  <div
                    className={clsx(
                      componentSubjectStyle.subjectPrisesStart,
                      componentSubjectStyle.textColorRed
                    )}
                  >
                    Выберите цели
                  </div>
                )}
                {subjectPrices.length > 0 ? (
                  <div className={componentSubjectStyle.subjectPrisesStart}>
                    {subjectPrices
                      .sort(
                        (a, b) =>
                          ["online", "group", "travel", "home"].indexOf(
                            a.format
                          ) -
                          ["online", "group", "travel", "home"].indexOf(
                            b.format
                          )
                      )
                      .map(({ format, price, duration }) => (
                        <div key={format}>
                          {format === "online" && "🖥️ Дистанционно"}
                          {format === "group" && "👫 Группа"}
                          {format === "travel" && "📍Выезд"}
                          {format === "home" && "🏠 Дома"}:{" "}
                          {new Intl.NumberFormat("ru-RU").format(price)} ₽ /{" "}
                          {duration === "day" ? "за день" : `${duration} мин`}
                        </div>
                      ))}
                  </div>
                ) : (
                  <div
                    className={clsx(
                      componentSubjectStyle.subjectPrisesStart,
                      componentSubjectStyle.textColorRed
                    )}
                  >
                    Стоимость не указана
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};
