"use client";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import styles from "../SignInTutor.module.css";
import animation from "../../../../app/sign-in-tutor/layout.module.css";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import Image from "next/image";
import { data } from "@/utils/listSubjects";
import { SubjectItem } from "./SubjectItem";
import { SelectSubject } from "@/components/SelectSubject/SelectSubject";

interface ComponentProps {
  id: number;
  typeForm: string;
  question: string;
  description: string;
  placeholder: string;
  nextPage: string;
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

export const SubjectsForms: React.FC<ComponentProps> = ({
  id,
  typeForm,
  question,
  description,
  placeholder,
  nextPage,
}) => {
  const route = useRouter();

  const [listSubjectChecked, setListSubjectChecked] = useState<string[]>([]);
  // Состояние текстового поля
  const [inputValue, setInputValue] = useState("");
  // Состояние для ошибки текстового поля
  const [errorInput, setErrorInput] = useState(false);

  const handleSubjectCheckedChange = useCallback(
    (subjectId: string, isChecked: boolean) => {
      setListSubjectChecked((prev) => {
        if (isChecked) {
          return prev.includes(subjectId) ? prev : [...prev, subjectId];
        } else {
          return prev.filter((id) => id !== subjectId);
        }
      });
    },
    []
  );

  // Импортируем предметы
  const listSubjects = data;
  // Предметы-категории
  const listCategorySubjects = listSubjects.filter(
    (subject) => subject.general
  );

  // Функция для валидации значения поля
  const handleInputValue = (e: ChangeEvent<HTMLInputElement>) => {
    if (/^[a-zA-Zа-яА-Я' ]+$/.test(e.target.value)) {
      setErrorInput(false);
    } else {
      setErrorInput(true);
    }
    setInputValue(e.target.value);
  };

  // Вытаскиваем актуальный массив c данными формы из LocalStorage
  const getDataUserLS = localStorage.getItem("current-user");
  // Конвертируем массив c данными формы из JSON в JS объект
  const dataUser: DataItem[] = getDataUserLS ? JSON.parse(getDataUserLS) : [];

  // Получаем логическое значение "Содержится ли в массиве из LS свойство с typeForm текущей формы?"
  const containsClassProperty = dataUser.some((obj) =>
    obj.hasOwnProperty(typeForm)
  );

  // Функция для перехода на следующий шаг
  const handleNextStep = useCallback(
    (link: string, inputValue: string) => {
      // Обновляем состояния для красивого эффекта перехода
      setIsDisabled(true);
      setIsVisible(false);

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

  useEffect(() => {
    // Создаем новый объект, который нужно положить в массив с данными формы
    const newData = {
      id: id,
      [typeForm]: listSubjectChecked,
    };

    // Если typeForm текущей формы уже содержится в массиве, значит клиент уже отвечал на данный вопрос, и значит нужно удалить все последующие ответы (элементы массива с индексом больше индекса текущего объекта)
    if (containsClassProperty) {
      // Определяем индекс элмента массива (объекта, который появлися в массиве в результате ответа на данную форму)
      const indexOfArray = dataUser.findIndex((obj) =>
        obj.hasOwnProperty(typeForm)
      );
      // Фильтруем массив, чтобы в нем остались элементы с индексами меньше текущего (удаляем все последующие ответы)
      const filterDataUser = dataUser.filter(
        (obj, index) => index < indexOfArray
      );
      // Добавляем новый объект в копию старого массива, уже отфильтрованного
      const dataToSave = [...filterDataUser, newData];
      // Кладем новый массив в LS
      localStorage.setItem("current-user", JSON.stringify(dataToSave));
    } else {
      // Если typeForm текущей формы не содержится в массиве, тогда просто добавляем новый объект в массив и кладем в LS
      const dataToSave = [...dataUser, newData];
      localStorage.setItem("current-user", JSON.stringify(dataToSave));
    }
  }, [listSubjectChecked]);

  const [isVisible, setIsVisible] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []); // Анимация будет стартовать после монтирования компонента

  useEffect(() => {
    // Находим объект массива по ID вопроса (формы)
    const currentDataUser = dataUser.find((obj) => obj.id === id);

    // Вытаскиваем значение данного объека из свойства, которое совпадает с typeForm (чтобы сделать checked выбранный ранее вариант ответа)
    const valueProperty = currentDataUser ? currentDataUser[typeForm] : "";
    setListSubjectChecked(valueProperty);
  }, [typeForm]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        // Проверяем, содержит ли inputValue только допустимые символы
        if (/^[a-zA-Zа-яА-Я' ]+$/.test(inputValue)) {
          setErrorInput(false);
          handleNextStep(nextPage, inputValue);
        } else {
          setErrorInput(true);
        }
      }
    };

    const input = document.getElementById("fioTutor");
    input?.addEventListener("keydown", handleKeyDown);

    return () => {
      input?.removeEventListener("keydown", handleKeyDown);
    };
  }, [inputValue, handleNextStep, nextPage]);
  return (
    <>
      <div
        className={`${styles.container} ${isVisible ? animation.visible : animation.hidden}`}
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
          <input
            id="fioTutor"
            type="text"
            placeholder={placeholder}
            autoComplete="off"
            value={inputValue}
            onChange={handleInputValue}
            className={clsx(styles.inputUniversityName, {
              [styles.errorInput]: errorInput,
            })}
            maxLength={250}
          />
          {/* <SelectSubject /> */}
          <div className={styles.description}></div>
          <div className={styles.containerAnswers}>
            {listCategorySubjects.map((category) => {
              const subjectsInCategory = listSubjects.filter(
                (subject) => subject.id_cat === category.id_cat
              );
              const countSubjectsInCategory = subjectsInCategory.length;
              return (
                <React.Fragment key={category.id_p}>
                  <SubjectItem
                    id={id}
                    typeForm={typeForm}
                    category={category}
                    subjectsInCategory={subjectsInCategory}
                    countSubjectsInCategory={countSubjectsInCategory}
                    listSubjectChecked={listSubjectChecked}
                    onSubjectCheckedChange={handleSubjectCheckedChange}
                  />
                </React.Fragment>
              );
            })}
          </div>
        </div>
        <div className={styles.wrapButton}>
          <button
            type="button"
            onClick={() => handleNextStep(nextPage, inputValue)}
            className={styles.continueButton}
            disabled={listSubjectChecked.length < 1}
          >
            Продолжить
          </button>
        </div>
      </div>
    </>
  );
};
