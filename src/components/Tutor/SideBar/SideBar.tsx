"use client";
import Image from "next/image";
import styles from "../../../app/tutor/layout.module.css";
import inputStyles from "../../../app/tutor/input.module.css";
import clsx from "clsx";
import React, { ChangeEvent, useState } from "react";
import { setOrderFilters } from "@/store/features/orderSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState, useAppSelector } from "@/store/store";
import { data } from "@/utils/listSubjects";
import { listGoalForSubjects } from "@/utils/subjects/goalForSubjects";
import { locations } from "@/utils/locations/locations";

const SideBar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const tutor = useAppSelector((state) => state.tutor.tutor);
  const selectedPlaceFilters = useSelector(
    (state: RootState) => state.orders.filters.selectedPlaceFilters
  );
  const selectedGoalFilters = useSelector(
    (state: RootState) => state.orders.filters.selectedGoalFilters
  );

  const handleFilterChange = (filter: string, type: "place" | "goal") => {
    if (type === "place") {
      const updatedPlaceFilters = selectedPlaceFilters.includes(filter)
        ? selectedPlaceFilters.filter((f: string) => f !== filter) // Убираем фильтр
        : [...selectedPlaceFilters, filter]; // Добавляем фильтр
      dispatch(
        setOrderFilters({
          placeFilters: updatedPlaceFilters,
          goalFilters: selectedGoalFilters,
        })
      );
    } else if (type === "goal") {
      const updatedGoalFilters = selectedGoalFilters.includes(filter)
        ? selectedGoalFilters.filter((f: string) => f !== filter) // Убираем фильтр
        : [...selectedGoalFilters, filter]; // Добавляем фильтр
      dispatch(
        setOrderFilters({
          placeFilters: selectedPlaceFilters,
          goalFilters: updatedGoalFilters,
        })
      );
    }
  };

  // Чтобы выводить в сайдбаре те цели занятий, которые подходят под предметы репетитора, делаем следующее
  // Вытаскиваем объекты предметов по предметам репетитора
  const subjectObj = data.filter((subject) =>
    tutor?.subject.includes(subject.id_p)
  );
  // Преобразуем полученные объекты в массив айдишников целей
  const goalIdArr = subjectObj.map((subject) => subject.goal_id);
  // Удаляем дубли айдишников целей
  const uniqueGoalIds = goalIdArr.filter(
    (goalId, index) => goalIdArr.indexOf(goalId) === index
  );

  const goalTitleArrObj = listGoalForSubjects.filter((goal) =>
    uniqueGoalIds.includes(goal.id)
  );

  // Убираем дубликаты с помощью reduce
  const uniqueGoals = goalTitleArrObj
    .flatMap((goalArr) => goalArr.goals)
    .reduce<string[]>((acc, goal) => {
      if (!acc.includes(goal)) {
        acc.push(goal);
      }
      return acc;
    }, []);

  // Стейт для меню с регионами
  const [regionMenu, setRegionMenu] = useState(false);

  const handleRegionSelect = () => {
    setRegionMenu((state) => !state);
  };

  const regionArr = locations.map((region) => region.shortTitle);
  const [regionList, setRegionList] = useState(regionArr);

  const handleInputRegion = (e: ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value.toLowerCase(); // Преобразуем значение ввода в нижний регистр для поиска

    const filterRegionList = locations
      .filter(
        (region) =>
          region.title.toLowerCase().includes(searchValue) ||
          region.area.toLowerCase().includes(searchValue)
      )
      .map((region) => region.shortTitle);

    setRegionList(filterRegionList);
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebar_filter}>
        <div>
          <p className={styles.sidebar_title}>Место занятий</p>
          <input
            type="checkbox"
            className={inputStyles.checkbox_input}
            id="checkbox-1"
            checked={selectedPlaceFilters.includes("Дистанционно")}
            onChange={() => handleFilterChange("Дистанционно", "place")}
          />
          <label className={inputStyles.checkbox_label} htmlFor="checkbox-1">
            <span className={inputStyles.checkbox}></span>
            <p className={inputStyles.checkbox_label_text}>Дистанционно</p>
          </label>

          <input
            type="checkbox"
            className={inputStyles.checkbox_input}
            id="checkbox-2"
            checked={selectedPlaceFilters.includes("У репетитора")}
            onChange={() => handleFilterChange("У репетитора", "place")}
          />
          <label className={inputStyles.checkbox_label} htmlFor="checkbox-2">
            <span className={inputStyles.checkbox}></span>
            <p className={inputStyles.checkbox_label_text}>У репетитора</p>
          </label>

          <input
            type="checkbox"
            className={inputStyles.checkbox_input}
            id="checkbox-3"
            checked={selectedPlaceFilters.includes("У меня дома")}
            onChange={() => handleFilterChange("У меня дома", "place")}
          />
          <label className={inputStyles.checkbox_label} htmlFor="checkbox-3">
            <span className={inputStyles.checkbox}></span>
            <p className={inputStyles.checkbox_label_text}>У ученика</p>
          </label>
        </div>

        <div>
          <p className={styles.sidebar_title}>Регион</p>
          <div
            className={clsx(styles.sidebar_container_geo)}
            onClick={() => handleRegionSelect()}
          >
            <div className={clsx(styles.sidebar_geo)}>
              <Image
                src="../img/icon/location.svg"
                alt="Геолокация"
                width={15}
                height={18}
                className={styles.header_geoImage}
              />
              Москва
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M15.5359 10.4082L12.3539 13.5902C12.1586 13.7855 11.842 13.7855 11.6468 13.5902L8.46481 10.4082C8.26954 10.213 8.26954 9.8964 8.46481 9.70113C8.66007 9.50587 8.97665 9.50587 9.17191 9.70113L11.972 12.5012C11.9814 12.5007 11.9908 12.5004 12.0003 12.5004C12.0027 12.5004 12.0051 12.5004 12.0075 12.5005C12.0146 12.5006 12.0216 12.5008 12.0287 12.5012L14.8288 9.70113C15.024 9.50587 15.3406 9.50587 15.5359 9.70113C15.7311 9.8964 15.7311 10.213 15.5359 10.4082Z"
                  fill="#2A2A2A"
                />
              </svg>
            </div>
            <div
              onClick={(e) => e.stopPropagation()}
              className={clsx(styles.sidebar_geo_select_region, {
                [styles.open]: regionMenu,
              })}
            >
              <input
                id="selectRegionInput"
                type="text"
                placeholder="Поиск региона"
                autoComplete="off"
                onChange={handleInputRegion}
              />

              <div className={styles.listRegion}>
                {regionList.map((region, index) => (
                  <div className={styles.listRegion_region} key={index}>
                    {region}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <p className={styles.sidebar_title}>Цель занятий</p>

          {uniqueGoals.map((goal, index) => (
            <div key={index}>
              <input
                type="checkbox"
                className={inputStyles.checkbox_input}
                id={`checkboxGoal-${index}`}
                checked={selectedGoalFilters.includes(`${goal}`)}
                onChange={() => handleFilterChange(`${goal}`, "goal")}
              />
              <label
                className={inputStyles.checkbox_label}
                htmlFor={`checkboxGoal-${index}`}
              >
                <span className={inputStyles.checkbox}></span>
                <p className={inputStyles.checkbox_label_text}>{goal}</p>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
