"use client";
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "../Match.module.css";
import animation from "../../../app/match/layout.module.css";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import Image from "next/image";
import { getLocation } from "@/api/addresses/addresses";
import { District, Metro, Order, RegionalCity } from "@/types/types";
import { setModalSelectCity } from "@/store/features/modalSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setSelectedValues } from "@/store/features/matchSlice";
import { setRegionUser } from "@/store/features/authSlice";

interface Answer {
  id: number;
  title: string;
  nextPage: string;
}

interface ComponentRenderProps {
  id: number;
  question: string;
  description: string;
  typeForm: string;
  answerArray: Answer[];
}

export const LocationMultiDropdownForm: React.FC<ComponentRenderProps> = ({
  id,
  question,
  description,
  typeForm,
  answerArray,
}) => {
  const route = useRouter();
  const dispatch = useAppDispatch();
  const regionUser = useAppSelector((state) => state.auth.regionUser);
  const selectedValues = useAppSelector((state) => state.match.selectedValues);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [adressList, setAdressList] = useState<
    (District | Metro | RegionalCity)[]
  >([]);
  const [errorInput, setErrorInput] = useState(false);
  const [errorInputText, setErrorInputText] = useState("");
  const [isInput, setIsInput] = useState(false);
  const [resultAdressIndex, setResultAdressIndex] = useState(0);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  const getDataMatchLS = localStorage.getItem("currentMatch");
  const dataMatch: Order[] = getDataMatchLS ? JSON.parse(getDataMatchLS) : [];

  useEffect(() => {
    const regionUserJson = localStorage.getItem("region-user");
    const regionUser = regionUserJson ? JSON.parse(regionUserJson) : "";

    if (regionUser) {
      dispatch(setRegionUser(regionUser));
    }
  }, [dispatch]);

  useEffect(() => {
    // Обновляем адресный список при изменении inputValue или selectedValues
    const updateAddressList = async () => {
      if (regionUser) {
        const data = await getLocation(
          inputValue,
          regionUser.city,
          selectedValues
        );

        // Объединяем результаты и фильтруем выбранные значения
        const combinedResults = [
          ...data.metros,
          ...data.districts,
          ...data.regionalCities,
        ].filter(
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
    const updatedValues = selectedValues.filter((_, i) => i !== index);
    dispatch(setSelectedValues(updatedValues));
  };

  const handleNextStep = useCallback(
    (link: string) => {
      setIsVisible(false);
      setTimeout(() => route.push(link), 400);
    },
    [route]
  );

  const handlePrevStep = () => {
    setIsVisible(false);
    setTimeout(() => route.back(), 400);
  };

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // При перезагрузке страницы восстанавливаем данные из LS
  useEffect(() => {
    const currentDataMatch = dataMatch.find((obj) => obj.id === id);
    const valueProperty = currentDataMatch ? currentDataMatch[typeForm] : "";
    valueProperty && dispatch(setSelectedValues(valueProperty));
  }, [typeForm]);

  const nextPageProperty = answerArray[0].nextPage;

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

      if (selectedAdress) {
        const updatedValues = [...selectedValues, selectedAdress];
        dispatch(setSelectedValues(updatedValues));
        setInputValue("");
        setIsInput(false);
      }
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

    let existingData = dataMatch.find((item) => item.id === id);

    if (existingData) {
      existingData[typeForm] = selectedValues.map((item) => ({
        id: item.id,
        title: item.title,
      }));
    } else {
      existingData = {
        id: id,
        [typeForm]: selectedValues.map((item) => ({
          id: item.id,
          title: item.title,
        })),
      };
    }

    const updatedDataMatch = dataMatch.filter((item) => item.id !== id);
    const dataToSave = [...updatedDataMatch, existingData];
    localStorage.setItem("currentMatch", JSON.stringify(dataToSave));
  }, [selectedValues]);

  return (
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
        <div className={styles.description}>{description}</div>
        <div className={styles.description}>
          Регион:{" "}
          <span
            onClick={() => {
              dispatch(setModalSelectCity(true));
            }}
            style={{ textDecoration: "underline", cursor: "pointer" }}
          >
            {regionUser && regionUser.city} и {regionUser && regionUser.area}
          </span>
        </div>
        <input
          id="stydentAdress"
          type="text"
          placeholder={answerArray[0].title}
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
                    const updatedValues = [...selectedValues, item];
                    dispatch(setSelectedValues(updatedValues));
                    setInputValue("");
                    setIsInput(false);
                  }}
                  className={`${styles.resultTutorSearch} ${
                    index === resultAdressIndex ? styles.highlight : ""
                  }`}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                >
                  {item.title}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className={styles.selectedValues}>
          {selectedValues.map((item, index) => (
            <div key={index} className={styles.selectedItem}>
              {item.title}
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

      <div className={styles.wrapButton}>
        <button
          type="button"
          onClick={() => handleNextStep(nextPageProperty)}
          className={styles.continueButton}
          disabled={selectedValues.length === 0}
        >
          Продолжить
        </button>
      </div>
    </div>
  );
};
