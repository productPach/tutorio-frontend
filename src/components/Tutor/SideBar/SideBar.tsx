"use client";
import Image from "next/image";
import styles from "../../../app/tutor/layout.module.css";
import inputStyles from "../../../app/tutor/input.module.css";
import locationsStyles from "../../../app/tutor/locations.module.css";
import clsx from "clsx";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { getAllOrders, setOrderFilters } from "@/store/features/orderSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState, useAppSelector } from "@/store/store";
import { listGoalForSubjects } from "@/utils/subjects/goalForSubjects";
import { setRegionUser } from "@/store/features/authSlice";
import { setTutor } from "@/store/features/tutorSlice";
import { Tutor } from "@/types/types";
import { getAllSubjects } from "@/store/features/subjectSlice";
import { getLocationSelectionText } from "@/utils/words/getLocationSelectionText";
import { findLocTitleByIdWithDistrict } from "@/utils/locations/getTitleLocationById";
import Link from "next/link";

const SideBar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const token = useAppSelector((state) => state.auth.token);
  const tutor = useAppSelector((state) => state.tutor.tutor) as Tutor;

  const selectedPlaceFilters = useSelector(
    (state: RootState) => state.orders.filters.selectedPlaceFilters
  );
  const selectedGoalFilters = useSelector(
    (state: RootState) => state.orders.filters.selectedGoalFilters
  );
  // Получаем дату городов из Redux
  const locations = useAppSelector((state) => state.locations.city);

  const subjects = useAppSelector((state) => state.subject.subjects);

  useEffect(() => {
    dispatch(getAllSubjects());
  }, [dispatch]);

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
  const subjectObj = subjects.filter((subject) =>
    tutor?.subject?.includes(subject.id_p)
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
  // Стейт для значения инпута поиска региона
  const [inputRegionValue, setInputRegionValue] = useState<string>("");

  const handleRegionSelect = () => {
    setRegionMenu((state) => !state);
  };

  const [regionList, setRegionList] = useState<string[] | undefined>();

  useEffect(() => {
    const regionArr = locations.map((region) => region.shortTitle);
    setRegionList(regionArr);
  }, [locations]);

  const handleInputRegion = (e: ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value.toLowerCase(); // Преобразуем значение ввода в нижний регистр для поиска
    setInputRegionValue(searchValue);

    const filterRegionList = locations
      .filter(
        (region) =>
          region.title.toLowerCase().includes(searchValue) ||
          region.area.toLowerCase().includes(searchValue)
      )
      .map((region) => region.shortTitle);

    setRegionList(filterRegionList);
  };

  const changeRegion = (region: string) => {
    const userRegionObj = locations.find((item) => item.shortTitle === region);
    if (userRegionObj) {
      setRegionMenu(false);
      // Обновляем регион в объекте юзера
      const userRegion = {
        city: userRegionObj.title,
        area: userRegionObj.area,
      };
      // Обновляем регион в объекте репетитора
      const updateTutor = {
        ...tutor,
        region: userRegionObj.title,
      };
      dispatch(setRegionUser(userRegion));
      dispatch(setTutor(updateTutor));
      localStorage.setItem("region-user", JSON.stringify(userRegion));
      localStorage.setItem("tutor", JSON.stringify(updateTutor));
      setTimeout(() => {
        setInputRegionValue("");
        setRegionList(regionList);
      }, 500);

      token && dispatch(getAllOrders(token));
    }
  };

  // const sidebarRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   if (sidebarRef.current) {
  //     const height = sidebarRef.current.offsetHeight;
  //     console.log("Sidebar height:", height);
  //   }
  // }, [uniqueGoals]);

  // const [isScrolledPast, setIsScrolledPast] = useState(false);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     const sidebarHeight = sidebarRef.current?.offsetHeight || 0;
  //     const scrollY = window.scrollY;

  //     setIsScrolledPast(scrollY > 360);
  //   };

  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, []);

  return (
    <>
      {/* <div ref={sidebarRef} className={styles.sidebar}>
        <div
          className={clsx(styles.sidebar_filter, {
            [styles.fixedSB]: isScrolledPast,
          })}
        > */}
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
                {tutor?.region}
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
                <div
                  className={clsx(styles.select_region_container, {
                    [styles.close]: !regionMenu,
                  })}
                >
                  <div
                    className={clsx(styles.select_region_input_container, {
                      [styles.close]: !regionMenu,
                    })}
                  >
                    <input
                      id="selectRegionInput"
                      type="text"
                      placeholder="Поиск региона"
                      autoComplete="off"
                      value={inputRegionValue}
                      onChange={handleInputRegion}
                    />
                  </div>

                  <div className={styles.listRegion}>
                    {regionList &&
                      regionList.map((region, index) => (
                        <div
                          className={styles.listRegion_region}
                          key={index}
                          onClick={() => changeRegion(region)}
                        >
                          {region}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {!(
            selectedPlaceFilters.includes("Дистанционно") &&
            !selectedPlaceFilters.includes("У репетитора") &&
            !selectedPlaceFilters.includes("У меня дома")
          ) && (
            <Link href="/tutor/profile/locations">
              <div>
                <p className={styles.sidebar_title}>Локации</p>
                {tutor?.tutorTripCity.length > 0 ||
                tutor?.tutorTripArea.length > 0 ? (
                  <div className={locationsStyles.locations_containerSideBar}>
                    {(() => {
                      const cityIds = tutor?.tutorTripCity || [];
                      const areaIds = tutor?.tutorTripArea || [];

                      const allIds = [...cityIds, ...areaIds]; // сначала города, потом районы
                      const shownIds = allIds.slice(0, 10); // максимум 10
                      const remainingCount = allIds.length - shownIds.length;

                      return (
                        <>
                          {shownIds.map((id) => {
                            const location = findLocTitleByIdWithDistrict(
                              id,
                              locations
                            );
                            return (
                              <React.Fragment key={`loc-${id}`}>
                                <div
                                  className={clsx(
                                    locationsStyles.location_itemSideBar,
                                    location?.lineNumber
                                      ? locationsStyles[
                                          `location_itemSideBar_${location.lineNumber}`
                                        ]
                                      : locationsStyles.location_itemSideBar_none
                                  )}
                                >
                                  <div
                                    className={locationsStyles.crcl_mtr_wrap}
                                  >
                                    <div
                                      className={
                                        locationsStyles.crcl_mtr_container
                                      }
                                    >
                                      <div
                                        className={clsx(
                                          locationsStyles.crcl_mtr,
                                          location?.lineNumber
                                            ? locationsStyles[
                                                `crcl_mtr_msk_${location.lineNumber}`
                                              ]
                                            : locationsStyles.crcl_mtr_noneSB
                                        )}
                                      />
                                    </div>
                                  </div>
                                  <span
                                    className={locationsStyles.location_title}
                                  >
                                    {location?.title || `ID:${id}`}
                                  </span>
                                </div>
                              </React.Fragment>
                            );
                          })}

                          {remainingCount > 0 && (
                            <span className={styles.remainingText}>
                              {getLocationSelectionText(remainingCount, 0)}
                            </span>
                          )}
                        </>
                      );
                    })()}
                    <span className={styles.textDecorationUndrl}>
                      Настроить локации
                    </span>
                  </div>
                ) : (
                  <>
                    Не выбрано ни одной локации
                    <p className={styles.textDecorationUndrl}>
                      Настроить локации
                    </p>
                  </>
                )}
              </div>
            </Link>
          )}

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
    </>
  );
};

export default SideBar;
