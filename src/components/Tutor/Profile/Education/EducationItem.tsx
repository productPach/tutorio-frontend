import { useDispatch } from "react-redux";
import generalStyle from "../../../../app/general.module.css";
import styles from "../../../../app/tutor/layout.module.css";
import componentStyle from "../GeneralInfo/GeneralInfo.module.css";
import componentEducationStyle from "./Education.module.css";

import clsx from "clsx";
import { AppDispatch, useAppSelector } from "@/store/store";
import Image from "next/image";
import {
  setIsModalEducation,
  setIsModalEducationItem,
  setIsModalExperience,
} from "@/store/features/modalSlice";
import { getYearWord } from "@/utils/words/getYearWord";
import Link from "next/link";
import { deleteTutorEducation } from "@/store/features/tutorSlice";

interface EducationItemProps {
  educationId: string;
  educationIndex: number;
}

export const EducationItem = ({
  educationId,
  educationIndex,
}: EducationItemProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const tutor = useAppSelector((state) => state.tutor.tutor);
  const educationLength = tutor?.educations?.length || 0;

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
            <div className={componentEducationStyle.educationItemContainerInfo}>
              <span>Диплом, сертификаты и другие документы</span>
            </div>
          </div>
          <div>
            <Image
              onClick={(e) => {
                e.preventDefault();
                dispatch(setIsModalExperience(true));
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
      </div>
    </>
  );
};
