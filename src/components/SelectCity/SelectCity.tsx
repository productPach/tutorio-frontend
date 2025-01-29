"use client";
import styles from "../SelectCity/SelectCityModal.module.css";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setModalSelectCity, setScrollY } from "@/store/features/modalSlice";
import { setSelectedValues } from "@/store/features/matchSlice";
import { UserRegion } from "@/types/types";
import { setRegionUser } from "@/store/features/authSlice";

import {
  setSelectedValuesArea,
  setSelectedValuesCity,
} from "@/store/features/tutorSlice";

export const SelectCity = () => {
  const dispatch = useAppDispatch();
  const [inputSearch, setInputSearch] = useState("");
  const regionUser: UserRegion | null = useAppSelector(
    (state) => state.auth.regionUser
  );

  // Получаем дату городов из Redux
  const locations = useAppSelector((state) => state.locations.city);

  const handleSearch = (value: string) => {
    setInputSearch(value);
  };

  const handleSelectCity = (city: string, area: string) => {
    dispatch(setScrollY(0));
    localStorage.setItem("region-user", JSON.stringify({ city, area }));
    dispatch(setModalSelectCity(false));
    dispatch(setRegionUser({ city, area }));
    dispatch(setSelectedValues([]));
    dispatch(setSelectedValuesCity([]));
    dispatch(setSelectedValuesArea([]));

    // Удаляем данные о городе из Local Storage, если выбран другой регион
    const storedData = JSON.parse(localStorage.getItem("current-user") || "[]");
    if (Array.isArray(storedData)) {
      const updatedData = storedData.map((obj) => {
        if (obj.locationsTripCity) {
          obj.locationsTripCity = []; // Очищаем поле с городом
        }
        return obj;
      });
      localStorage.setItem("current-user", JSON.stringify(updatedData));
    }
  };

  const locationList =
    inputSearch.length > 1
      ? locations.filter(
          (item) =>
            item.title.toLowerCase().includes(inputSearch.toLowerCase()) ||
            item.area.toLowerCase().includes(inputSearch.toLowerCase())
        )
      : locations;

  return (
    <>
      <div className={styles.firstSection__tutorSearch2}>
        <div className={styles.searchContainer}>
          <input
            id="subjectInput"
            type="text"
            placeholder="Введите название города или региона"
            autoComplete="off"
            value={inputSearch}
            onChange={(e) => handleSearch(e.target.value)}
            //   className={errorSubject ? styles.errorInput : undefined}
          />
        </div>
      </div>

      <div className={styles.wrapCity}>
        {locationList.map((item) => (
          <React.Fragment key={item.id}>
            <div
              onClick={() => handleSelectCity(item.title, item.area)}
              className={styles.answer}
            >
              <input
                checked={item.title === regionUser?.city && true}
                readOnly
                type="radio"
                className={styles.radioInput}
                id={`radiocity-${item.id}`}
                name={"city"}
              />
              <label
                className={styles.radioLabel}
                htmlFor={`radiocity-${item.id}`}
              >
                <span className={styles.radio}></span>
                <p className={styles.answerTitle}>
                  {item.title}
                  <span className={styles.areaCity}> и {item.area}</span>
                </p>
              </label>
            </div>
          </React.Fragment>
        ))}
      </div>
    </>
  );
};
