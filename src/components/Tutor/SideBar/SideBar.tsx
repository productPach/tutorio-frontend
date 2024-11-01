"use client";
import Image from "next/image";
import styles from "../../../app/tutor/layout.module.css";
import inputStyles from "../../../app/tutor/input.module.css";
import clsx from "clsx";
import React, { useState } from "react";
import { setOrderFilters } from "@/store/features/orderSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";

const SideBar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedPlaceFilters, setSelectedPlaceFilters] = useState<string[]>(
    []
  );
  const [selectedGoalFilters, setSelectedGoalFilters] = useState<string[]>([]);

  const handleFilterChange = (filter: string, type: "place" | "goal") => {
    if (type === "place") {
      const updatedPlaceFilters = selectedPlaceFilters.includes(filter)
        ? selectedPlaceFilters.filter((f) => f !== filter) // Убираем фильтр
        : [...selectedPlaceFilters, filter]; // Добавляем фильтр
      setSelectedPlaceFilters(updatedPlaceFilters);
      dispatch(
        setOrderFilters({
          placeFilters: updatedPlaceFilters,
          goalFilters: selectedGoalFilters,
        })
      );
    } else if (type === "goal") {
      const updatedGoalFilters = selectedGoalFilters.includes(filter)
        ? selectedGoalFilters.filter((f) => f !== filter) // Убираем фильтр
        : [...selectedGoalFilters, filter]; // Добавляем фильтр
      setSelectedGoalFilters(updatedGoalFilters);
      dispatch(
        setOrderFilters({
          placeFilters: selectedPlaceFilters,
          goalFilters: updatedGoalFilters,
        })
      );
    }
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
          <div className={clsx(styles.header_geo, styles.sidebar_geo)}>
            <Image
              src="../img/icon/location.svg"
              alt="Геолокация"
              width={15}
              height={18}
              className={styles.header_geoImage}
            />
            Москва
          </div>
        </div>

        <div>
          <p className={styles.sidebar_title}>Цель занятий</p>
          <input
            type="checkbox"
            className={inputStyles.checkbox_input}
            id="checkbox-4"
            checked={selectedGoalFilters.includes(
              "Всероссийская проверочная работа (ВПР)"
            )}
            onChange={() =>
              handleFilterChange(
                "Всероссийская проверочная работа (ВПР)",
                "goal"
              )
            }
          />
          <label className={inputStyles.checkbox_label} htmlFor="checkbox-4">
            <span className={inputStyles.checkbox}></span>
            <p className={inputStyles.checkbox_label_text}>
              Всероссийская проверочная работа (ВПР)
            </p>
          </label>

          <input
            type="checkbox"
            className={inputStyles.checkbox_input}
            id="checkbox-5"
            checked={selectedGoalFilters.includes(
              "Подготовка к экзамену в вузе"
            )}
            onChange={() =>
              handleFilterChange("Подготовка к экзамену в вузе", "goal")
            }
          />
          <label className={inputStyles.checkbox_label} htmlFor="checkbox-5">
            <span className={inputStyles.checkbox}></span>
            <p className={inputStyles.checkbox_label_text}>
              Подготовка к экзамену в вузе
            </p>
          </label>

          <input
            type="checkbox"
            className={inputStyles.checkbox_input}
            id="checkbox-6"
            checked={selectedGoalFilters.includes("Подготовка к ЕГЭ")}
            onChange={() => handleFilterChange("Подготовка к ЕГЭ", "goal")}
          />
          <label className={inputStyles.checkbox_label} htmlFor="checkbox-6">
            <span className={inputStyles.checkbox}></span>
            <p className={inputStyles.checkbox_label_text}>Подготовка к ЕГЭ</p>
          </label>

          <input
            type="checkbox"
            className={inputStyles.checkbox_input}
            id="checkbox-7"
            checked={selectedGoalFilters.includes("Подготовка к школе")}
            onChange={() => handleFilterChange("Подготовка к школе", "goal")}
          />
          <label className={inputStyles.checkbox_label} htmlFor="checkbox-7">
            <span className={inputStyles.checkbox}></span>
            <p className={inputStyles.checkbox_label_text}>
              Подготовка к школе
            </p>
          </label>

          <input
            type="checkbox"
            className={inputStyles.checkbox_input}
            id="checkbox-8"
            checked={selectedGoalFilters.includes("Повышение успеваемости")}
            onChange={() =>
              handleFilterChange("Повышение успеваемости", "goal")
            }
          />
          <label className={inputStyles.checkbox_label} htmlFor="checkbox-8">
            <span className={inputStyles.checkbox}></span>
            <p className={inputStyles.checkbox_label_text}>
              Повышение успеваемости
            </p>
          </label>

          <input
            type="checkbox"
            className={inputStyles.checkbox_input}
            id="checkbox-9"
            checked={selectedGoalFilters.includes("Подготовка к ОГЭ")}
            onChange={() => handleFilterChange("Подготовка к ОГЭ", "goal")}
          />
          <label className={inputStyles.checkbox_label} htmlFor="checkbox-9">
            <span className={inputStyles.checkbox}></span>
            <p className={inputStyles.checkbox_label_text}>Подготовка к ОГЭ</p>
          </label>

          <input
            type="checkbox"
            className={inputStyles.checkbox_input}
            id="checkbox-10"
            checked={selectedGoalFilters.includes("Для себя")}
            onChange={() => handleFilterChange("Для себя", "goal")}
          />
          <label className={inputStyles.checkbox_label} htmlFor="checkbox-10">
            <span className={inputStyles.checkbox}></span>
            <p className={inputStyles.checkbox_label_text}>Для себя</p>
          </label>

          <input
            type="checkbox"
            className={inputStyles.checkbox_input}
            id="checkbox-11"
            checked={selectedGoalFilters.includes("Для работы")}
            onChange={() => handleFilterChange("Для работы", "goal")}
          />
          <label className={inputStyles.checkbox_label} htmlFor="checkbox-11">
            <span className={inputStyles.checkbox}></span>
            <p className={inputStyles.checkbox_label_text}>Для работы</p>
          </label>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
