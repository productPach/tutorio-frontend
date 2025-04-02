import stylesTutor from "../../../../app/tutor/layout.module.css";
import componentStyle from "./Photo.module.css";
import { useAppDispatch, useAppSelector } from "@/store/store";
import Image from "next/image";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { getCroppedImg } from "@/utils/images/getCroppedImg";
import { updateTutor, updateTutorAvatar } from "@/store/features/tutorSlice";
import { CroppedAreaPixels } from "@/types/types";
import { useDropzone } from "react-dropzone";
import Cropper from "react-easy-crop";
import styles from "../../../SignIn/SignInTutor/SignInTutor.module.css";
import { host, port } from "@/api/server/configApi";

export const Photo = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const tutor = useAppSelector((state) => state.tutor.tutor);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] =
    useState<CroppedAreaPixels | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [isCropSaved, setIsCropSaved] = useState(false); // Состояние, отслеживающее завершение обрезки

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

  const updateDataTutor = async (
    croppedImageBase64: File,
    croppedAreaPixels: CroppedAreaPixels
  ) => {
    const id = tutor?.id;
    if (token && id) {
      try {
        await dispatch(
          updateTutorAvatar({
            id,
            file: croppedImageBase64,
            token,
            croppedAreaPixels,
          })
        ).unwrap();
        dispatch(updateTutor({ id, token })).unwrap;
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

  const handleNextStep = useCallback(async () => {
    if (!file || !croppedAreaPixels || !preview) return;

    const croppedFile = base64ToFile(preview, "cropped_avatar.png");

    await updateDataTutor(croppedFile, croppedAreaPixels);
  }, [croppedAreaPixels, file, preview]);

  const base64ToFile = (base64: string, filename: string): File => {
    const arr = base64.split(",");
    const mimeMatch = arr[0].match(/:(.*?);/);

    if (!mimeMatch) {
      throw new Error("Не удалось извлечь MIME-тип из Base64");
    }

    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  };

  const handleSaveCrop = async () => {
    if (croppedAreaPixels && preview) {
      const { width: canvasWidth, height: canvasHeight } =
        await getImageDimensions(preview);

      const croppedImageBase64 = await getCroppedImg(
        preview,
        croppedAreaPixels,
        canvasHeight,
        canvasWidth
      );

      setPreview(croppedImageBase64);
      setIsCropping(false);
      setIsCropSaved(true); // Устанавливаем состояние, что обрезка завершена
    }
  };

  useEffect(() => {
    if (isCropSaved) {
      // Вызываем handleNextStep только один раз, когда обрезка завершена
      handleNextStep();
    }
  }, [isCropSaved, handleNextStep]);

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleDeletePhoto = async () => {
    setFile(null);
    setPreview(null);
    setUploadError("");
    setIsCropping(false);

    try {
      const id = tutor?.id;
      if (!id || !token) return;
      await dispatch(
        updateTutorAvatar({ id, file: null, token, croppedAreaPixels: null })
      ).unwrap();
    } catch (error) {
      console.error("Ошибка при удалении аватара:", error);
    }
  };

  const onCropComplete = (
    croppedArea: any,
    croppedAreaPixels: CroppedAreaPixels
  ) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  return (
    <>
      <div className={stylesTutor.content_block}>
        <h3>Фотография</h3>
      </div>

      <div className={styles.wrap}>
        <div className={componentStyle.description}>
          Фото в профиле вызывает больше доверия у учеников и делает вашу
          страницу более заметной
          <p>
            <strong>Фото подходит, если:</strong>
          </p>
          <ul>
            <li>Ваше лицо четко видно</li>
            <li>Без головных уборов</li>
            <li>Без посторонних людей</li>
          </ul>
        </div>

        {!file && tutor?.avatarUrl && !isCropping ? (
          <div className={styles.imagePreview}>
            <Image
              src={
                tutor?.avatarUrl
                  ? `${host}${port}${tutor?.avatarUrl}`
                  : `/img/tutor/avatarBasic.png`
              }
              alt="Аватар"
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
        ) : !file ? (
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
