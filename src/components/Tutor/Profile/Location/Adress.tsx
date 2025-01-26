"use client";
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "../../../SignIn/SignInTutor/SignInTutor.module.css";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { getAdressDadata } from "@/api/addresses/addresses";
import { useAppSelector } from "@/store/store";

interface ComponentRenderProps {
  id: number;
  question: string;
  typeForm: string;
}

// Определяем тип для объекта в массиве
type Order = {
  id: number;
  subject?: string;
  goal?: string;
  class?: string;
  deadline?: string;
  tutorHomeAdress?: {
    adress: string;
    dataAdress: DataAdress[];
  };
  [key: string]: any;
};

// Определяем тип для массива адресов из ДаДаты
type DataAdress = {
  value: string;
  data: {
    fias_id: number;
    fias_level: string;
  };
};

export const Adress: React.FC<ComponentRenderProps> = ({
  id,
  question,
  typeForm,
}) => {
  const route = useRouter();

  const tutor = useAppSelector((state) => state.tutor.tutor);
  // Состояние текстового поля
  const [inputValue, setInputValue] = useState(tutor?.tutorAdress);
  // Состояние для ошибки текстового поля
  const [errorInput, setErrorInput] = useState(false);
  // Состояние для ошибки текстового поля
  const [errorInputText, setErrorInputText] = useState("");

  // Состояние для определения начал ли вводить пользователь в поисковую строку
  const [isInput, setIsInput] = useState(false);
  console.log(inputValue);

  // Состояние для получения индекса выделенного элемента
  const [resultAdressIndex, setResultAdressIndex] = useState(0);
  // Получаем ссылку в DOM на элемент в выпадающем списке, чтобы перемещать скролл к данному элементу при выделении
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  // Вытаскиваем актуальный массив c данными формы из LocalStorage
  const getDataMatchLS = localStorage.getItem("current-user");
  // Конвертируем массив c данными формы из JSON в JS объект
  const dataMatch: Order[] = getDataMatchLS ? JSON.parse(getDataMatchLS) : [];

  // Получаем логическое значение "Содержится ли в массиве из LS свойство с typeForm текущей формы?"
  const containsClassProperty = dataMatch.find((obj) =>
    obj.hasOwnProperty(typeForm)
  );

  // Создаем переменную для начального значения состояния
  let initialCheckboxValue: DataAdress[] = [];
  // Если длинна массива в объекте больше 0, то кладем это значение в initialCheckboxValue, чтобы передать в состояние при инициализации
  if (containsClassProperty?.tutorHomeAdress?.dataAdress) {
    initialCheckboxValue = containsClassProperty.tutorHomeAdress.dataAdress;
  }

  // Состояние для массива адресов
  const [adressList, setAdressList] =
    useState<DataAdress[]>(initialCheckboxValue);

  // Флаг для проверки, было ли изменено значение inputValue
  const [isInputValueChanged, setIsInputValueChanged] = useState(false);

  // Функция для валидации значения поля
  const handleInputValue = (e: ChangeEvent<HTMLInputElement>) => {
    setIsInput(true);
    const value = e.target.value;

    // Если поле состоит только из цифр, вызываем ошибку
    if (/^\d*$/.test(value)) {
      setErrorInput(true);
    } else {
      setErrorInput(false);
    }

    // Обновляем состояние поля ввода
    setInputValue(value);
    setIsInputValueChanged(true); // Устанавливаем флаг, что значение изменено

    // Проверяем введенное значение через API ДаДата
    getAdressDadata(value).then((data) => {
      setAdressList(data.suggestions);
    });
  };

  // Функция для обновления состояния формы
  const handleNextStep = useCallback(
    (inputValue: string, fiasLevel: string) => {
      setInputValue(inputValue);
      setIsInput(false);

      const fiasLevelNum = Number(fiasLevel);

      if (fiasLevelNum < 8) {
        setErrorInputText("Уточните адрес до дома");
        return;
      }

      // Сбрасываем ошибку если уровень подходит
      setErrorInputText("");

      // Обновляем объект в localStorage
      const updatedDataMatch = dataMatch.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            tutorHomeAdress: {
              adress: inputValue,
              dataAdress: adressList,
            },
          };
        }
        return item;
      });

      // Сохраняем обновленные данные обратно в localStorage
      localStorage.setItem("current-user", JSON.stringify(updatedDataMatch));
    },
    [adressList, dataMatch, id]
  );

  useEffect(() => {
    // Находим объект массива по ID вопроса (формы)
    const currentDataMatch = dataMatch.find((obj) => obj.id === id);

    // Устанавливаем значение только если inputValue пустое и не изменено
    if (inputValue === "" && !isInputValueChanged) {
      const valueProperty = currentDataMatch?.tutorHomeAdress?.adress ?? "";
      setInputValue(valueProperty);
    }
  }, [id, dataMatch, inputValue, isInputValueChanged]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        setResultAdressIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % adressList.length;

          // Прокручиваем к следующему элементу
          itemRefs.current[nextIndex]?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });

          return nextIndex;
        });
      }

      if (e.key === "ArrowUp") {
        // Блокируем дефолтное поведение, запрещаем перемещать курсор в начало строки
        e.preventDefault();
        setResultAdressIndex((prevIndex) => {
          const nextIndex =
            (prevIndex - 1 + adressList.length) % adressList.length;

          // Прокручиваем к следующему элементу
          itemRefs.current[nextIndex]?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
          return nextIndex;
        });
      }

      if (e.key === "Enter" && adressList.length > 0) {
        handleNextStep(
          adressList[resultAdressIndex].value,
          adressList[resultAdressIndex].data.fias_level
        );
      }

      if (e.key === "Enter" && adressList.length === 0) {
        setErrorInput(true);
      }

      if (e.key === "Backspace" || adressList.length > 0) {
        setErrorInput(false);
        setErrorInputText("");
      }
    };

    const input = document.getElementById("stydentAdress");
    input?.addEventListener("keydown", handleKeyDown);

    return () => {
      input?.removeEventListener("keydown", handleKeyDown);
    };
  }, [adressList, resultAdressIndex, handleNextStep]);

  return (
    <>
      <div className={styles.wrapAdress}>
        <div className={styles.description}>
          Укажите адрес, где планируете заниматься с учениками
        </div>
        <input
          id="stydentAdress"
          type="text"
          placeholder="Начните вводить адрес"
          autoComplete="off"
          value={inputValue}
          onChange={handleInputValue}
          className={clsx(styles.inputUniversityName, {
            [styles.errorInput]: errorInput,
          })}
          maxLength={250}
        />
        {errorInput ? (
          <div className={styles.errorInputText}>
            Пожалуйста, введите ваш адрес проживания с номером дома
          </div>
        ) : null}

        {Number(adressList[resultAdressIndex]?.data.fias_level) < 8 &&
        !isInput ? (
          <div className={styles.errorInputText}>
            Пожалуйста, уточните адрес, указав номер дома
          </div>
        ) : null}

        {adressList.length > 0 &&
          inputValue &&
          inputValue.length > 1 &&
          errorInputText === "" &&
          isInput && (
            <div className={styles.resultContainerTutorSearch}>
              <ul>
                {adressList.map((item, index) => {
                  return (
                    <React.Fragment key={item.data.fias_id}>
                      <li
                        onClick={() =>
                          handleNextStep(item.value, item.data.fias_level)
                        }
                        className={`${styles.resultTutorSearch} ${
                          index === resultAdressIndex ? styles.highlight : ""
                        }`}
                        ref={(el) => {
                          itemRefs.current[index] = el;
                        }}
                      >
                        {item.value}
                      </li>
                    </React.Fragment>
                  );
                })}
              </ul>
            </div>
          )}
      </div>
    </>
  );
};
