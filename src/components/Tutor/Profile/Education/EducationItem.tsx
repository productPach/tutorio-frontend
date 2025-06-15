import { useState } from "react";
import { useDispatch } from "react-redux";
import styles from "../../../../app/tutor/layout.module.css";
import componentStyle from "../GeneralInfo/GeneralInfo.module.css";
import componentEducationStyle from "./Education.module.css";

import clsx from "clsx";
import { AppDispatch, useAppSelector } from "@/store/store";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox"; // Импортируем Lightbox
import "yet-another-react-lightbox/styles.css";
import {
  setIsModalEditEducation,
  setIsModalEducationItem,
} from "@/store/features/modalSlice";
import { getBackendUrl, host, port } from "@/api/server/configApi";

interface EducationItemProps {
  educationId: string;
  educationIndex: number;
}

interface SlideImage {
  src: string;
  alt: string;
}

export const EducationItem = ({
  educationId,
  educationIndex,
}: EducationItemProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const tutor = useAppSelector((state) => state.tutor.tutor);

  // Стейт для управления состоянием галереи (открыта ли она)
  const [openLightbox, setOpenLightbox] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Обработчик клика по изображению для открытия Lightbox
  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index); // Устанавливаем текущий индекс изображения
    setOpenLightbox(true); // Открываем Lightbox
  };

  const handleClose = () => {
    setOpenLightbox(false); // Закрываем Lightbox
  };

  // Подготовка изображений для Lightbox
  const slides: SlideImage[] = tutor?.educations[educationIndex]
    ?.educationDiplomUrl
    ? tutor.educations[educationIndex].educationDiplomUrl.map((diplom) => ({
        src: `${host}${port}${diplom}`,
        alt: "Документ об образовании",
      }))
    : [];

  const education = tutor?.educations[educationIndex];
  const diplomUrls = education?.educationDiplomUrl || [];

  return (
    <>
      <div className={styles.content_block}>
        <div className={clsx(componentEducationStyle.dplFlxRwNwrJcBtwn)}>
          <div className={componentStyle.container}>
            <span>Наименование учебного заведения</span>
            <h2>{tutor?.educations[educationIndex]?.educationInfo}</h2>
            <div className={componentEducationStyle.educationItemContainerInfo}>
              <span>Год начала обучения</span>
              <p className={componentEducationStyle.educationItemContainerP}>
                {tutor?.educations[educationIndex]?.educationStartYear}
              </p>
            </div>
            <div className={componentEducationStyle.educationItemContainerInfo}>
              <span>Год окончания обучения</span>
              <p className={componentEducationStyle.educationItemContainerP}>
                {tutor?.educations[educationIndex]?.educationEndYear}
              </p>
            </div>
          </div>

          <div>
            <Image
              onClick={(e) => {
                e.preventDefault();
                dispatch(setIsModalEditEducation(true));
              }}
              title="Изменить"
              className={componentStyle.img}
              src="/../img/icon/tutor/pencilSimple.svg"
              alt="Изменить образование"
              width={21}
              height={21}
            />
            <Image
              onClick={(e) => {
                e.preventDefault();
                dispatch(setIsModalEducationItem(true));
              }}
              title="Удалить"
              className={componentStyle.img}
              src="/../img/icon/tutor/delete.svg"
              alt="Удалить образование"
              width={21}
              height={21}
            />
          </div>
        </div>
        <div className={componentStyle.container}>
          <div className={clsx(componentEducationStyle.dplFlxRwNwrJcBtwn)}>
            {diplomUrls.length > 0 && (
              <div
                className={componentEducationStyle.educationItemContainerInfo}
              >
                <span>Диплом, сертификаты и другие документы</span>
                <div className={componentEducationStyle.dplFlxRwNwrJcGp20}>
                  {tutor?.educations[educationIndex]?.educationDiplomUrl.map(
                    (diplom, index) => {
                      return (
                        <Image
                          key={index}
                          onClick={() => handleImageClick(index)} // Клик по изображению
                          src={`${getBackendUrl()}${diplom}`}
                          alt="Документ об образовании"
                          width={100}
                          height={100}
                          className={componentEducationStyle.imageDiplomas}
                        />
                      );
                    }
                  )}
                </div>
              </div>
            )}
          </div>
          <div className={clsx(componentEducationStyle.dplFlxRwNwrJcBtwn)}>
            <div className={componentEducationStyle.educationItemContainerInfo}>
              <span>Документы об образовании доступны</span>
              <p className={componentEducationStyle.educationItemContainerP}>
                {tutor?.educations[educationIndex]?.isShowDiplom
                  ? "Всем пользователям"
                  : "Только администраторам"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox компонент для отображения фотографий на весь экран */}
      <Lightbox
        open={openLightbox} // Управляем открытием галереи
        close={handleClose} // Функция для закрытия галереи
        slides={slides} // Передаем массив изображений
        index={currentImageIndex} // Индекс текущего изображения
      />
    </>
  );
};
