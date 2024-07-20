"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./SelectSubject.module.css";
import { getSubjectListForSearch } from "@/api/subjects/apiSubjcts";
import { useRouter } from "next/navigation";
import { Spinner } from "../Spinner/Spinner";
import { Subject } from "@/types/types";

interface ComponentProps {
  handleScrollToSubject: Function;
}

export const Search: React.FC<ComponentProps> = ({ handleScrollToSubject }) => {
  // Состояние для отслеживания строки поиска предмета
  const [inputSearchTutor, setInputSearchTutor] = useState("");
  // Состояние для получения результатов поиска
  const [resultSearchTutor, setResultSearchTutor] = useState<Subject[]>([]);
  // Состояние для ошибки, если не найден предмет
  const [errorSubject, setErrorSubject] = useState(false);
  // Состояние для получения индекса выделенного элемента
  const [resultSubjectIndex, setResultSubjectIndex] = useState(0);
  // Получаем ссылку в DOM на элемент в выпадающем списке, чтобы перемещать скролл к данному элементу при выделении
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  // Состояние для лоадера
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const linkApplicationSubject = useCallback(
    (id: string, category: string) => {
      handleScrollToSubject(id, category);
    },
    [handleScrollToSubject]
  );

  // Функция для подставления предмета в поле поиска по клику + прокидываем флоу дальше
  const handleSubject = useCallback(
    (id: string, subject: string, category: string) => {
      setIsLoading(true);
      // Очищаем предыдущие данные заявок из LS, если они есть
      localStorage.removeItem("currentMatch");
      // Очищаем предыдущие данные по таймеру
      localStorage.removeItem("confirm-time");
      // Очищаем предыдущие данные телефона
      localStorage.removeItem("origin-phone");
      setInputSearchTutor(subject);
      // Очищаем результаты, чтобы скрыть подсказки
      setResultSearchTutor([]);
      // Создаем новый объект для добавления в LS
      const dataToSave = [
        {
          id: 0,
          subject: subject,
        },
      ];
      // Добавляем объект в LS
      localStorage.setItem("currentMatch", JSON.stringify(dataToSave));
      // Делаем задержку, чтобы был красивый переход
      setTimeout(() => {
        linkApplicationSubject(id, category);
        setIsLoading(false);
        setInputSearchTutor("");
      }, 1000 * 0.3);
    },
    [linkApplicationSubject]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        setResultSubjectIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % resultSearchTutor.length;

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
        setResultSubjectIndex((prevIndex) => {
          const nextIndex =
            (prevIndex - 1 + resultSearchTutor.length) %
            resultSearchTutor.length;

          // Прокручиваем к следующему элементу
          itemRefs.current[nextIndex]?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
          return nextIndex;
        });
      }

      if (e.key === "Enter" && resultSearchTutor.length > 0) {
        handleSubject(
          resultSearchTutor[resultSubjectIndex].id_p,
          resultSearchTutor[resultSubjectIndex].title,
          resultSearchTutor[resultSubjectIndex].id_cat
        );
      }

      if (e.key === "Enter" && resultSearchTutor.length === 0) {
        setErrorSubject(true);
      }

      if (e.key === "Backspace" || resultSearchTutor.length > 0) {
        setErrorSubject(false);
      }
    };
    const input = document.getElementById("subjectInput");
    input?.addEventListener("keydown", handleKeyDown);

    return () => {
      input?.removeEventListener("keydown", handleKeyDown);
    };
  }, [resultSearchTutor, resultSubjectIndex, handleSubject]);

  // Функция для запроса данных с сервера после изменения поля с поиском
  const handleSearchTutor = async (subject: string) => {
    setInputSearchTutor(subject);
    try {
      const result: Subject[] = await getSubjectListForSearch(subject);
      setResultSearchTutor(result);
      setResultSubjectIndex(0); // Сброс индекса при каждом новом поиске
    } catch (error) {
      error instanceof Error
        ? console.log(error.message)
        : console.log("Неизвестная ошибка:", error);
    }
  };

  return (
    <div className={styles.firstSection__tutorSearch2}>
      <div className={styles.searchContainer}>
        <input
          id="subjectInput"
          type="text"
          placeholder="Введите название предмета"
          autoComplete="off"
          value={inputSearchTutor}
          onChange={(e) => handleSearchTutor(e.target.value)}
          className={errorSubject ? styles.errorInput : undefined}
        />
        {isLoading && (
          <div className={styles.spinner2}>
            <Spinner />
          </div>
        )}
        {errorSubject ? (
          <div className={styles.errorInputText}>
            Пожалуйста, выберите предмет из выпадающего списка
          </div>
        ) : null}
        {resultSearchTutor.length > 0 && inputSearchTutor.length > 1 && (
          <div className={styles.resultContainerTutorSearch}>
            <ul>
              {resultSearchTutor.map((item, index) => {
                return (
                  <React.Fragment key={item.id_p}>
                    {errorSubject ? <div>errorSubject</div> : null}
                    <li
                      key={item.id}
                      onClick={() =>
                        handleSubject(item.id_p, item.title, item.id_cat)
                      }
                      className={`${styles.resultTutorSearch} ${
                        index === resultSubjectIndex ? styles.highlight : ""
                      }`}
                      ref={(el) => {
                        itemRefs.current[index] = el;
                      }}
                    >
                      {item.title}
                    </li>
                  </React.Fragment>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
