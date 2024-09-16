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
import { getAdressDadata } from "@/api/addresses/addresses";
import { Order } from "@/types/types";

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

// Определяем тип для массива адресов из ДаДаты
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

export const LocationMultiDropdownForm: React.FC<ComponentRenderProps> = ({
  id,
  question,
  typeForm,
  answerArray,
}) => {
  const route = useRouter();

  // Состояние текстового поля
  const [inputValue, setInputValue] = useState("");
  const [selectedValues, setSelectedValues] = useState<DataAdress[]>([]); // Для выбранных адресов
  const [adressList, setAdressList] = useState<DataAdress[]>([]); // Для выпадающего списка
  // Состояние для ошибки текстового поля
  const [errorInput, setErrorInput] = useState(false);
  const [errorInputText, setErrorInputText] = useState("");
  const [isInput, setIsInput] = useState(false);
  const [resultAdressIndex, setResultAdressIndex] = useState(0);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  const getDataMatchLS = localStorage.getItem("currentMatch");
  const dataMatch: Order[] = getDataMatchLS ? JSON.parse(getDataMatchLS) : [];
  const containsClassProperty = dataMatch.find((obj) =>
    obj.hasOwnProperty(typeForm)
  );

  let initialCheckboxValue: DataAdress[] = [];
  containsClassProperty?.[typeForm].length
    ? (initialCheckboxValue = containsClassProperty?.dataAdress)
    : (initialCheckboxValue = []);

  const handleInputValue = (e: ChangeEvent<HTMLInputElement>) => {
    setIsInput(true);
    setInputValue(e.target.value);

    getAdressDadata(e.target.value).then((data) => {
      setAdressList(data.suggestions); // Здесь можно использовать разные типы данных (метро, районы, города)
    });
  };

  const handleNextStep = useCallback(
    (link: string) => {
      if (selectedValues.length === 0) {
        setErrorInputText("Пожалуйста, выберите хотя бы один адрес");
        return;
      }

      const newData = {
        id: id,
        [typeForm]: selectedValues.map((el) => el.value).join(", "), // Сохранить список выбранных значений
        dataAdress: selectedValues,
      };

      if (containsClassProperty) {
        const indexOfArray = dataMatch.findIndex((obj) =>
          obj.hasOwnProperty(typeForm)
        );
        dataMatch.splice(indexOfArray, 1, newData);
        localStorage.setItem("currentMatch", JSON.stringify(dataMatch));
      } else {
        const dataToSave = [...dataMatch, newData];
        localStorage.setItem("currentMatch", JSON.stringify(dataToSave));
      }

      setTimeout(() => route.push(link), 400);
    },
    [route, typeForm, selectedValues]
  );

  const handlePrevStep = () => {
    setTimeout(() => route.back(), 400);
  };

  const [isVisible, setIsVisible] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const currentDataMatch = dataMatch.find((obj) => obj.id === id);
    const valueProperty = currentDataMatch ? currentDataMatch[typeForm] : "";
    setInputValue(valueProperty);
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
      setSelectedValues((prevValues) => [...prevValues, selectedAdress]); // Добавляем выбранное значение
      setInputValue(""); // Очищаем поле ввода
      setIsInput(false); // Скрываем выпадающий список
    }
  };

  useEffect(() => {
    const input = document.getElementById("stydentAdress");
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
                {adressList.map((item, index) => {
                  return (
                    <li
                      key={item.data.fias_id}
                      onClick={() => {
                        setSelectedValues((prevValues) => [
                          ...prevValues,
                          item,
                        ]);
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
                      {item.value}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <div className={styles.selectedValues}>
            {selectedValues.map((item, index) => (
              <div key={index} className={styles.selectedItem}>
                {item.value}
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
    </>
  );
};
