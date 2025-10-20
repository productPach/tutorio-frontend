"use client";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import styles from "../../../Match/Match.module.css";
import locationsStyles from "../../../../app/tutor/locations.module.css";
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
}

export const LocationCityMultiDropdownForms: React.FC<ComponentRenderProps> = ({
  id,
  question,
  typeForm,
}) => {
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

  const getDataMatchLS = localStorage.getItem("current-user");
  const dataMatch: Partial<Order>[] = getDataMatchLS
    ? JSON.parse(getDataMatchLS)
    : [];

  useEffect(() => {
    const regionUserJson = localStorage.getItem("region-user");
    const regionUser = regionUserJson ? JSON.parse(regionUserJson) : "";

    if (regionUser) {
      dispatch(setRegionUser(regionUser));
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
    const updatedValues = selectedValuesCity.filter((_, i) => i !== index);
    dispatch(setSelectedValuesCity(updatedValues)); // Передаём обновлённый массив
  };

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // При перезагрузке страницы высстанавилваемданные из LS
  useEffect(() => {
    const currentDataMatch = dataMatch.find((obj) => Number(obj.id) === id);
    const valueProperty = currentDataMatch
      ? currentDataMatch.locationsTripCity
      : "";
    valueProperty && dispatch(setSelectedValuesCity(valueProperty));
  }, [typeForm]);

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

  // Каждый раз, когда обновляется состояние selectedValuesCity редактируем массив в LS
  useEffect(() => {
    if (isInitialLoad) {
      setIsInitialLoad(false);
      return;
    }

    const existingData: Partial<Order> = dataMatch.find(
      (item) => Number(item.id) === id
    ) || {
      id: String(id),
      locationsTripArea: [],
      locationsTripCity: [],
      locations: [],
      tutorHomeAdress: {},
    };

    // Обновляем locationsTripCity
    existingData.locationsTripCity = selectedValuesCity.map((item) => ({
      id: item.id,
      title: item.title,
      lineNumber: item.lineNumber,
    }));

    // Удаляем старую запись с тем же id и добавляем обновленную запись
    const updatedDataMatch: Partial<Order>[] = dataMatch
      .filter((item) => Number(item.id) !== id)
      .concat(existingData);
    localStorage.setItem("current-user", JSON.stringify(updatedDataMatch));
  }, [dataMatch, isInitialLoad, id, selectedValuesCity]);

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
                      <div className={styles.selectedItemText2}>
                        <div className={styles.itemTitle}>
                          {/* Кружок с цветом линии метро */}
                          <div className={locationsStyles.crcl_mtr_wrap}>
                            <div className={locationsStyles.crcl_mtr_container}>
                              <div
                                className={clsx(
                                  locationsStyles.crcl_mtr,
                                  item?.lineNumber
                                    ? locationsStyles[
                                        `crcl_mtr_msk_${item.lineNumber}`
                                      ]
                                    : locationsStyles.crcl_mtr_noneSB
                                )}
                              />
                            </div>
                          </div>
                          {/* Кружок с цветом линии метро */}

                          {item.title}
                        </div>
                        {item.displayType && (
                          <div
                            className={clsx(
                              styles.selectedItemTextType,
                              styles.selectedItemTextTypeTop
                            )}
                          >
                            {item.displayType}
                          </div>
                        )}
                      </div>{" "}
                      {/* Отображаем title для районов и метро */}
                    </li>
                  ))}
                </ul>
              </div>
            )}

          <div className={styles.selectedValues}>
            {selectedValuesCity.map((item, index) => (
              <div key={index} className={styles.selectedItemLkT}>
                <div className={styles.selectedItemText}>
                  <div className={styles.itemTitle}>
                    {/* Кружок с цветом линии метро */}
                    <div className={locationsStyles.crcl_mtr_wrap}>
                      <div className={locationsStyles.crcl_mtr_container}>
                        <div
                          className={clsx(
                            locationsStyles.crcl_mtr,
                            item?.lineNumber
                              ? locationsStyles[
                                  `crcl_mtr_msk_${item.lineNumber}`
                                ]
                              : locationsStyles.crcl_mtr_noneSB
                          )}
                        />
                      </div>
                    </div>
                    {/* Кружок с цветом линии метро */}

                    {item.title}
                  </div>
                  {item.displayType && (
                    <div className={styles.selectedItemTextType}>
                      {item.displayType}
                    </div>
                  )}
                </div>
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
