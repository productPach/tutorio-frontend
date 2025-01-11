"use client";

import { useAppDispatch, useAppSelector } from "@/store/store";
import styles from "../Fio/Fio.module.css";
import buttonStyles from "../../../../../app/tutor/button.module.css";
import componentStyles from "./Education.module.css";
import { deleteTutorEducation } from "@/store/features/tutorSlice";
import { setIsModalEducationItem } from "@/store/features/modalSlice";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { host, port } from "@/api/server/configApi";

export const EducationItemDiplomasModal = () => {
  const dispatch = useAppDispatch();
  // Получаем значение tutor из Redux
  const token = useAppSelector((state) => state.auth.token);
  const tutor = useAppSelector((state) => state.tutor.tutor);

  const numberDiplomasView = useAppSelector(
    (state) => state.tutor.numberDiplomasView
  );

  return (
    <>
      <div className={componentStyles.containerFlxRw}>
        {
          <Image
            src={`${host}${port}${tutor?.educations[0].educationDiplomUrl[numberDiplomasView]}`}
            alt="Документ об образовании"
            layout="fill" // Позволяет изображению растягиваться по контейнеру
            objectFit="contain" // Сохраняет пропорции изображения
          />
        }
      </div>
    </>
  );
};
