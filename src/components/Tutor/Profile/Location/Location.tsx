"use client";
import styles from "../../../../app/tutor/layout.module.css";
import componentLocationStyle from "./Location.module.css";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setModalSelectCity } from "@/store/features/modalSlice";
import React, { useEffect, useState } from "react";
import { District, Metro, RegionalCity } from "@/types/types";
import { getAllLocations } from "@/store/features/locationSlice";
import {
  setSelectedValuesArea,
  setSelectedValuesCity,
  updateTutor,
} from "@/store/features/tutorSlice";
import { getLocationForCity } from "@/api/addresses/addresses";
import { Adress } from "./Adress";
import { CityMultiDropdownForms } from "./CityMultiDropdownForms";
import { AreaMultiDropdownForms } from "./AreaMultiDropdownForms";
import { Spinner } from "@/components/Spinner/Spinner";

export const Location = () => {
  // Получаем значение tutor из Redux
  const token = useAppSelector((state) => state.auth.token);
  const tutor = useAppSelector((state) => state.tutor.tutor);
  // Получаем значение loading из Redux
  const isLoading = useAppSelector((state) => state.tutor.loading);
  const updateStatus = useAppSelector((state) => state.tutor.updateStatus);

  const [successUpdateTutor, setSuccessUpdateTutor] = useState(false);

  useEffect(() => {
    updateStatus === "success" && setSuccessUpdateTutor(true);
  }, [updateStatus]);

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getAllLocations());
  }, [dispatch]);
  // Получаем города из Redux
  const locations = useAppSelector((state) => state.locations.city);

  // Получаем значение региона tutor из Redux
  const regionUser = locations.find((city) => city.title === tutor?.region);
  const region = regionUser?.title;

  // Получаем значения локаций для инпутов и радиокнопок
  const initialTutorPlace = tutor?.tutorPlace || [];
  const initialTutorTrip = tutor?.tutorTrip || [];
  const initialTutorTripCityData = tutor?.tutorTripCityData || null;
  const initialTutorTripCity = tutor?.tutorTripCity || [];

  // ПРЕОБРАЗУЕМ СПИСОК АЙДИШНИКОВ District и Metro в (District | Metro)[], чтобы передать в tutorSclice
  // ЗАЧЕМ: ЧТОБЫ ПЕРЕИСПОЛЬЗОВАТЬ КОМПОНЕНТЫ С ВЫПАДАЮЩИМИ СПИСКАМИ РАЙОНОВ, МЕТРО И РЕГИОНАЛЬНЫХ ГОРОДОВ
  useEffect(() => {
    if (!locations.length || !initialTutorTripCity.length) return; // Если данных нет, не выполняем

    // Преобразуем ID в объекты District и Metro
    const transformedCityData = initialTutorTripCity.flatMap((cityId) => {
      return locations.flatMap((city) => {
        const selectedItems: (District | Metro)[] = []; // Типизируем массив как (District | Metro)

        // Ищем в districts для совпадения с cityId
        const district = city.districts.find(
          (district) => district.id === cityId
        );
        if (district) {
          // Если нашли district, добавляем его с типами District
          selectedItems.push({
            id: district.id,
            title: district.title,
          } as District);
        }

        // Ищем метро (Metro) отдельно в каждом district
        const metro = city.districts.flatMap((district) =>
          district.metros.filter((metro) => metro.id === cityId)
        );
        metro.forEach((metroItem) => {
          // Если нашли metro, добавляем его с типами Metro
          selectedItems.push({
            id: metroItem.id,
            title: metroItem.title,
          } as Metro);
        });

        return selectedItems; // Возвращаем массив с найденными District и Metro
      });
    });

    // Отправляем преобразованные данные в редуктор
    dispatch(setSelectedValuesCity(transformedCityData));
  }, [locations, initialTutorTripCity, dispatch]); // Зависимости для useEffect

  const initialtutorTripArea = tutor?.tutorTripArea || [];
  // ПРЕОБРАЗУЕМ СПИСОК АЙДИШНИКОВ RegionalCity и Metro в (RegionalCity)[], чтобы передать в tutorSclice
  // ЗАЧЕМ: ЧТОБЫ ПЕРЕИСПОЛЬЗОВАТЬ КОМПОНЕНТЫ С ВЫПАДАЮЩИМИ СПИСКАМИ РАЙОНОВ, МЕТРО И РЕГИОНАЛЬНЫХ ГОРОДОВ
  useEffect(() => {
    if (!locations.length || !initialtutorTripArea.length) return; // Если данных нет, не выполняем

    // Преобразуем ID в объекты RegionalCity
    const transformedAreaData = initialtutorTripArea.flatMap((areaId) => {
      return locations.flatMap((city) => {
        const selectedItems: RegionalCity[] = []; // Типизируем массив как RegionalCity

        // Ищем в regionalCities для совпадения с areaId
        const regionalCity = city.regionalCities.find(
          (region) => region.id === areaId
        );
        if (regionalCity) {
          // Если нашли RegionalCity, добавляем его
          selectedItems.push({
            id: regionalCity.id,
            title: regionalCity.title,
          });
        }

        return selectedItems; // Возвращаем массив с найденными RegionalCity
      });
    });

    // Отправляем преобразованные данные в редуктор
    dispatch(setSelectedValuesArea(transformedAreaData));
  }, [locations, initialtutorTripArea, dispatch]); // Зависимости для useEffect

  const initialTutorAdress = tutor?.tutorAdress;

  // Выбранные основные чекбоксы (tutorPlace)
  const [checkbox, setCheckbox] = useState<string[]>(initialTutorPlace);
  const [checkboxTrip, setCheckboxTrip] = useState<string[]>(initialTutorTrip);
  // Состояние для отслеживания выбранной радиокнопки
  const [selectedRadio, setSelectedRadio] = useState<string | null>(
    initialTutorTripCityData
  );
  // Получаем значение selectedValuesCity из Redux
  const selectedValuesCity: (District | Metro)[] = useAppSelector(
    (state) => state.tutor.selectedValuesCity
  );
  // Получаем значение selectedValuesArea из Redux
  const selectedValuesArea = useAppSelector(
    (state) => state.tutor.selectedValuesArea
  );

  // Стейт для адреса репетитора
  const [inputTutorAdress, setInputTutorAdress] = useState(initialTutorAdress);

  const tutorPlace = checkbox;
  const tutorAdress = inputTutorAdress;

  const tutorTrip = checkboxTrip;
  const tutorTripCityData = selectedRadio ?? undefined;
  const tutorTripCity = [...selectedValuesCity.map((item) => item.id)];
  const tutorTripArea = [...selectedValuesArea.map((item) => item.id)];

  // Обновление данных репетитора
  const updateDataTutor = () => {
    const id = tutor?.id;
    const status = tutor?.status;
    if (token && id && status) {
      dispatch(
        updateTutor({
          id,
          token,
          status,
          region,
          tutorPlace,
          tutorAdress,
          tutorTrip,
          tutorTripCityData,
          tutorTripCity,
          tutorTripArea,
        })
      ).unwrap;
    } else {
      console.log("Нет токена");
    }
  };

  const handleCheckboxClick = (title: string) => {
    setSuccessUpdateTutor(false);
    setCheckbox((prev) => {
      const updatedCheckboxes = prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title];
      return updatedCheckboxes;
    });
  };

  const handleCheckboxTripClick = (title: string) => {
    setSuccessUpdateTutor(false);
    setCheckboxTrip((prev) => {
      const updatedCheckboxes = prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title];
      return updatedCheckboxes;
    });
  };

  // Обработчик для радио-кнопки
  // Функция для обработки клика по радиокнопке
  const handleRadioClick = async (numRadio: string) => {
    setSuccessUpdateTutor(false);
    setSelectedRadio(numRadio); // Устанавливаем выбранную радиокнопку
    let locationsTripCity: (District | Metro)[] = [];
    if (numRadio === "1" && regionUser) {
      locationsTripCity = await getLocationForCity(regionUser.title, locations); // Получаем данные для города
    } else if (numRadio === "2") {
      locationsTripCity = []; // Очищаем данные
    }
    dispatch(setSelectedValuesCity(locationsTripCity));
  };

  const [isVisible, setIsVisible] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

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
      inputTutorAdress &&
      inputTutorAdress?.trim().length > 0 &&
      !checkbox.includes("3")
    ) {
      return true;
    }

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
        (checkbox.includes("2") &&
          inputTutorAdress &&
          inputTutorAdress?.trim().length > 0))
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
        (checkbox.includes("2") &&
          inputTutorAdress &&
          inputTutorAdress?.trim().length > 0))
    ) {
      return true;
    }
    // Если ни одно из условий не выполняется, форма не валидна
    return false;
  };

  return (
    <>
      <div className={styles.content_block}>
        <h3>Место занятий и локации</h3>
      </div>

      <div className={componentLocationStyle.content_blockGap32}>
        <div className={styles.content_block}>
          {/* <div className={componentLocationStyle.title}>Заголовок</div> */}
          {/* <div className={styles.description}>Выберите один из нижеперечисленных вариантов</div> */}
          <div className={componentLocationStyle.containerAnswers}>
            <React.Fragment key={"1"}>
              <div className={componentLocationStyle.answerLocation}>
                <input
                  value={checkbox}
                  onChange={() => handleCheckboxClick("1")}
                  checked={checkbox.includes("1")}
                  type="checkbox"
                  className={componentLocationStyle.checkboxInput}
                  id={`checkbox-1`}
                  name="checkbox"
                />
                <label
                  className={componentLocationStyle.checkboxLabelLocation}
                  htmlFor={`checkbox-1`}
                >
                  <span className={componentLocationStyle.checkbox}></span>
                  <p className={componentLocationStyle.answerTitle}>
                    Дистанционно
                  </p>
                </label>
              </div>
            </React.Fragment>
            <React.Fragment key={"2"}>
              <div className={componentLocationStyle.answerLocation}>
                <input
                  value={checkbox}
                  onChange={() => handleCheckboxClick("2")}
                  checked={checkbox.includes("2")}
                  type="checkbox"
                  className={componentLocationStyle.checkboxInput}
                  id={`checkbox-2`}
                  name="checkbox"
                />
                <label
                  className={componentLocationStyle.checkboxLabelLocation}
                  htmlFor={`checkbox-2`}
                >
                  <span className={componentLocationStyle.checkbox}></span>
                  <p className={componentLocationStyle.answerTitle}>
                    Занимаюсь с учениками у себя
                  </p>
                </label>
              </div>
              {checkbox.includes("2") && (
                <Adress
                  id={5}
                  question={"question"}
                  typeForm={"typeForm"}
                  setInputTutorAdress={setInputTutorAdress}
                />
              )}
            </React.Fragment>
            <React.Fragment key={"3"}>
              <div className={componentLocationStyle.answerLocation}>
                <input
                  value={checkbox}
                  onChange={() => handleCheckboxClick("3")}
                  checked={checkbox.includes("3")}
                  type="checkbox"
                  className={componentLocationStyle.checkboxInput}
                  id={`checkbox-3`}
                  name="checkbox"
                />
                <label
                  className={componentLocationStyle.checkboxLabelLocation}
                  htmlFor={`checkbox-3`}
                >
                  <span className={componentLocationStyle.checkbox}></span>
                  <p className={componentLocationStyle.answerTitle}>
                    Готов выезжать к ученикам
                  </p>
                </label>
              </div>
              {checkbox.includes("3") && (
                <div className={componentLocationStyle.wrapAdress}>
                  <div className={componentLocationStyle.description}>
                    Укажите места, куда вы готовы выезжать на занятия с
                    учениками
                  </div>
                  <div className={componentLocationStyle.description}>
                    Регион:{" "}
                    <span
                      onClick={() => {
                        dispatch(setModalSelectCity(true));
                      }}
                      style={{ textDecoration: "underline", cursor: "pointer" }}
                    >
                      {regionUser && regionUser.title} и{" "}
                      {regionUser && regionUser.area}
                    </span>
                  </div>
                  <div className={componentLocationStyle.containerAnswers}>
                    <React.Fragment key={"10"}>
                      <div className={componentLocationStyle.answerLocation}>
                        <input
                          value={checkboxTrip}
                          onChange={() => handleCheckboxTripClick("1")}
                          checked={checkboxTrip.includes("1")}
                          type="checkbox"
                          className={componentLocationStyle.checkboxInput}
                          id={`checkboxTrip-1`}
                          name="checkboxTrip"
                        />
                        <label
                          className={
                            componentLocationStyle.checkboxLabelLocation
                          }
                          htmlFor={`checkboxTrip-1`}
                        >
                          <span
                            className={componentLocationStyle.checkbox}
                          ></span>
                          <p className={componentLocationStyle.answerTitle}>
                            {regionUser?.title}
                          </p>
                        </label>
                      </div>
                      {checkboxTrip.includes("1") && (
                        <>
                          <div className={componentLocationStyle.wrapAdress}>
                            <div
                              className={
                                componentLocationStyle.containerAnswers
                              }
                            >
                              <React.Fragment key={"1"}>
                                <div
                                  className={
                                    componentLocationStyle.answerContainer
                                  }
                                >
                                  <input
                                    checked={selectedRadio === "1"}
                                    readOnly
                                    type="radio"
                                    className={
                                      componentLocationStyle.radioInput
                                    }
                                    id={`radio-1`}
                                    name="goal"
                                    onChange={() => handleRadioClick("1")}
                                  />
                                  <label
                                    className={
                                      componentLocationStyle.radioLabel
                                    }
                                    htmlFor={`radio-1`}
                                  >
                                    <span
                                      className={componentLocationStyle.radio}
                                    ></span>
                                    <p
                                      className={
                                        componentLocationStyle.answerTitle
                                      }
                                    >
                                      Выезжаю по всему городу
                                    </p>
                                  </label>
                                </div>
                              </React.Fragment>
                              <React.Fragment key={"2"}>
                                <div
                                  className={
                                    componentLocationStyle.answerContainer
                                  }
                                >
                                  <input
                                    checked={selectedRadio === "2"}
                                    readOnly
                                    type="radio"
                                    className={
                                      componentLocationStyle.radioInput
                                    }
                                    id={`radio-2`}
                                    name="goal"
                                    onChange={() => handleRadioClick("2")}
                                  />
                                  <label
                                    className={
                                      componentLocationStyle.radioLabel
                                    }
                                    htmlFor={`radio-2`}
                                  >
                                    <span
                                      className={componentLocationStyle.radio}
                                    ></span>
                                    <p
                                      className={
                                        componentLocationStyle.answerTitle
                                      }
                                    >
                                      Выбрать отдельные районы и станции метро
                                    </p>
                                  </label>
                                </div>
                                {selectedRadio === "2" && (
                                  <CityMultiDropdownForms
                                    id={5}
                                    question={"question"}
                                    typeForm={"typeForm"}
                                    setSuccessUpdateTutor={
                                      setSuccessUpdateTutor
                                    }
                                  />
                                )}
                              </React.Fragment>
                            </div>
                          </div>
                        </>
                      )}
                    </React.Fragment>
                    <React.Fragment key={"20"}>
                      <div className={componentLocationStyle.answerLocation}>
                        <input
                          value={checkboxTrip}
                          onChange={() => handleCheckboxTripClick("2")}
                          checked={checkboxTrip.includes("2")}
                          type="checkbox"
                          className={componentLocationStyle.checkboxInput}
                          id={`checkboxTrip-2`}
                          name="checkboxTrip"
                        />
                        <label
                          className={
                            componentLocationStyle.checkboxLabelLocation
                          }
                          htmlFor={`checkboxTrip-2`}
                        >
                          <span
                            className={componentLocationStyle.checkbox}
                          ></span>
                          <p className={componentLocationStyle.answerTitle}>
                            {regionUser?.area}
                          </p>
                        </label>
                      </div>
                      {checkboxTrip.includes("2") && (
                        <AreaMultiDropdownForms
                          id={5}
                          question={"question"}
                          typeForm={"typeForm"}
                          setSuccessUpdateTutor={setSuccessUpdateTutor}
                        />
                      )}
                    </React.Fragment>
                  </div>
                </div>
              )}
            </React.Fragment>
          </div>
        </div>
        <div className={componentLocationStyle.containerButton}>
          <button
            type="button"
            className={componentLocationStyle.saveButton}
            disabled={!isFormValid() || isLoading || successUpdateTutor}
            onClick={() => updateDataTutor()}
          >
            {successUpdateTutor ? "Сохранено" : "Сохранить"}
            {isLoading && (
              <div className={styles.buttonYlSpinner}>
                <Spinner />
              </div>
            )}
          </button>
          <div>{successUpdateTutor && "Данные успешно обновлены"}</div>
        </div>
      </div>
    </>
  );
};
