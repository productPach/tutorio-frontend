"use client";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import styles from "../SignInTutor.module.css";
import animation from "../../../../app/sign-in-tutor/layout.module.css";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { updateTutor } from "@/store/features/tutorSlice";

interface ComponentRenderProps {
  id: number;
  typeForm: string;
  question: string;
  description: string;
  placeholder: string;
  nextPage: string;
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

export const EmailInputForms: React.FC<ComponentRenderProps> = ({
  id,
  typeForm,
  question,
  description,
  placeholder,
  nextPage,
}) => {
  const route = useRouter();
  const dispatch = useAppDispatch();
  // Получаем значение tutor из Redux
  const token = useAppSelector((state) => state.auth.token);
  const tutor = useAppSelector((state) => state.tutor.tutor);
  const status = "Rega: Photo";

  // Состояние текстового поля
  const [inputValue, setInputValue] = useState("");
  // Состояние для ошибки текстового поля
  const [errorInput, setErrorInput] = useState(false);

  const handleInputValue = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value); // Обновляем состояние значения поля ввода
  };

  // Вытаскиваем актуальный массив c данными формы из LocalStorage
  const getDataUserLS = localStorage.getItem("current-user");
  // Конвертируем массив c данными формы из JSON в JS объект
  const dataUser: Order[] = getDataUserLS ? JSON.parse(getDataUserLS) : [];

  // Получаем логическое значение "Содержится ли в массиве из LS свойство с typeForm текущей формы?"
  const containsClassProperty = dataUser.some((obj) =>
    obj.hasOwnProperty(typeForm)
  );

  const clickNext = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Регулярное выражение для валидации email

    if (emailRegex.test(inputValue)) {
      setErrorInput(false); // Если email валиден, устанавливаем ошибку в false
      updateDataTutor(inputValue);
    } else {
      setErrorInput(true); // Если email не валиден, устанавливаем ошибку в true
    }
  };

  // Обновление данных репетитора
  const updateDataTutor = (email: string) => {
    const id = tutor?.id;
    if (token && id) {
      dispatch(updateTutor({ id, token, status, email })).unwrap;
      handleNextStep(nextPage, email);
    } else {
      console.log("Нет токена");
    }
  };

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
    const currentDataUser = dataUser.find((obj) => obj.id === id);

    // Вытаскиваем значение данного объека из свойства, которое совпадает с typeForm (чтобы сделать checked выбранный ранее вариант ответа)
    const valueProperty = currentDataUser ? currentDataUser[typeForm] : "";
    setInputValue(valueProperty);
  }, [typeForm]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        // Регулярное выражение для валидации email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Проверяем, соответствует ли inputValue формату email
        if (emailRegex.test(inputValue)) {
          setErrorInput(false); // Если email валиден, устанавливаем ошибку в false
          updateDataTutor(inputValue); // Обновляем данные с email
        } else {
          setErrorInput(true); // Если email не валиден, устанавливаем ошибку в true
        }
      }
    };

    setErrorInput(false);

    const input = document.getElementById("fioTutor");
    input?.addEventListener("keydown", handleKeyDown);

    return () => {
      input?.removeEventListener("keydown", handleKeyDown);
    };
  }, [inputValue, nextPage]);

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
          <div className={styles.description}>{description}</div>
          <input
            id="fioTutor"
            type="email"
            inputMode="email" // ✅ Улучшает поддержку на Android
            autoComplete="email" // ✅ Автозаполнение email'а
            placeholder={placeholder}
            value={inputValue}
            onChange={handleInputValue}
            className={clsx(styles.inputUniversityName, {
              [styles.errorInput]: errorInput,
            })}
            maxLength={250}
          />
          {errorInput ? (
            <>
              <div className={styles.errorInputText}>
                Пожалуйста, введите действительный адрес электронной почты.
              </div>
              <div className={styles.errorInputText}>Формат: name@mail.ru</div>
            </>
          ) : null}
        </div>
        <div className={styles.wrapButton}>
          <button
            type="button"
            onClick={() => clickNext()}
            className={styles.continueButton}
            disabled={inputValue.length < 3 || errorInput}
          >
            Продолжить
          </button>
        </div>
      </div>
    </>
  );
};
