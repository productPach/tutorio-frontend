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
import { District, Metro, Order } from "@/types/types";

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

  const [inputValue, setInputValue] = useState("");
  const [selectedValues, setSelectedValues] = useState<(District | Metro)[]>(
    []
  );
  const [adressList, setAdressList] = useState<(District | Metro)[]>([]);
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
  containsClassProperty?.[typeForm]?.length
    ? (initialCheckboxValue = containsClassProperty.dataAdress)
    : (initialCheckboxValue = []);

  const handleInputValue = async (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsInput(true); // Добавляем, чтобы отображать подсказки, если есть ввод

    try {
      const data = await getLocation(
        e.target.value,
        "Санкт-Петербург",
        selectedValues
      );
      setAdressList(data);
    } catch (error) {
      console.error("Ошибка при получении данных:", error);
    }
  };

  const handleSelect = (item: District | Metro) => {
    setSelectedValues((prevValues) => [...prevValues, item]);
    setInputValue(""); // Очищаем поле после выбора
  };

  const handleRemoveItem = (index: number) => {
    setSelectedValues((prevValues) => prevValues.filter((_, i) => i !== index));
  };

  const handleNextStep = useCallback(
    (link: string) => {
      if (selectedValues.length === 0) {
        setErrorInputText("Пожалуйста, выберите хотя бы один адрес");
        return;
      }

      const newData = {
        id: id,
        [typeForm]: selectedValues.map((el) => el.title).join(", "),
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
      setSelectedValues((prevValues) => [...prevValues, selectedAdress]);
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
                {adressList.map((item, index) => (
                  <li
                    key={item.id}
                    onClick={() => {
                      setSelectedValues((prevValues) => [...prevValues, item]);
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
