import { useAppDispatch, useAppSelector } from "@/store/store";
import clsx from "clsx";
import styles from "../Fio/Fio.module.css";
import stylesGen from "../../../../../app/tutor/layout.module.css";
import componentStyles from "./Education.module.css";
import { ChangeEvent, useState, useEffect } from "react";
import {
  deletePhotoTutorEducation,
  updateTutorEducation,
} from "@/store/features/tutorSlice";
import { setIsModalEditEducation } from "@/store/features/modalSlice";
import { getBackendUrl, host, port } from "@/api/server/configApi";
import Image from "next/image";

interface EducationModalProps {
  educationId: string | null;
  educationIndex: number;
}

export const EditEducationModal = ({
  educationId,
  educationIndex,
}: EducationModalProps) => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const tutor = useAppSelector((state) => state.tutor.tutor);

  // Состояния для ввода
  const [inputEducationInfo, setInputEducationInfo] = useState("");
  const [inputStartYear, setInputStartYear] = useState<string | null>(null);
  const [inputEndYear, setInputEndYear] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<(File | string | null)[]>([
    null,
    null,
    null,
    null,
    null,
  ]); // 5 элементов
  const [errorInput, setErrorInput] = useState(false);
  const [focusedInputs, setFocusedInputs] = useState({
    educationInfo: false,
    startYear: false,
    endYear: false,
    fileInputs: Array(5).fill(false),
  });

  // Состояние для свитча
  const [isChecked, setIsChecked] = useState(
    tutor?.educations?.[educationIndex]?.isShowDiplom || false
  );

  const toggleSwitch = () => {
    setIsChecked(!isChecked);
  };

  // Загрузка данных для редактирования
  useEffect(() => {
    if (educationId && tutor?.educations) {
      const education = tutor.educations.find((edu) => edu.id === educationId);
      if (education) {
        setInputEducationInfo(education.educationInfo);
        setInputStartYear(education.educationStartYear?.toString() || "");
        setInputEndYear(education.educationEndYear?.toString() || "");

        // Загружаем URL изображений (если они есть)
        const files = education.educationDiplomUrl.map(
          (url) => `${getBackendUrl()}${url}`
        );

        // Если файлов меньше 5, добавляем недостающие null
        const fileArray = [...files, ...Array(5 - files.length).fill(null)];

        setSelectedFiles(fileArray); // Обновляем состояние с 5 элементами (фотографии или null)
      }
    }
  }, [educationId, tutor?.educations, host, port]);

  const handleInputEducationInfo = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-Zа-яА-ЯёЁ.\s]/g, ""); // Разрешаем только буквы, точки и пробелы
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
    if (file) {
      const updatedFiles = [...selectedFiles];
      updatedFiles[index] = file; // Добавляем или заменяем фотографию на соответствующем индексе
      setSelectedFiles(updatedFiles);
    }
  };

  const update = () => {
    if (
      !token ||
      !tutor?.id ||
      !educationId ||
      !inputStartYear ||
      !inputEndYear
    )
      return;

    const tutorId = tutor.id;
    const educationInfo = inputEducationInfo;
    const educationStartYear = inputStartYear;
    const educationEndYear = inputEndYear;
    const isShowDiplom = isChecked; // Это поле по умолчанию

    // Массив фотографий, состоящий из старых фотографий с сервера и новых, выбранных пользователем
    const nonEmptyFiles = selectedFiles.filter(
      (file): file is File => file instanceof File
    );

    dispatch(
      updateTutorEducation({
        tutorId,
        educationId, // ID для обновления
        educationInfo,
        educationStartYear,
        educationEndYear,
        isShowDiplom,
        token,
        diploma: nonEmptyFiles, // Загружаем все файлы, старые и новые
      })
    )
      .unwrap()
      .then(() => {
        dispatch(setIsModalEditEducation(false)); // Закрытие модального окна после успешного обновления
      })
      .catch((error) => {
        console.error("Ошибка при обновлении образования:", error);
      });
  };

  const handleDeletePhoto = async (file: string | File, index: number) => {
    let fileUrl = ""; // Переменная для хранения URL файла, если это изображение с сервера

    if (typeof file === "string") {
      // Если это строка, то это изображение с сервера, извлекаем URL
      fileUrl = file.split("/").pop() || ""; // Извлекаем имя файла из URL
    } else if (file instanceof File) {
      // Если это объект File, то можно работать с его именем (если нужно)
      fileUrl = file.name; // Для файлов можно использовать имя файла
    }

    const tutorId = tutor?.id;

    const updatedFiles = [...selectedFiles];

    if (fileUrl && tutorId && educationId && token) {
      try {
        if (typeof file === "string") {
          // Если это файл с сервера, удаляем его через API
          await dispatch(
            deletePhotoTutorEducation({
              tutorId,
              educationId,
              fileUrl,
              token,
            })
          ).unwrap();
        }

        // После успешного удаления с сервера или просто очистки, обновляем локальное состояние
        updatedFiles[index] = null;
        setSelectedFiles(updatedFiles);
      } catch (error) {
        console.error("Ошибка при удалении файла:", error);
      }
    }
  };

  useEffect(() => {
    if (tutor?.educations && educationId) {
      const education = tutor.educations.find((edu) => edu.id === educationId);
      if (education) {
        const files = education.educationDiplomUrl.map(
          (url) => `${getBackendUrl()}${url}`
        );
        const fileArray = [...files, ...Array(5 - files.length).fill(null)];
        setSelectedFiles(fileArray); // Синхронизация с Redux
      }
    }
  }, [tutor?.educations, educationId]);

  // Валидация кнопки
  const isButtonDisabled =
    !inputEducationInfo.trim() ||
    !inputStartYear ||
    inputStartYear.length < 4 ||
    !inputEndYear ||
    inputEndYear.length < 4;

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
          name="inputEducationInfo"
          placeholder="Например, МГТУ им. Н.Э. Баумана"
          autoComplete="off"
          value={inputEducationInfo}
          onChange={handleInputEducationInfo}
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
        Диплом, сертификат и другие документы!
      </div>
      <div className={componentStyles.containerFlxRw}>
        {selectedFiles.map((file, index) => (
          <div className={componentStyles.fileWrap} key={index}>
            <div className={componentStyles.fileContainer}>
              {file ? (
                typeof file === "string" ? (
                  <>
                    <Image
                      key={index}
                      src={`${file}`}
                      alt={`Документ ${index + 1}`}
                      width={68}
                      height={68}
                      className={componentStyles.imagePreview}
                    />
                    {/* <img
                      src={`${getBackendUrl()}file`} // Показываем изображение с сервера
                      alt={`Документ ${index + 1}`}
                      className={componentStyles.imagePreview}
                    /> */}
                  </>
                ) : (
                  <Image
                    src={URL.createObjectURL(file)} // Показываем локально загруженное изображение
                    alt={`Документ ${index + 1}`}
                    className={componentStyles.imagePreview}
                  />
                )
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
                onClick={() => handleDeletePhoto(file, index)}
              >
                ✕
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedFiles.some((file) => file !== null) && (
        <div className={stylesGen.containerEntityShow}>
          <div className={styles.inputContainer}>
            <label className={stylesGen.iosSwitch}>
              <input
                type="checkbox"
                checked={isChecked}
                onChange={toggleSwitch}
              />
              <span className={stylesGen.slider}></span>
            </label>
          </div>
          <div className={styles.description2}>
            Показывать документы всем пользователям
          </div>
        </div>
      )}

      <div className={styles.button}>
        <button onClick={update} type="button" disabled={isButtonDisabled}>
          Изменить
        </button>
      </div>
    </>
  );
};
