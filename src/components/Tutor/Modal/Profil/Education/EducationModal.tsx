"use client";

import { useAppDispatch, useAppSelector } from "@/store/store";
import clsx from "clsx";
import styles from "../Fio/Fio.module.css";
import componentStyles from "./Education.module.css";
import { ChangeEvent, useState, useEffect } from "react";
import { createTutorEducation } from "@/store/features/tutorSlice";
import { setIsModalEducation } from "@/store/features/modalSlice";

interface EducationModalProps {
  educationId: string | null;
}

export const EducationModal = ({ educationId }: EducationModalProps) => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const tutor = useAppSelector((state) => state.tutor.tutor);

  const [inputEducationInfo, setInputEducationInfo] = useState(() => {
    if (educationId && tutor?.educations) {
      const education = tutor.educations.find((edu) => edu.id === educationId);
      return education?.educationInfo || "";
    }
    return "";
  });

  const [inputStartYear, setInputStartYear] = useState(() => {
    if (educationId && tutor?.educations) {
      const education = tutor.educations.find((edu) => edu.id === educationId);
      return education?.educationStartYear || null;
    }
    return null;
  });

  const [inputEndYear, setInputEndYear] = useState(() => {
    if (educationId && tutor?.educations) {
      const education = tutor.educations.find((edu) => edu.id === educationId);
      return education?.educationEndYear || null;
    }
    return null;
  });

  const [errorInput, setErrorInput] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleInputEducationInfo = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-Zа-яА-ЯёЁ.\s]/g, ""); // Разрешены буквы, точки и пробелы
    setInputEducationInfo(value);
  };

  const handleInputStartYear = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    // Преобразуем строку в число (или оставляем null, если строка пуста)
    setInputStartYear(value ? parseInt(value, 10) : null);
  };

  const handleInputEndYear = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    // Преобразуем строку в число (или оставляем null, если строка пуста)
    setInputEndYear(value ? parseInt(value, 10) : null);
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const create = () => {
    if (!token || !tutor?.id || !inputStartYear || !inputEndYear) return;

    const tutorId = tutor.id;
    const educationInfo = inputEducationInfo;
    const educationStartYear = +inputStartYear;
    const educationEndYear = +inputEndYear;
    const educationDiplomUrl = "/url";
    const isShowDiplom = true;

    dispatch(
      createTutorEducation({
        tutorId,
        educationInfo,
        educationStartYear,
        educationEndYear,
        educationDiplomUrl,
        isShowDiplom,
        token,
      })
    ).unwrap();
    dispatch(setIsModalEducation(false));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !errorInput) {
      create();
    }
  };

  // Определяем, должна ли быть кнопка задизейблена
  const isButtonDisabled =
    !inputEducationInfo.trim() ||
    !inputStartYear ||
    inputStartYear.toString().length < 4 ||
    !inputEndYear ||
    inputEndYear.toString().length < 4;

  useEffect(() => {
    setErrorInput(isButtonDisabled);
  }, [inputEducationInfo, inputStartYear, inputEndYear]);

  return (
    <>
      <div className={styles.description}>
        Укажите наименование учебного заведения
      </div>
      <div className={styles.inputContainer}>
        <input
          type="text"
          placeholder={"Например, МГТУ им. Н.Э. Баумана"}
          autoComplete="off"
          value={inputEducationInfo}
          onChange={handleInputEducationInfo}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={clsx(styles.input, {
            [styles.focused]: isFocused,
            [styles.errorInput]: errorInput,
          })}
          maxLength={255}
        />
      </div>
      <div className={componentStyles.containerEducationYears}>
        <div className={componentStyles.containerYear}>
          <div className={styles.description}>Год начала обучения</div>
          <div className={styles.inputContainer}>
            <input
              type="text"
              placeholder={"Например, 2009"}
              autoComplete="off"
              value={inputStartYear ?? ""}
              onChange={handleInputStartYear}
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className={clsx(styles.input, {
                [styles.focused]: isFocused,
                [styles.errorInput]: errorInput,
              })}
              maxLength={4}
            />
          </div>
        </div>
        <div className={componentStyles.containerYear}>
          <div className={styles.description}>Год окончания обучения</div>
          <div className={styles.inputContainer}>
            <input
              type="text"
              placeholder={"Например, 2015"}
              autoComplete="off"
              value={inputEndYear ?? ""}
              onChange={handleInputEndYear}
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className={clsx(styles.input, {
                [styles.focused]: isFocused,
                [styles.errorInput]: errorInput,
              })}
              maxLength={4}
            />
          </div>
        </div>
      </div>
      <div className={styles.description}>
        Диплом, сертификат и другие документы
      </div>
      <div className={componentStyles.containerFlxRw}>
        <input className={componentStyles.file} type="file" />
        <input className={componentStyles.file} type="file" />
        <input className={componentStyles.file} type="file" />
        <input className={componentStyles.file} type="file" />
        <input className={componentStyles.file} type="file" />
      </div>
      <div className={styles.button}>
        <button onClick={create} type="button" disabled={isButtonDisabled}>
          Добавить
        </button>
      </div>
    </>
  );
};
