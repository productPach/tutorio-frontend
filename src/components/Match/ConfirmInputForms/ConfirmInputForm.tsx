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
type DataItem = {
  id: number;
  subject?: string;
  goal?: string;
  class?: string;
  deadline?: string;
  [key: string]: any;
};

export const ConfirmInputForm: React.FC<ComponentRenderProps> = ({
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

  const initialMinute = 0; // Начальное количество минут
  const [minutes, setMinutes] = useState(initialMinute); // Состояние для отображения минут
  const [seconds, setSeconds] = useState(9); // Состояние для отображения секунд

  // Состояние для содержимого инпутов
  const [codes, setCodes] = useState(["", "", "", ""]);
  // Состояние для активного инпута (нужно, чтобы отслеживать какой инпут должен быть в фокусе, при этом остальные дизейблим)
  const [activeIndex, setActiveIndex] = useState(0);
  // Ссылки на инпуты
  const inputRefs = useRef<(HTMLInputElement | null)[]>([
    null,
    null,
    null,
    null,
  ]);

  // Функция добавления значения в инпут
  const handleChange = (value: string, index: number) => {
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newCodes = [...codes];
      newCodes[index] = value;
      setCodes(newCodes);

      if (value && index < 3) {
        setActiveIndex(index + 1);
      }
    }
  };

  // Функция удаления значения из инпута
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace") {
      // Если текущий инпут пустой и не является первым инпутом, то
      // переходим на предыдущий инпут и очищаем его содержимое
      if (index > 0 && !codes[index]) {
        setActiveIndex(index - 1);
        const newCodes = [...codes];
        newCodes[index - 1] = "";
        setCodes(newCodes);
      } else if (index === 0 && !codes[index]) {
        // Если текущий инпут первый и пустой, просто очищаем его содержимое
        const newCodes = [...codes];
        newCodes[index] = "";
        setCodes(newCodes);
      }
    }
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  };

  // Обновляем фокус на следующий инпут при изменении активного инпута
  useEffect(() => {
    inputRefs.current[activeIndex]?.focus();
  }, [activeIndex]);

  useEffect(() => {
    let interval = setInterval(() => {
      // Уменьшаем счетчик времени каждую секунду
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(interval);
          // Действия по завершению таймера (например, вызов функции или обработка события)
        } else {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }
    }, 1000);

    // Очистка интервала при размонтировании компонента
    return () => clearInterval(interval);
  }, [minutes, seconds]);

  // Функция для добавления ведущих нулей к числам меньше 10
  const formatTime = (time: number) => {
    return time < 10 ? `0${time}` : time;
  };

  // Вытаскиваем актуальный массив c данными формы из LocalStorage
  const getDataMatchLS = localStorage.getItem("currentMatch");
  // Конвертируем массив c данными формы из JSON в JS объект
  const dataMatch: DataItem[] = getDataMatchLS && JSON.parse(getDataMatchLS);

  // Получаем логическое значение "Содержится ли в массиве из LS свойство с typeForm текущей формы?"
  const containsClassProperty = dataMatch.some((obj) =>
    obj.hasOwnProperty(typeForm)
  );

  // Функция для перехода на следующий шаг
  const handleNextStep = useCallback(
    (link: string, inputValue: string) => {
      // Обновляем состояния для красивого эффекта перехода
      setIsDisabled(true);
      setIsVisible(false);

      // Создаем новый объект, который нужно положить в массив с данными формы
      const newData = {
        id: id,
        [typeForm]: inputValue,
      };

      // Если typeForm текущей формы уже содержится в массиве, значит клиент уже отвечал на данный вопрос, и значит нужно удалить все последующие ответы (элементы массива с индексом больше индекса текущего объекта)
      if (containsClassProperty) {
        // Определяем индекс элмента массива (объекта, который появлися в массиве в результате ответа на данную форму)
        const indexOfArray = dataMatch.findIndex((obj) =>
          obj.hasOwnProperty(typeForm)
        );
        // Фильтруем массив, чтобы в нем остались элементы с индексами меньше текущего (удаляем все последующие ответы)
        const filterDataMatch = dataMatch.filter(
          (obj, index) => index < indexOfArray
        );
        // Добавляем новый объект в копию старого массива, уже отфильтрованного
        const dataToSave = [...filterDataMatch, newData];
        // Кладем новый массив в LS
        localStorage.setItem("currentMatch", JSON.stringify(dataToSave));
      } else {
        // Если typeForm текущей формы не содержится в массиве, тогда просто добавляем новый объект в массив и кладем в LS
        const dataToSave = [...dataMatch, newData];
        localStorage.setItem("currentMatch", JSON.stringify(dataToSave));
      }
      // Для красоты делаем переход через 0,4 секунды после клика
      setTimeout(() => route.push(link), 400);
    },
    [route, typeForm]
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

  // Находим объект массива с введенным телефоном
  const phoneDataMatch = dataMatch.find((obj) => obj.id === 19);
  // Вытаскиваем значение данного объека из свойства phone
  const phoneValue = phoneDataMatch ? phoneDataMatch.phone : "";

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
          <div className={styles.description}>
            {answerArray[0].title} +7{phoneValue}
          </div>

          <div className={styles.inputCodeConfirmContainer}>
            {codes.map((value, index) => (
              <input
                key={index}
                type="text"
                placeholder="•"
                value={value}
                maxLength={1}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                className={styles.inputCodeConfirm}
                disabled={index !== activeIndex}
              />
            ))}
          </div>
          <div
            className={clsx(
              styles.sendAgainContainer,
              !seconds ? styles.sendAgainActive : ""
            )}
          >
            {seconds
              ? `Отправить код ещё раз через ${formatTime(minutes)}:
            ${formatTime(seconds)}`
              : `Отправить код ещё раз`}
          </div>
        </div>
        <div className={styles.wrapButton}>
          <button
            type="button"
            onClick={() => handleNextStep(nextPageProperty, inputValue)}
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
