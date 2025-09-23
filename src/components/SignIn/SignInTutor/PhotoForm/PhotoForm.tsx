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
import { updateTutor, updateTutorAvatar } from "@/store/features/tutorSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import clsx from "clsx";

interface ComponentRenderProps {
  id: number;
  typeForm: string;
  question: string;
  description: string;
  placeholder: string;
  nextPage: string;
}

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
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const tutor = useAppSelector((state) => state.tutor.tutor);
  const cookiesAccepted = useAppSelector((state) => state.general.cookies);
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

    if (selectedFile.size > 5 * 1024 * 1024) {
      setUploadError("Размер файла не должен превышать 5MB.");
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

  const updateDataTutor = async (
    croppedImageBase64: File,
    croppedAreaPixels: CroppedAreaPixels
  ) => {
    const id = tutor?.id;
    if (token && id) {
      try {
        const status = "Pending";
        await dispatch(
          updateTutorAvatar({
            id,
            file: croppedImageBase64,
            token,
            croppedAreaPixels, // передаем croppedAreaPixels
          })
        ).unwrap();
        dispatch(updateTutor({ id, status })).unwrap;

        // После успешного обновления аватара перенаправляем пользователя
        route.push("/tutor/orders");
      } catch (error) {
        console.error("Ошибка при обновлении аватара:", error);
      }
    } else {
      console.log("Нет токена или файла");
    }
  };

  const getImageDimensions = async (
    src: string
  ): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
      const img = document.createElement("img");
      img.src = src;
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
    });
  };

  const handleNextStep = useCallback(
    async (link: string) => {
      if (!file || !croppedAreaPixels || !preview) return;

      const croppedFile = base64ToFile(preview, "cropped_avatar.png"); // Преобразуем Base64 в File

      await updateDataTutor(croppedFile, croppedAreaPixels); // Передаем файл в функцию
    },
    [croppedAreaPixels, file, preview]
  );

  const base64ToFile = (base64: string, filename: string): File => {
    const arr = base64.split(",");
    const mimeMatch = arr[0].match(/:(.*?);/); // Сохраняем результат match

    if (!mimeMatch) {
      throw new Error("Не удалось извлечь MIME-тип из Base64"); // Обработка ошибки
    }

    const mime = mimeMatch[1]; // Получаем MIME-тип
    const bstr = atob(arr[1]); // Декодируем Base64
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  };

  const handleSaveCrop = async () => {
    if (croppedAreaPixels && preview) {
      // Получаем размеры изображения
      const { width: canvasWidth, height: canvasHeight } =
        await getImageDimensions(preview);

      //console.log("Исходные размеры:", canvasWidth, canvasHeight);
      //console.log("Размеры обрезки:", croppedAreaPixels);

      // Используем canvasWidth и canvasHeight для передачи в getCroppedImg
      const croppedImageBase64 = await getCroppedImg(
        preview,
        croppedAreaPixels,
        canvasHeight,
        canvasWidth
      );

      //console.log("Полученное обрезанное изображение:", croppedImageBase64);
      setPreview(croppedImageBase64); // Показываем превью
      setIsCropping(false);
    }
  };

  const handlePrevStep = () => {
    route.back();
  };

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

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
              <p className={styles.photoDescription}>
                Перетащите изображение сюда или{`\u00A0`}кликните для{`\u00A0`}
                выбора
              </p>
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
                  containerStyle: { borderRadius: "10px" },
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

        <div
          className={clsx(styles.wrapButtonStandart, {
            [styles.wrapButtonStandart_with_cookies]: !cookiesAccepted,
          })}
        >
          <button
            type="button"
            onClick={() => handleNextStep(nextPage)}
            className={styles.continueButton}
            disabled={!file || isCropping || !croppedAreaPixels}
          >
            Продолжить
          </button>
        </div>
      </div>

      <input
        type="file"
        ref={inputRef}
        style={{ display: "none" }}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          if (event.target.files) {
            onDrop(Array.from(event.target.files));
          }
        }}
      />
    </>
  );
};
