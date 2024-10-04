import React, {
  ChangeEvent,
  useCallback,
  useState,
  useRef,
  useEffect,
} from "react";
import styles from "../SignInTutor.module.css";
import animation from "../../../../app/sign-in-tutor/layout.module.css";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "@/utils/images/getCroppedImg";

interface ComponentRenderProps {
  id: number;
  typeForm: string;
  question: string;
  description: string;
  placeholder: string;
  nextPage: string;
}

type Order = {
  id: number;
  subject?: string;
  goal?: string;
  class?: string;
  deadline?: string;
  [key: string]: any;
};

interface CroppedAreaPixels {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const PhotoForm: React.FC<ComponentRenderProps> = ({
  id,
  typeForm,
  question,
  description,
  placeholder,
  nextPage,
}) => {
  const route = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] =
    useState<CroppedAreaPixels | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      setUploadError("Файл должен быть изображением.");
      return;
    }

    if (selectedFile.size > 2 * 1024 * 1024) {
      setUploadError("Размер файла не должен превышать 2MB.");
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setUploadError("");
    setIsCropping(true);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
  });

  const handleNextStep = useCallback(
    async (link: string) => {
      if (!file || !croppedAreaPixels) return;

      const croppedImage = await getCroppedImg(preview!, croppedAreaPixels);

      setTimeout(() => route.push(link), 400);
    },
    [file, route, typeForm, croppedAreaPixels, preview]
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

  const handleDeletePhoto = () => {
    setFile(null);
    setPreview(null);
    setUploadError("");
    setIsCropping(false);
  };

  const onCropComplete = (
    croppedArea: any,
    croppedAreaPixels: CroppedAreaPixels
  ) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  // Функция для сохранения обрезанного изображения
  const handleSaveCrop = async () => {
    if (croppedAreaPixels) {
      const croppedImage: string = await getCroppedImg(
        preview!,
        croppedAreaPixels
      ); // Указываем тип явно
      if (typeof croppedImage === "string") {
        setPreview(croppedImage); // Устанавливаем обрезанное изображение для отображения
        setIsCropping(false); // Заканчиваем режим обрезки
      } else {
        console.error("Oбрезанное изображение не является строкой");
      }
    }
  };

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

          {!file ? (
            <div
              {...getRootProps()}
              className={`${styles.dropzone} ${isDragActive ? styles.active : ""}`}
              onClick={() => inputRef.current?.click()}
            >
              <input {...getInputProps()} ref={inputRef} />
              <p>Перетащите изображение сюда или кликните для выбора</p>
            </div>
          ) : isCropping ? (
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "300px",
                borderRadius: "10px",
                overflow: "hidden",
              }}
            >
              <Cropper
                image={preview!}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                style={{
                  containerStyle: { borderRadius: "10px" }, // Это не обязательно, но для большей гибкости
                }}
              />
            </div>
          ) : (
            <div className={styles.imagePreview}>
              <Image
                src={preview!}
                alt="Предпросмотр загруженного изображения"
                width={200}
                height={200}
                className={styles.imagePreviewPhoto}
              />
              <div className={styles.buttonContainer}>
                <button
                  type="button"
                  onClick={handleDeletePhoto}
                  className={styles.buttonTextClose}
                >
                  ✕ Удалить фото
                </button>
              </div>
            </div>
          )}
          {uploadError && (
            <div className={styles.errorInputText}>{uploadError}</div>
          )}
          {/* Кнопки "Сохранить" и "Удалить" под областью обрезки */}
          {isCropping && (
            <div className={styles.wrapButtonPhoto}>
              <button onClick={handleSaveCrop} className={styles.buttonBlack}>
                Сохранить
              </button>
              <button
                onClick={handleDeletePhoto}
                className={styles.buttonTextClose}
              >
                ✕ Загрузить другое фото
              </button>
            </div>
          )}
        </div>

        <div className={styles.wrapButtonStandart}>
          <button
            type="button"
            onClick={() => handleNextStep(nextPage)}
            className={styles.continueButton}
            disabled={!file || isCropping || !croppedAreaPixels} // Дизейблим кнопку, если нет файла или не обрезана фотография
          >
            Продолжить
          </button>
        </div>
      </div>

      <input
        type="file"
        ref={inputRef}
        style={{ display: "none" }}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          if (e.target.files) {
            onDrop(Array.from(e.target.files));
          }
        }}
      />
    </>
  );
};
