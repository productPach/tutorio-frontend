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

// Определяем тип для объекта в массиве
type Order = {
  id: number;
  subject?: string;
  goal?: string;
  class?: string;
  deadline?: string;
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

export const AdressInputForms: React.FC<ComponentRenderProps> = ({
  id,
  question,
  typeForm,
  answerArray,
}) => {
  const route = useRouter();

  // Состояние текстового поля
  const [inputValue, setInputValue] = useState("");
  // Состояние для ошибки текстового поля
  const [errorInput, setErrorInput] = useState(false);
  // Состояние для ошибки текстового поля
  const [errorInputText, setErrorInputText] = useState("");

  // Состояние для определения начал ли вводить пользователь в поисковую строку
  const [isInput, setIsInput] = useState(false);

  // Состояние для получения индекса выделенного элемента
  const [resultAdressIndex, setResultAdressIndex] = useState(0);
  // Получаем ссылку в DOM на элемент в выпадающем списке, чтобы перемещать скролл к данному элементу при выделении
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  // Вытаскиваем актуальный массив c данными формы из LocalStorage
  const getDataMatchLS = localStorage.getItem("currentMatch");
  // Конвертируем массив c данными формы из JSON в JS объект
  const dataMatch: Order[] = getDataMatchLS ? JSON.parse(getDataMatchLS) : [];

  // Получаем логическое значение "Содержится ли в массиве из LS свойство с typeForm текущей формы?"
  const containsClassProperty = dataMatch.find((obj) =>
    obj.hasOwnProperty(typeForm)
  );

  // Создаем переменную для начального значения состояния
  let initialCheckboxValue: DataAdress[];
  // Если длинна массива в объекте больше 0, то кладем это значение в initialCheckboxValue, чтобы передать в состояние при инициализации
  containsClassProperty?.[typeForm].length
    ? (initialCheckboxValue = containsClassProperty?.dataAdress)
    : (initialCheckboxValue = []);

  // Состояние для массива адресов
  const [adressList, setAdressList] =
    useState<DataAdress[]>(initialCheckboxValue);

  // Функция для валидации значения поля
  const handleInputValue = (e: ChangeEvent<HTMLInputElement>) => {
    setIsInput(true);

    if (/^\d*$/.test(e.target.value)) {
      setErrorInput(true);
    } else {
      setErrorInput(false);
    }
    setInputValue(e.target.value);
    getAdressDadata(e.target.value).then((data) => {
      setAdressList(data.suggestions);
    });
  };

  // Функция для перехода на следующий шаг
  const handleNextStep = useCallback(
    (link: string, inputValue: string, fiasLevel: string) => {
      setInputValue(inputValue);
      setIsInput(false);

      const fiasLevelNum = Number(fiasLevel);

      if (fiasLevelNum < 8) {
        setErrorInputText("Уточните адрес до дома");
        return;
      }

      // Сбрасываем ошибку если уровень подходит
      setErrorInputText("");
      // Обновляем состояния для красивого эффекта перехода
      setIsDisabled(true);
      setIsVisible(false);

      // Создаем новый объект, который нужно положить в массив с данными формы
      const newData = {
        id: id,
        [typeForm]: inputValue,
        dataAdress: adressList,
      };

      // Если typeForm текущей формы уже содержится в массиве, значит клиент уже отвечал на данный вопрос, и значит нужно удалить все последующие ответы (элементы массива с индексом больше индекса текущего объекта)
      if (containsClassProperty) {
        // Определяем индекс элмента массива (объекта, который появлися в массиве в результате ответа на данную форму)
        const indexOfArray = dataMatch.findIndex((obj) =>
          obj.hasOwnProperty(typeForm)
        );

        // Вариант, когда не нужно удалять все ранее записанные свойства при изменении checkbox
        dataMatch.splice(indexOfArray, 1, newData);
        // Кладем новый массив в LS
        localStorage.setItem("currentMatch", JSON.stringify(dataMatch));
      } else {
        // Если typeForm текущей формы не содержится в массиве, тогда просто добавляем новый объект в массив и кладем в LS
        const dataToSave = [...dataMatch, newData];
        localStorage.setItem("currentMatch", JSON.stringify(dataToSave));
      }
      // Для красоты делаем переход через 0,4 секунды после клика
      setTimeout(() => route.push(link), 400);
    },
    [route, typeForm, adressList, errorInputText]
  );

  // Функция для возврата на предыдущий шаг
  const handlePrevStep = () => {
    setIsDisabled(true);
    setIsVisible(false);
    // Для красоты делаем переход через 0,4 секунды после клика
    setTimeout(() => route.back(), 400);
  };

  const [isVisible, setIsVisible] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []); // Анимация будет стартовать после монтирования компонента

  useEffect(() => {
    // Находим объект массива по ID вопроса (формы)
    const currentDataMatch = dataMatch.find((obj) => obj.id === id);
    // Вытаскиваем значение данного объека из свойства, которое совпадает с typeForm (чтобы сделать checked выбранный ранее вариант ответа)
    const valueProperty = currentDataMatch ? currentDataMatch[typeForm] : "";
    setInputValue(valueProperty);
  }, [typeForm]);

  const nextPageProperty = answerArray[0].nextPage;

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
          nextPageProperty,
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
          {/* <div className={styles.description}>Выберите один из нижеперечисленных вариантов</div> */}
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
            inputValue.length > 1 &&
            errorInputText === "" &&
            isInput && (
              <div className={styles.resultContainerTutorSearch}>
                <ul>
                  {adressList.map((item, index) => {
                    return (
                      <React.Fragment key={item.data.fias_id}>
                        <li
                          key={item.data.fias_id}
                          onClick={() =>
                            handleNextStep(
                              nextPageProperty,
                              item.value,
                              item.data.fias_level
                            )
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
        <div className={styles.wrapButton}>
          <button
            type="button"
            onClick={() =>
              handleNextStep(
                nextPageProperty,
                inputValue,
                adressList[resultAdressIndex].data.fias_level
              )
            }
            className={styles.continueButton}
            disabled={!inputValue || errorInput}
          >
            Продолжить
          </button>
        </div>
      </div>
    </>
  );
};
