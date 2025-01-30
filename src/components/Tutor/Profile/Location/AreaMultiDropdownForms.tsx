"use client";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import styles from "../../../Match/Match.module.css";
import animation from "../../../../app/match/layout.module.css";
import clsx from "clsx";
import { getLocation } from "@/api/addresses/addresses";
import { Order, RegionalCity } from "@/types/types";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setRegionUser } from "@/store/features/authSlice";
import { setSelectedValuesArea } from "@/store/features/tutorSlice";

interface ComponentRenderProps {
  id: number;
  question: string;
  typeForm: string;
  setSuccessUpdateTutor: React.Dispatch<React.SetStateAction<boolean>>;
}

type DataAdress = {
  value: string;
  data: {
    fias_id: number;
    fias_level: string;
    city?: string;
    metro?: string;
    district?: string;
  };
};

export const AreaMultiDropdownForms: React.FC<ComponentRenderProps> = ({
  id,
  question,
  typeForm,
  setSuccessUpdateTutor,
}) => {
  // Получаем значение tutor из Redux
  const tutor = useAppSelector((state) => state.tutor.tutor);
  const dispatch = useAppDispatch();
  // Получаем значение regionUser из Redux
  const regionUser = useAppSelector((state) => state.auth.regionUser);
  // Получаем значение selectedValues из Redux
  const selectedValues = useAppSelector(
    (state) => state.tutor.selectedValuesArea
  );

  // Получаем дату городов из Redux
  const locations = useAppSelector((state) => state.locations.city);

  const [inputValue, setInputValue] = useState("");
  const [adressList, setAdressList] = useState<RegionalCity[]>([]);
  const [errorInput, setErrorInput] = useState(false);
  const [errorInputText, setErrorInputText] = useState("");
  const [isInput, setIsInput] = useState(false);
  const [resultAdressIndex, setResultAdressIndex] = useState(0);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const regionUserJson = localStorage.getItem("region-user");
    const regionUser = regionUserJson ? JSON.parse(regionUserJson) : "";

    if (regionUser) {
      dispatch(setRegionUser(regionUser));
    } else {
      const userRegionObj = locations.find(
        (item) => item.title === tutor?.region
      );
      if (userRegionObj) {
        // Обновляем регион в объекте юзера
        const userRegion = {
          city: userRegionObj.title,
          area: userRegionObj.area,
        };
        dispatch(setRegionUser(userRegion));
        localStorage.setItem("region-user", JSON.stringify(userRegion));
      }
    }
  }, [dispatch]);

  // Добавление локации
  useEffect(() => {
    // Обновляем адресный список при изменении inputValue или selectedValues
    const updateAddressList = async () => {
      if (regionUser) {
        const data = await getLocation(
          inputValue,
          regionUser.city,
          selectedValues,
          locations
        );

        // Объединяем результаты и фильтруем выбранные значения
        const combinedResults = [...data.regionalCities].filter(
          (location) =>
            !selectedValues.some((selected) => selected.id === location.id)
        );

        setAdressList(combinedResults); // Устанавливаем обновленный список адресов
      }
    };

    updateAddressList();
  }, [inputValue, selectedValues, regionUser]);

  // Обновляем adressList в handleInputValue
  const handleInputValue = async (e: ChangeEvent<HTMLInputElement>) => {
    setSuccessUpdateTutor(false);
    setInputValue(e.target.value);
    setIsInput(true);
    // Обновление будет происходить автоматически благодаря useEffect
  };

  useEffect(() => {
    // Сбрасываем индекс при обновлении adressList
    setResultAdressIndex(0);
  }, [adressList]);

  // Удаление локации
  const handleRemoveItem = (index: number) => {
    setSuccessUpdateTutor(false);
    const updatedValues = selectedValues.filter((_, i) => i !== index);
    dispatch(setSelectedValuesArea(updatedValues)); // Передаём обновлённый массив
  };

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      setResultAdressIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % adressList.length;
        itemRefs.current[nextIndex]?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
        return nextIndex;
      });
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setResultAdressIndex((prevIndex) => {
        const nextIndex =
          (prevIndex - 1 + adressList.length) % adressList.length;
        itemRefs.current[nextIndex]?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
        return nextIndex;
      });
    }

    if (e.key === "Enter" && adressList.length > 0) {
      setSuccessUpdateTutor(false);
      const selectedAdress = adressList[resultAdressIndex];
      const updatedValues = [...selectedValues, selectedAdress]; // Добавляем новый элемент к текущему состоянию
      dispatch(setSelectedValuesArea(updatedValues)); // Передаём обновлённый массив в Redux
      setInputValue(""); // Очищаем поле ввода
      setIsInput(false); // Закрываем выпадающий список
    }
  };

  useEffect(() => {
    const input = document.getElementById("regionalCities");
    input?.addEventListener("keydown", handleKeyDown);

    return () => {
      input?.removeEventListener("keydown", handleKeyDown);
    };
  }, [adressList, resultAdressIndex]);

  return (
    <>
      <div
        className={`${styles.container} ${
          isVisible ? animation.visible : animation.hidden
        }`}
      >
        <div className={styles.wrapAdress}>
          <div className={styles.description}>
            {
              "Укажите областные города и посёлки, до которых вам удобно добираться на занятия с учеником"
            }
          </div>

          <input
            id="regionalCities"
            type="text"
            placeholder={
              "Начните вводить название областного города или посёлка"
            }
            autoComplete="off"
            value={inputValue}
            onChange={handleInputValue}
            className={clsx(styles.inputUniversityName, {
              [styles.errorInput]: errorInput,
            })}
            maxLength={250}
          />
          {errorInputText && (
            <div className={styles.errorInputText}>{errorInputText}</div>
          )}

          {adressList.length > 0 && inputValue.length > 1 && isInput && (
            <div className={styles.resultContainerTutorSearch}>
              <ul>
                {adressList.map((item, index) => (
                  <li
                    key={item.id}
                    onClick={() => {
                      // Обновляем состояние, добавляя новый элемент
                      const updatedValues = [...selectedValues, item];
                      // Передаем обновленный массив в Redux
                      dispatch(setSelectedValuesArea(updatedValues));
                      setInputValue(""); // Очищаем поле после выбора
                      setIsInput(false); // Закрываем выпадающий список
                    }}
                    className={`${styles.resultTutorSearch} ${
                      index === resultAdressIndex ? styles.highlight : ""
                    }`}
                    ref={(el) => {
                      itemRefs.current[index] = el;
                    }}
                  >
                    {item.title} {/* Отображаем title для районов и метро */}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className={styles.selectedValues}>
            {selectedValues.map((item, index) => (
              <div key={index} className={styles.selectedItem}>
                {item.title} {/* Отображаем title выбранных элементов */}
                <button
                  className={styles.removeButton}
                  onClick={() => handleRemoveItem(index)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
