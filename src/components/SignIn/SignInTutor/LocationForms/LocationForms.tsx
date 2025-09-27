"use client";
import React, { useEffect, useState } from "react";
import styles from "../SignInTutor.module.css";
import animation from "../../../../app/sign-in-tutor/layout.module.css";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AdressInputForms } from "./AdressInputForms";
import { useAppDispatch, useAppSelector } from "@/store/store";

import { setModalSelectCity } from "@/store/features/modalSlice";
import { getLocationForCity } from "@/api/addresses/addresses";
import { LocationAreaMultiDropdownForms } from "./LocationAreaMultiDropdownForms";
import { LocationCityMultiDropdownForms } from "./LocationCityMultiDropdownForms";
import { District, Metro } from "@/types/types";
import {
  setSelectedValuesCity,
  updateTutor,
} from "@/store/features/tutorSlice";
import { getAllLocations } from "@/store/features/locationSlice";
import clsx from "clsx";

interface ComponentRenderProps {
  id: number;
  typeForm: string;
  question: string;
  description: string;
  placeholder: string;
  nextPage: string;
}

type Order = {
  id: number;
  subject?: string;
  goal?: string;
  class?: string;
  deadline?: string;
  tutorHomeAdress?: {
    adress: string;
    dataAdress: string;
  };
  [key: string]: any;
};

type LocationData = {
  locations: string[];
  locationsTrip: string[];
  locationsTripArea: { id: string; title: string }[];
  locationsTripCity: { id: string; title: string }[];
  locationsTripCityData: string;
};

export const LocationForms: React.FC<ComponentRenderProps> = ({
  id,
  typeForm,
  question,
  description,
  placeholder,
  nextPage,
}) => {
  const route = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getAllLocations());
  }, [dispatch]);
  // Получаем дату городов из Redux
  const locations = useAppSelector((state) => state.locations.city);
  // Получаем значение tutor из Redux
  const token = useAppSelector((state) => state.auth.token);
  const tutor = useAppSelector((state) => state.tutor.tutor);
  const cookiesAccepted = useAppSelector((state) => state.general.cookies);
  const status = "Rega: Email";
  const regionUser = useAppSelector((state) => state.auth.regionUser);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const getDataMatchLS = localStorage.getItem("current-user");
  const dataMatch: Order[] = getDataMatchLS ? JSON.parse(getDataMatchLS) : [];
  const containsClassProperty = dataMatch.find((obj) =>
    obj.hasOwnProperty(typeForm)
  );

  let initialCheckboxValue: string[] = containsClassProperty?.[typeForm] || [];
  let initialCheckboxTripValue: string[] =
    containsClassProperty?.locationsTrip || [];

  // Выбранные основные чекбоксы (tutorPlace)
  const [checkbox, setCheckbox] = useState<string[]>(initialCheckboxValue);
  const [checkboxTrip, setCheckboxTrip] = useState<string[]>(
    initialCheckboxTripValue
  );
  const [formState, setFormState] = useState<Order | null>(
    containsClassProperty || null
  );

  // Состояние для отслеживания выбранной радиокнопки
  const [selectedRadio, setSelectedRadio] = useState<string | null>(null);
  // Получаем значение selectedValuesCity из Redux
  const selectedValuesCity: (District | Metro)[] = useAppSelector(
    (state) => state.tutor.selectedValuesCity
  );
  //console.log(selectedValuesCity);

  // Получаем значение selectedValuesArea из Redux
  const selectedValuesArea = useAppSelector(
    (state) => state.tutor.selectedValuesArea
  );

  const region = regionUser?.city;
  const tutorPlace = checkbox;
  const tutorAdress = formState?.tutorHomeAdress?.adress;
  // Вытаскиваем из объектов только id, чтобы записать в БД + объединяем их в один массив (tutorTrip)
  // ОТКАЩАЛИСЬ ОТ ДАННОГО РЕШЕНИЯ 25.01.2025, ТАК КАК РЕШИЛИ ЛОКАЦИИ ГОРОДА И ОБЛАСТИ
  // ХРАНИТЬ В РАЗНЫХ СУЩНОСТЯХ - tutorTripCity И tutorTripArea СООТВЕТСТВЕННО.
  // В tutorTrip ТЕПЕРЬ ХРАНИТСЯ ВЫБОР РЕПЕТИТОРА КУДА ОН ВЫЕЗЖАЕТ - ГОРОД И/ИЛИ ОБЛАСТЬ: string["1", "2"]
  // const tutorTrip = [
  //   ...selectedValuesCity.map((item) => item.id),
  //   ...selectedValuesArea.map((item) => item.id),
  // ];
  const tutorTrip = checkboxTrip;
  const tutorTripCityData = selectedRadio ?? undefined;
  const tutorTripCity = [...selectedValuesCity.map((item) => item.id)];
  const tutorTripArea = [...selectedValuesArea.map((item) => item.id)];

  // Обновление данных репетитора
  const updateDataTutor = () => {
    const id = tutor?.id;
    if (id) {
      dispatch(
        updateTutor({
          id,
          status,
          region,
          tutorPlace,
          tutorAdress,
          tutorTrip,
          tutorTripCityData,
          tutorTripCity,
          tutorTripArea,
          // tutorTripCity: tutorTripCity.join(", "),
          // tutorTripArea: tutorTripArea.join(", "),
        })
      ).unwrap;
      handleNextStep();
    } else {
      console.log("Нет токена");
    }
  };

  const handleCheckboxClick = (title: string) => {
    setCheckbox((prev) => {
      const updatedCheckboxes = prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title];

      setFormState((prevState) => {
        if (!prevState) return prevState;

        return {
          ...prevState,
          [typeForm]: updatedCheckboxes,
        };
      });

      // Обновляем Local Storage с новыми значениями locations
      const indexOfArray = dataMatch.findIndex((obj) => obj.id === id);
      const updatedDataMatch = [...dataMatch];

      if (indexOfArray !== -1) {
        // Обновляем существующий объект в массиве
        updatedDataMatch[indexOfArray] = {
          ...updatedDataMatch[indexOfArray],
          [typeForm]: updatedCheckboxes,
        };
      } else {
        // Если объект не существует, добавляем новый
        updatedDataMatch.push({
          id: id,
          [typeForm]: updatedCheckboxes,
          tutorHomeAdress: formState?.tutorHomeAdress,
          locationsTrip: formState?.locationsTrip || [], // Сохраняем текущие locationsTrip
          locationsTripArea: formState?.locationsTripArea || [], // Сохраняем текущие locationsTripArea
          locationsTripCity: formState?.locationsTripCity || [], // Сохраняем текущие locationsTripCity
          locationsTripCityData: formState?.locationsTripCityData || null, // Сохраняем текущие locationsTripCity
        });
      }

      localStorage.setItem("current-user", JSON.stringify(updatedDataMatch));

      return updatedCheckboxes;
    });
  };

  const handleCheckboxTripClick = (title: string) => {
    setCheckboxTrip((prev) => {
      const updatedCheckboxes = prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title];

      setFormState((prevState) => {
        if (!prevState) return prevState;

        return {
          ...prevState,
          locationsTrip: updatedCheckboxes,
        };
      });

      // Находим индекс существующего объекта в массиве
      const indexOfArray = dataMatch.findIndex((obj) => obj.id === id);
      const updatedDataMatch = [...dataMatch];

      if (indexOfArray !== -1) {
        // Обновляем существующий объект в массиве
        updatedDataMatch[indexOfArray] = {
          ...updatedDataMatch[indexOfArray],
          locationsTrip: updatedCheckboxes,
        };
      } else {
        // Если объект не существует, добавляем новый
        updatedDataMatch.push({
          id: id,
          locationsTrip: updatedCheckboxes,
          [typeForm]: formState?.[typeForm] || [],
          tutorHomeAdress: formState?.tutorHomeAdress,
          locationsTripArea: formState?.locationsTripArea || [], // Сохраняем текущие locationsTripArea
          locationsTripCity: formState?.locationsTripCity || [], // Сохраняем текущие locationsTripCity
          locationsTripCityData: formState?.locationsTripCityData || null, // Сохраняем текущие locationsTripCity
        });
      }

      // Сохраняем обновленные данные в Local Storage
      localStorage.setItem("current-user", JSON.stringify(updatedDataMatch));

      return updatedCheckboxes;
    });
  };

  // Обработчик для радио-кнопки
  // Функция для обработки клика по радиокнопке
  const handleRadioClick = async (numRadio: string) => {
    setSelectedRadio(numRadio); // Устанавливаем выбранную радиокнопку

    let locationsTripCity: (District | Metro)[] = [];

    if (numRadio === "1" && regionUser) {
      locationsTripCity = await getLocationForCity(regionUser.city, locations); // Получаем данные для города
    } else if (numRadio === "2") {
      locationsTripCity = []; // Очищаем данные
    }

    dispatch(setSelectedValuesCity(locationsTripCity));

    // Обновляем состояние формы
    setFormState((prevState) => {
      if (!prevState) return prevState;

      return {
        ...prevState,
        locationsTripCity, // Обновляем данные локаций
        locationsTripCityData: numRadio, // Сохраняем выбранную радиокнопку в Local Storage
      };
    });

    // Обновляем данные в локальном хранилище
    const indexOfArray = dataMatch.findIndex((obj) => obj.id === id);
    const updatedDataMatch = [...dataMatch];

    if (indexOfArray !== -1) {
      updatedDataMatch[indexOfArray] = {
        ...updatedDataMatch[indexOfArray],
        locationsTripCity,
        locationsTripCityData: numRadio,
      };
    } else {
      updatedDataMatch.push({
        id: id,
        locationsTripCity,
        locationsTripCityData: numRadio,
        [typeForm]: formState?.[typeForm] || [],
      });
    }

    // Сохраняем обновленные данные в Local Storage
    localStorage.setItem("current-user", JSON.stringify(updatedDataMatch));
  };

  // Восстанавливаем состояние радиокнопки при загрузке страницы
  useEffect(() => {
    // Ищем объект, содержащий свойство locationsTripCityData
    const selectedData = dataMatch.find((obj) =>
      obj.hasOwnProperty("locationsTripCityData")
    );

    if (selectedData?.locationsTripCityData) {
      setSelectedRadio(selectedData.locationsTripCityData);
    }
  }, []);

  useEffect(() => {
    if (isInitialLoad) {
      setIsInitialLoad(false);
      return;
    }

    // Создаем новую копию данных
    const updatedDataMatch = [...dataMatch];

    const newData = {
      id: id,
      [typeForm]: checkbox,
      tutorHomeAdress: formState?.tutorHomeAdress,
    };

    const indexOfArray = dataMatch.findIndex((obj) => obj.id === id);

    if (indexOfArray !== -1) {
      // Обновляем существующий объект в массиве
      updatedDataMatch[indexOfArray] = {
        ...updatedDataMatch[indexOfArray],
        [typeForm]: checkbox,
      };
    } else {
      // Если объект не существует, добавляем новый
      updatedDataMatch.push(newData);
    }

    // Сохраняем обновленные данные в Local Storage
    localStorage.setItem("current-user", JSON.stringify(updatedDataMatch));
  }, [checkbox, formState]);

  const handleNextStep = () => {
    setIsDisabled(true);
    setIsVisible(false);
    setTimeout(() => route.push(nextPage), 400);
  };

  const handlePrevStep = () => {
    setIsDisabled(true);
    setIsVisible(false);
    setTimeout(() => route.back(), 400);
  };

  const [isVisible, setIsVisible] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const currentDataMatch = dataMatch.find((obj) => obj.id === id);
  const valueProperty = currentDataMatch ? currentDataMatch[typeForm] : null;

  const [isValid, setIsValid] = useState(false);

  // Функция для валидации условий активации кнопки
  const isFormValid = () => {
    // Условие 1: Если выбран только чекбокс "Дистанционно"
    if (
      checkbox.includes("1") &&
      !checkbox.includes("2") &&
      !checkbox.includes("3")
    ) {
      return true;
    }

    // Условие 2: Если выбран чекбокс "Занимаюсь с учениками у себя", и адрес добавлен
    if (
      checkbox.includes("2") &&
      formState?.tutorHomeAdress?.adress &&
      !checkbox.includes("3")
    ) {
      return true;
    }

    // Условие 3: Если выбран чекбокс "Готов выезжать к ученикам"
    // и выбран чекбокс "checkboxTrip-1" и выбрана радиокнопка
    // if (
    //   checkbox.includes("3") &&
    //   checkboxTrip.includes("1") &&
    //   selectedRadio === "1" &&
    //   ((checkbox.includes("2") && formState?.tutorHomeAdress?.adress) ||
    //     !checkbox.includes("2"))
    // ) {
    //   return true;
    // }

    // Условие 4: Если выбран чекбокс "Готов выезжать к ученикам"
    // и выбран чекбокс "checkboxTrip-2" (без дополнительных условий)
    if (
      checkbox?.includes("3") &&
      checkboxTrip?.includes("1") &&
      ((selectedRadio === "2" && selectedValuesCity.length > 0) ||
        selectedRadio === "1") &&
      (!checkboxTrip?.includes("2") ||
        (checkboxTrip?.includes("2") && selectedValuesArea.length > 0)) &&
      (!checkbox?.includes("2") ||
        (checkbox.includes("2") && formState?.tutorHomeAdress?.adress))
    ) {
      return true;
    }

    // Условие 5: Если выбран чекбокс "Готов выезжать к ученикам", но не выбран ни один из чекбоксов поездки
    if (
      checkbox.includes("3") &&
      (!checkboxTrip?.includes("1") ||
        (checkboxTrip?.includes("1") &&
          ((selectedRadio === "2" && selectedValuesCity.length > 0) ||
            selectedRadio === "1"))) &&
      checkboxTrip.includes("2") &&
      selectedValuesArea.length > 0 &&
      (!checkbox?.includes("2") ||
        (checkbox.includes("2") && formState?.tutorHomeAdress?.adress))
    ) {
      return true;
    }

    // Если ни одно из условий не выполняется, форма не валидна
    return false;
  };

  return (
    <>
      <div
        className={`${styles.container} ${
          isVisible ? animation.visible : animation.hidden
        }`}
      >
        <div className={styles.wrap}>
          <div onClick={handlePrevStep} className={styles.wrapIcon}>
            <Image
              width={20}
              height={20}
              alt="Назад"
              src="/img/icon/CaretLeft.svg"
              className={styles.iconBack}
            />
            Назад
          </div>
          <div className={styles.title}>{question}</div>
          {/* <div className={styles.description}>Выберите один из нижеперечисленных вариантов</div> */}
          <div className={styles.containerAnswers}>
            <React.Fragment key={"1"}>
              <div className={styles.answerLocation}>
                <input
                  value={checkbox}
                  onChange={() => handleCheckboxClick("1")}
                  checked={checkbox.includes("1")}
                  type="checkbox"
                  className={styles.checkboxInput}
                  id={`checkbox-1`}
                  name="checkbox"
                />
                <label
                  className={styles.checkboxLabelLocation}
                  htmlFor={`checkbox-1`}
                >
                  <span className={styles.checkbox}></span>
                  <p className={styles.answerTitle}>Дистанционно</p>
                </label>
              </div>
            </React.Fragment>
            <React.Fragment key={"2"}>
              <div className={styles.answerLocation}>
                <input
                  value={checkbox}
                  onChange={() => handleCheckboxClick("2")}
                  checked={checkbox.includes("2")}
                  type="checkbox"
                  className={styles.checkboxInput}
                  id={`checkbox-2`}
                  name="checkbox"
                />
                <label
                  className={styles.checkboxLabelLocation}
                  htmlFor={`checkbox-2`}
                >
                  <span className={styles.checkbox}></span>
                  <p className={styles.answerTitle}>
                    Занимаюсь с учениками у себя
                  </p>
                </label>
              </div>
              {checkbox.includes("2") && (
                <AdressInputForms
                  id={id}
                  question={question}
                  typeForm={typeForm}
                  setFormState={setFormState}
                />
              )}
            </React.Fragment>
            <React.Fragment key={"3"}>
              <div className={styles.answerLocation}>
                <input
                  value={checkbox}
                  onChange={() => handleCheckboxClick("3")}
                  checked={checkbox.includes("3")}
                  type="checkbox"
                  className={styles.checkboxInput}
                  id={`checkbox-3`}
                  name="checkbox"
                />
                <label
                  className={styles.checkboxLabelLocation}
                  htmlFor={`checkbox-3`}
                >
                  <span className={styles.checkbox}></span>
                  <p className={styles.answerTitle}>
                    Готов выезжать к ученикам
                  </p>
                </label>
              </div>
              {checkbox.includes("3") && (
                <div className={styles.wrapAdress}>
                  <div className={styles.description}>
                    Укажите места, куда вы готовы выезжать на занятия с
                    учениками
                  </div>
                  <div className={styles.description}>
                    Регион:{" "}
                    <span
                      onClick={() => {
                        dispatch(setModalSelectCity(true));
                      }}
                      style={{ textDecoration: "underline", cursor: "pointer" }}
                    >
                      {regionUser && regionUser.city} и{" "}
                      {regionUser && regionUser.area}
                    </span>
                  </div>
                  <div className={styles.containerAnswers}>
                    <React.Fragment key={"10"}>
                      <div className={styles.answerLocation}>
                        <input
                          value={checkboxTrip}
                          onChange={() => handleCheckboxTripClick("1")}
                          checked={checkboxTrip.includes("1")}
                          type="checkbox"
                          className={styles.checkboxInput}
                          id={`checkboxTrip-1`}
                          name="checkboxTrip"
                        />
                        <label
                          className={styles.checkboxLabelLocation}
                          htmlFor={`checkboxTrip-1`}
                        >
                          <span className={styles.checkbox}></span>
                          <p className={styles.answerTitle}>
                            {regionUser?.city}
                          </p>
                        </label>
                      </div>
                      {checkboxTrip.includes("1") && (
                        <>
                          <div className={styles.wrapAdress}>
                            <div className={styles.containerAnswers}>
                              <React.Fragment key={"1"}>
                                <div className={styles.answerContainer}>
                                  <input
                                    checked={selectedRadio === "1"}
                                    readOnly
                                    type="radio"
                                    className={styles.radioInput}
                                    id={`radio-1`}
                                    name="goal"
                                    onChange={() => handleRadioClick("1")}
                                  />
                                  <label
                                    className={styles.radioLabel}
                                    htmlFor={`radio-1`}
                                  >
                                    <span className={styles.radio}></span>
                                    <p className={styles.answerTitle}>
                                      Выезжаю по всему городу
                                    </p>
                                  </label>
                                </div>
                              </React.Fragment>
                              <React.Fragment key={"2"}>
                                <div className={styles.answerContainer}>
                                  <input
                                    checked={selectedRadio === "2"}
                                    readOnly
                                    type="radio"
                                    className={styles.radioInput}
                                    id={`radio-2`}
                                    name="goal"
                                    onChange={() => handleRadioClick("2")}
                                  />
                                  <label
                                    className={styles.radioLabel}
                                    htmlFor={`radio-2`}
                                  >
                                    <span className={styles.radio}></span>
                                    <p className={styles.answerTitle}>
                                      Выбрать отдельные районы и станции метро
                                    </p>
                                  </label>
                                </div>
                                {selectedRadio === "2" && (
                                  <LocationCityMultiDropdownForms
                                    id={id}
                                    question={question}
                                    typeForm={typeForm}
                                  />
                                )}
                              </React.Fragment>
                            </div>
                          </div>
                        </>
                      )}
                    </React.Fragment>
                    <React.Fragment key={"20"}>
                      <div className={styles.answerLocation}>
                        <input
                          value={checkboxTrip}
                          onChange={() => handleCheckboxTripClick("2")}
                          checked={checkboxTrip.includes("2")}
                          type="checkbox"
                          className={styles.checkboxInput}
                          id={`checkboxTrip-2`}
                          name="checkboxTrip"
                        />
                        <label
                          className={styles.checkboxLabelLocation}
                          htmlFor={`checkboxTrip-2`}
                        >
                          <span className={styles.checkbox}></span>
                          <p className={styles.answerTitle}>
                            {regionUser?.area}
                          </p>
                        </label>
                      </div>
                      {checkboxTrip.includes("2") && (
                        <LocationAreaMultiDropdownForms
                          id={id}
                          question={question}
                          typeForm={typeForm}
                        />
                      )}
                    </React.Fragment>
                  </div>
                </div>
              )}
            </React.Fragment>
          </div>
        </div>
        <div
          className={clsx(styles.wrapButtonStandart, {
            [styles.wrapButtonStandart_with_cookies]: !cookiesAccepted,
          })}
        >
          <button
            type="button"
            disabled={!isFormValid()}
            onClick={() => updateDataTutor()}
            className={styles.continueButton}
          >
            Продолжить
          </button>
        </div>
      </div>
    </>
  );
};
