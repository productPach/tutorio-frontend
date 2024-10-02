"use client";
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "../../../Match/Match.module.css";
import animation from "../../../../app/match/layout.module.css";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import Image from "next/image";
import { getLocation } from "@/api/addresses/addresses";
import { District, Metro, Order } from "@/types/types";
import { setModalSelectCity } from "@/store/features/modalSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setRegionUser, setSelectedValues } from "@/store/features/matchSlice";

interface ComponentRenderProps {
  id: number;
  question: string;
  typeForm: string;
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

export const LocationMultiDropdownForms: React.FC<ComponentRenderProps> = ({
  id,
  question,
  typeForm,
}) => {
  const route = useRouter();
  const dispatch = useAppDispatch();
  // Получаем значение regionUser из Redux
  const regionUser = useAppSelector((state) => state.match.regionUser);
  // Получаем значение selectedValues из Redux
  const selectedValues = useAppSelector((state) => state.match.selectedValues);

  // Создаем флаг для отслеживания первоначальной загрузки
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [inputValue, setInputValue] = useState("");
  // const [selectedValues, setSelectedValues] = useState<(District | Metro)[]>(
  //   []
  // );
  const [adressList, setAdressList] = useState<(District | Metro)[]>([]);
  const [errorInput, setErrorInput] = useState(false);
  const [errorInputText, setErrorInputText] = useState("");
  const [isInput, setIsInput] = useState(false);
  const [resultAdressIndex, setResultAdressIndex] = useState(0);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  const getDataMatchLS = localStorage.getItem("current-user");
  const dataMatch: Order[] = getDataMatchLS ? JSON.parse(getDataMatchLS) : [];

  useEffect(() => {
    const regionUserJson = localStorage.getItem("region-user");
    const regionUser = regionUserJson ? JSON.parse(regionUserJson) : "";

    if (regionUser) {
      dispatch(setRegionUser(regionUser));
    }
  }, [dispatch]);

  // Добавление локации
  const handleInputValue = async (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsInput(true); // Добавляем, чтобы отображать подсказки, если есть ввод

    try {
      if (regionUser) {
        const data = await getLocation(
          e.target.value,
          regionUser.city,
          selectedValues
        );
        setAdressList(data);
      }
    } catch (error) {
      console.error("Ошибка при получении данных:", error);
    }
  };

  // Удаление локации
  const handleRemoveItem = (index: number) => {
    const updatedValues = selectedValues.filter((_, i) => i !== index);
    dispatch(setSelectedValues(updatedValues)); // Передаём обновлённый массив
  };

  const handleNextStep = useCallback(
    (link: string) => {
      setIsVisible(false);
      setTimeout(() => route.push(link), 400);
    },
    [route, typeForm, selectedValues]
  );

  const handlePrevStep = () => {
    setIsVisible(false);
    // Для красоты делаем переход через 0,4 секунды после клика
    setTimeout(() => route.back(), 400);
  };

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // При перезагрузке страницы высстанавилваемданные из LS
  useEffect(() => {
    const currentDataMatch = dataMatch.find((obj) => obj.id === id);
    const valueProperty = currentDataMatch ? currentDataMatch[typeForm] : "";
    valueProperty && dispatch(setSelectedValues(valueProperty));
  }, [typeForm]);

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
      const selectedAdress = adressList[resultAdressIndex];
      const updatedValues = [...selectedValues, selectedAdress]; // Добавляем новый элемент к текущему состоянию
      dispatch(setSelectedValues(updatedValues)); // Передаём обновлённый массив в Redux
      setInputValue(""); // Очищаем поле ввода
      setIsInput(false); // Закрываем выпадающий список
    }
  };

  useEffect(() => {
    const input = document.getElementById("stydentAdress");
    input?.addEventListener("keydown", handleKeyDown);

    return () => {
      input?.removeEventListener("keydown", handleKeyDown);
    };
  }, [adressList, resultAdressIndex]);

  // Каждый раз, когда обновляется состояние selectedValues редактируем массив в LS
  useEffect(() => {
    if (isInitialLoad) {
      setIsInitialLoad(false);
      return;
    }

    // Проверяем, существует ли уже объект для текущей формы (typeForm) в localStorage
    let existingData = dataMatch.find((item) => item.id === id);

    if (existingData) {
      // Если объект существует, обновляем массив значений
      existingData[typeForm] = selectedValues.map((item) => ({
        id: item.id,
        title: item.title, // Добавляем title
      }));
    } else {
      // Если объект не существует, создаем новый объект
      existingData = {
        id: id,
        [typeForm]: selectedValues.map((item) => ({
          id: item.id,
          title: item.title, // Добавляем title
        })),
      };
    }

    // Обновляем данные в localStorage
    const updatedDataMatch = dataMatch.filter((item) => item.id !== id); // Удаляем старую запись с тем же id
    const dataToSave = [...updatedDataMatch, existingData]; // Добавляем обновленную запись
    localStorage.setItem("current-user", JSON.stringify(dataToSave));
  }, [selectedValues]);

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
            id="stydentAdress"
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
                      dispatch(setSelectedValues(updatedValues));
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
