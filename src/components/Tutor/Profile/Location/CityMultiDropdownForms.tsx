"use client";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import styles from "../../../Match/Match.module.css";
import animation from "../../../../app/match/layout.module.css";
import clsx from "clsx";
import { getLocation } from "@/api/addresses/addresses";
import { District, Metro, Order } from "@/types/types";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setSelectedValuesCity } from "@/store/features/tutorSlice";
import { setRegionUser } from "@/store/features/authSlice";

interface ComponentRenderProps {
  id: number;
  question: string;
  typeForm: string;
  setSuccessUpdateTutor: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CityMultiDropdownForms: React.FC<ComponentRenderProps> = ({
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
  // Получаем значение selectedValuesCity из Redux
  const selectedValuesCity = useAppSelector(
    (state) => state.tutor.selectedValuesCity
  );
  // Получаем дату городов из Redux
  const locations = useAppSelector((state) => state.locations.city);

  // Создаем флаг для отслеживания первоначальной загрузки
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [inputValueCity, setInputValueCity] = useState("");
  const [adressListCity, setAdressListCity] = useState<(District | Metro)[]>(
    []
  );
  const [errorInput, setErrorInput] = useState(false);
  const [errorInputText, setErrorInputText] = useState("");
  const [isInput, setIsInput] = useState(false);
  const [resultAdressIndexCity, setResultAdressIndexCity] = useState(0);
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
    // Обновляем адресный список при изменении inputValue или selectedValuesCity
    const updateAddressListCity = async () => {
      if (regionUser) {
        const data = await getLocation(
          inputValueCity,
          regionUser.city,
          selectedValuesCity,
          locations
        );

        // Объединяем результаты и фильтруем выбранные значения
        const combinedResultsCity = [...data.districts, ...data.metros].filter(
          (location) =>
            !selectedValuesCity.some((selected) => selected.id === location.id)
        );

        setAdressListCity(combinedResultsCity); // Устанавливаем обновленный список адресов
      }
    };

    updateAddressListCity();
  }, [inputValueCity, selectedValuesCity, regionUser]);

  // Обновляем adressListCity в handleInputValue
  const handleInputValue = async (e: ChangeEvent<HTMLInputElement>) => {
    setSuccessUpdateTutor(false);
    setInputValueCity(e.target.value);
    setIsInput(true);
    // Обновление будет происходить автоматически благодаря useEffect
  };

  useEffect(() => {
    // Сбрасываем индекс при обновлении adressList
    setResultAdressIndexCity(0);
  }, [adressListCity]);

  // Удаление локации
  const handleRemoveItem = (index: number) => {
    setSuccessUpdateTutor(false);
    const updatedValues = selectedValuesCity.filter((_, i) => i !== index);
    dispatch(setSelectedValuesCity(updatedValues)); // Передаём обновлённый массив
  };

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      setResultAdressIndexCity((prevIndex) => {
        const nextIndex = (prevIndex + 1) % adressListCity.length;
        itemRefs.current[nextIndex]?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
        return nextIndex;
      });
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setResultAdressIndexCity((prevIndex) => {
        const nextIndex =
          (prevIndex - 1 + adressListCity.length) % adressListCity.length;
        itemRefs.current[nextIndex]?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
        return nextIndex;
      });
    }

    if (e.key === "Enter" && adressListCity.length > 0) {
      setSuccessUpdateTutor(false);
      const selectedAdress = adressListCity[resultAdressIndexCity];
      const updatedValues = [...selectedValuesCity, selectedAdress]; // Добавляем новый элемент к текущему состоянию
      dispatch(setSelectedValuesCity(updatedValues)); // Передаём обновлённый массив в Redux
      setInputValueCity(""); // Очищаем поле ввода
      setIsInput(false); // Закрываем выпадающий список
    }
  };

  useEffect(() => {
    const input = document.getElementById("citiesDistrictMetro");
    input?.addEventListener("keydown", handleKeyDown);

    return () => {
      input?.removeEventListener("keydown", handleKeyDown);
    };
  }, [adressListCity, resultAdressIndexCity]);

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
              "Укажите районы и станции метро города, до которых вам удобно добираться на занятия с учеником"
            }
          </div>

          <input
            id="citiesDistrictMetro"
            type="text"
            placeholder={"Начните вводить название района или метро"}
            autoComplete="off"
            value={inputValueCity}
            onChange={handleInputValue}
            className={clsx(styles.inputUniversityName, {
              [styles.errorInput]: errorInput,
            })}
            maxLength={250}
          />
          {errorInputText && (
            <div className={styles.errorInputText}>{errorInputText}</div>
          )}

          {adressListCity.length > 0 &&
            inputValueCity.length > 1 &&
            isInput && (
              <div className={styles.resultContainerTutorSearch}>
                <ul>
                  {adressListCity.map((item, index) => (
                    <li
                      key={item.id}
                      onClick={() => {
                        // Обновляем состояние, добавляя новый элемент
                        const updatedValues = [...selectedValuesCity, item];
                        // Передаем обновленный массив в Redux
                        dispatch(setSelectedValuesCity(updatedValues));
                        setInputValueCity(""); // Очищаем поле после выбора
                        setIsInput(false); // Закрываем выпадающий список
                      }}
                      className={`${styles.resultTutorSearch} ${
                        index === resultAdressIndexCity ? styles.highlight : ""
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
            {selectedValuesCity.map((item, index) => (
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
