"use client";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import styles from "../Match.module.css";
import animation from "../../../app/match/layout.module.css";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { SelectSubject } from "@/components/SelectSubject/SelectSubject";

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

export const SubjectInputForms: React.FC<ComponentRenderProps> = ({
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

  // Функция для валидации значения поля
  const handleInputValue = (e: ChangeEvent<HTMLInputElement>) => {
    if (/[^\d]/.test(e.target.value)) {
      setErrorInput(true);
    } else {
      setErrorInput(false);
    }
    setInputValue(e.target.value);
  };

  // Вытаскиваем актуальный массив c данными формы из LocalStorage
  const getDataMatchLS = localStorage.getItem("currentMatch");
  // Конвертируем массив c данными формы из JSON в JS объект
  const dataMatch: Order[] = getDataMatchLS ? JSON.parse(getDataMatchLS) : [];

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
      // Проверяем, содержит ли inputValue только цифры
      const isValidInput = /^\d+$/.test(inputValue);
      if (e.key === "Enter") {
        if (isValidInput) {
          handleNextStep(nextPageProperty, inputValue);
        } else {
          setErrorInput(true);
        }
      }
    };

    const input = document.getElementById("stydentYears");
    input?.addEventListener("keydown", handleKeyDown);

    return () => {
      input?.removeEventListener("keydown", handleKeyDown);
    };
  }, [inputValue]);

  const handleNavigation = useCallback(
    (link: string, itemGoal?: string, itemId_p?: string) => {
      localStorage.removeItem("currentMatch");
      localStorage.removeItem("confirm-time");
      localStorage.removeItem("origin-phone");

      // Используем данные конкретного элемента (если переданы), иначе данные главной категории
      const finalGoal = itemGoal;
      const finalId_p = itemId_p;

      // Формируем dataToSave в зависимости от наличия goal и id_p
      const dataToSave = [];

      if (finalId_p) {
        dataToSave.push({ id: 0, subject: finalId_p });
      }

      if (finalGoal) {
        dataToSave.push({ id: 1, goal: finalGoal });
      }

      localStorage.setItem("currentMatch", JSON.stringify(dataToSave));
      document.body.style.overflow = "auto";
      route.push(link);
    },
    [route]
  );

  interface SubjectItem {
    name: string;
    link: string;
    id_p?: string;
    goal?: string;
  }

  const subjects: SubjectItem[] = [
    {
      name: "Математика",
      link: "/match/goal/school-subjects",
      id_p: "366",
    },
    {
      name: "Русский язык",
      link: "/match/goal/school-subjects",
      id_p: "614",
    },
    {
      name: "Подготовка к ОГЭ",
      link: "/match/subject/oge",
      goal: "Подготовка к ОГЭ",
    },
    {
      name: "Подготовка к ЕГЭ",
      link: "/match/subject/ege",
      goal: "Подготовка к ЕГЭ",
    },
    {
      name: "Английский язык",
      link: "/match/goal/english",
      id_p: "5",
    },
    {
      name: "Обществознание",
      link: "/match/goal/school-subjects",
      id_p: "506",
    },
    {
      name: "Химия",
      link: "/match/goal/school-subjects",
      id_p: "685",
    },
    {
      name: "Биология",
      link: "/match/goal/school-subjects",
      id_p: "43",
    },
  ];

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
            Начните с выбора предмета — мы найдем лучших репетиторов именно для
            ваших целей
          </div>
          <SelectSubject inputBgBlue={true} />

          <div className={styles.description2}>
            Или выберите один из предложенных ниже популярных предметов:
          </div>

          <div className={styles.containerSubject}>
            {subjects.map((subject, index) => (
              <div
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation(
                    subject.link,
                    subject.goal || "",
                    subject.id_p
                  );
                }}
                key={index}
                className={styles.containerSubjectItem}
              >
                {subject.name}
              </div>
            ))}
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
