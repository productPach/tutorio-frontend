"use client";
import styles from "../SelectCity/SelectCityModal.module.css";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  setIsSheetSelectCity,
  setModalSelectCity,
  setScrollY,
} from "@/store/features/modalSlice";
import { setSelectedValues } from "@/store/features/matchSlice";
import { UserRegion } from "@/types/types";
import { setRegionUser } from "@/store/features/authSlice";

import {
  setSelectedValuesArea,
  setSelectedValuesCity,
  updateTutor,
} from "@/store/features/tutorSlice";
import { fetchDetectUserRegion } from "@/api/server/locationApi";
import { useRouter } from "next/navigation";

export const SelectCity = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [inputSearch, setInputSearch] = useState("");
  const regionUser: UserRegion | null = useAppSelector(
    (state) => state.auth.regionUser
  );

  // Получаем дату городов из Redux
  const locations = useAppSelector((state) => state.locations.city);
  const token = useAppSelector((state) => state.auth.token);
  const tutor = useAppSelector((state) => state.tutor.tutor);

  const handleSearch = (value: string) => {
    setInputSearch(value);
  };

  const handleSelectCity = async (
    cityId: number,
    city: string,
    area: string
  ) => {
    try {
      dispatch(setScrollY(0));

      // ✅ 1. Устанавливаем регион через API + устанавливаем куку
      const regionData = await fetchDetectUserRegion({
        region_id: cityId,
        set_cookie: true,
      });

      if (!regionData) {
        throw new Error("Не удалось установить регион");
      }

      // ✅ 2. Сохраняем в localStorage и Redux
      const userRegion = { city, area };
      localStorage.setItem("region-user", JSON.stringify(userRegion));
      dispatch(setRegionUser(userRegion));

      // ✅ 3. Закрываем модалку и сбрасываем фильтры
      dispatch(setModalSelectCity(false));
      dispatch(setIsSheetSelectCity(false));
      dispatch(setSelectedValues([]));
      dispatch(setSelectedValuesCity([]));
      dispatch(setSelectedValuesArea([]));

      // ✅ 4. Обновляем регион репетитора (если авторизован) ДОБАВИТЬ СТУДЕНТА!!
      if (tutor) {
        const id = tutor.id;
        const region = city;
        dispatch(updateTutor({ id, region })).unwrap;
      }

      // ✅ 5. Удаляем данные о городе из Local Storage, если выбран другой регион
      const storedData = JSON.parse(
        localStorage.getItem("current-user") || "[]"
      );
      if (Array.isArray(storedData)) {
        const updatedData = storedData.map((obj) => {
          if (obj.locationsTripCity) {
            obj.locationsTripCity = []; // Очищаем поле с городом
          }
          return obj;
        });
        localStorage.setItem("current-user", JSON.stringify(updatedData));
      }

      // ✅ 6. ДЕЛАЕМ РЕДИРЕКТ ЧЕРЕЗ NEXT.JS ROUTER
      const targetPath =
        regionData.slug === "msk" ? "/" : `/${regionData.slug}`;

      console.log(`🔄 Редирект на: ${targetPath}`);
      router.push(targetPath);
    } catch (error) {
      console.error("Ошибка при смене региона:", error);

      // ✅ Фолбэк: сохраняем в localStorage даже если API недоступно
      const userRegion = { city, area };
      localStorage.setItem("region-user", JSON.stringify(userRegion));
      dispatch(setRegionUser(userRegion));
      dispatch(setModalSelectCity(false));

      // Показываем сообщение об ошибке
      alert("Не удалось сменить регион. Попробуйте еще раз.");
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
              onClick={() =>
                handleSelectCity(Number(item.id), item.title, item.area)
              }
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
