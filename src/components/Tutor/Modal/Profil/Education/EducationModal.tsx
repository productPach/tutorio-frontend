"use client";

import { useAppDispatch, useAppSelector } from "@/store/store";
import clsx from "clsx";
import styles from "../Fio/Fio.module.css";
import componentStyles from "./Education.module.css";
import { ChangeEvent, useState, useEffect } from "react";
import { createTutorEducation } from "@/store/features/tutorSlice";
import { setIsModalEducation } from "@/store/features/modalSlice";
import { host, port } from "@/api/server/configApi";

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

  const [selectedFiles, setSelectedFiles] = useState<(File | null)[]>([
    null,
    null,
    null,
    null,
    null,
  ]);

  const [errorInput, setErrorInput] = useState(false);

  // Состояния фокуса для каждого инпута
  const [focusedInputs, setFocusedInputs] = useState({
    educationInfo: false,
    startYear: false,
    endYear: false,
    fileInputs: Array(5).fill(false),
  });

  const handleInputEducationInfo = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-Zа-яА-ЯёЁ.\s]/g, ""); // Разрешены буквы, точки и пробелы
    setInputEducationInfo(value);
  };

  const handleInputStartYear = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setInputStartYear(value);
  };

  const handleInputEndYear = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setInputEndYear(value);
  };

  const handleFocus = (inputName: keyof typeof focusedInputs | number) => {
    if (typeof inputName === "number") {
      setFocusedInputs((prev) => {
        const newFileInputs = [...prev.fileInputs];
        newFileInputs[inputName] = true;
        return { ...prev, fileInputs: newFileInputs };
      });
    } else {
      setFocusedInputs((prev) => ({ ...prev, [inputName]: true }));
    }
  };

  const handleBlur = (inputName: keyof typeof focusedInputs | number) => {
    if (typeof inputName === "number") {
      setFocusedInputs((prev) => {
        const newFileInputs = [...prev.fileInputs];
        newFileInputs[inputName] = false;
        return { ...prev, fileInputs: newFileInputs };
      });
    } else {
      setFocusedInputs((prev) => ({ ...prev, [inputName]: false }));
    }
  };

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0] || null;
    const updatedFiles = [...selectedFiles];
    updatedFiles[index] = file;
    setSelectedFiles(updatedFiles);
  };

  const create = () => {
    if (!token || !tutor?.id || !inputStartYear || !inputEndYear) return;

    const tutorId = tutor.id;
    const educationInfo = inputEducationInfo;
    const educationStartYear = inputStartYear;
    const educationEndYear = inputEndYear;
    const isShowDiplom = true;

    const nonEmptyFiles = selectedFiles.filter((file) => file !== null);

    dispatch(
      createTutorEducation({
        tutorId,
        educationInfo,
        educationStartYear,
        educationEndYear,
        isShowDiplom,
        token,
        diploma: nonEmptyFiles, // Передаем файлы
      })
    ).unwrap();
    dispatch(setIsModalEducation(false));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !errorInput) {
      create();
    }
  };

  const isButtonDisabled =
    !inputEducationInfo.trim() ||
    !inputStartYear ||
    inputStartYear.toString().length < 4 ||
    !inputEndYear ||
    inputEndYear.toString().length < 4;

  useEffect(() => {
    setErrorInput(isButtonDisabled);
  }, [inputEducationInfo, inputStartYear, inputEndYear]);

  const handleDeletePhoto = (index: number) => {
    // Очищаем состояние selectedFiles, чтобы сбросить превью
    const updatedFiles = [...selectedFiles];
    updatedFiles[index] = null;
    setSelectedFiles(updatedFiles); // Обновляем состояние

    // Сбрасываем значение в инпуте
    const inputElement = document.querySelectorAll('input[type="file"]')[
      index
    ] as HTMLInputElement;
    if (inputElement) {
      inputElement.value = ""; // Очищаем значение инпута
    }
  };

  return (
    <>
      <div className={styles.description}>
        Укажите наименование учебного заведения
      </div>
      <div className={styles.inputContainer}>
        <input
          type="text"
          name="inputEducationInfo"
          placeholder="Например, МГТУ им. Н.Э. Баумана"
          autoComplete="off"
          value={inputEducationInfo}
          onChange={handleInputEducationInfo}
          onKeyDown={handleKeyDown}
          onFocus={() => handleFocus("educationInfo")}
          onBlur={() => handleBlur("educationInfo")}
          className={clsx(styles.input, {
            [styles.focused]: focusedInputs.educationInfo,
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
              name="inputStartYear"
              placeholder="Например, 2009"
              autoComplete="off"
              value={inputStartYear ?? ""}
              onChange={handleInputStartYear}
              onKeyDown={handleKeyDown}
              onFocus={() => handleFocus("startYear")}
              onBlur={() => handleBlur("startYear")}
              className={clsx(styles.input, {
                [styles.focused]: focusedInputs.startYear,
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
              name="inputEndYear"
              placeholder="Например, 2015"
              autoComplete="off"
              value={inputEndYear ?? ""}
              onChange={handleInputEndYear}
              onKeyDown={handleKeyDown}
              onFocus={() => handleFocus("endYear")}
              onBlur={() => handleBlur("endYear")}
              className={clsx(styles.input, {
                [styles.focused]: focusedInputs.endYear,
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
        {selectedFiles.map((file, index) => (
          <div className={componentStyles.fileWrap} key={index}>
            <div className={componentStyles.fileContainer}>
              {file ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt="Выбранное изображение"
                  className={componentStyles.imagePreview}
                />
              ) : (
                <label
                  className={clsx(componentStyles.file, {
                    [styles.focused]: focusedInputs.fileInputs[index],
                  })}
                >
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, index)}
                    onFocus={() => handleFocus(index)}
                    onBlur={() => handleBlur(index)}
                    accept="image/*"
                    style={{ display: "none" }}
                  />
                </label>
              )}
            </div>
            {file && (
              <div
                className={componentStyles.deleteFile}
                onClick={() => handleDeletePhoto(index)} // Просто передаем индекс
              >
                ✕
              </div>
            )}
          </div>
        ))}
      </div>
      <div className={styles.button}>
        <button onClick={create} type="button" disabled={isButtonDisabled}>
          Добавить
        </button>
      </div>
    </>
  );
};
