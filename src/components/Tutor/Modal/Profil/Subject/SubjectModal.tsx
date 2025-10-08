"use client";
import { useAppDispatch, useAppSelector } from "@/store/store";
import styles from "../ProfileInfo/ProfileInfo.module.css";
import generalStyles from "../../../../../app/tutor/layout.module.css";
import componentStyles from "./SubjectModal.module.css";
import React, { useEffect, useState } from "react";
import { Subject } from "@/types/types";
import { getAllSubjects } from "@/store/features/subjectSlice";
import {
  setIsModalEditSubject,
  setIsModalEditSubjectGoal,
  setIsModalEditSubjectPrices,
  setIsSheetEditSubject,
  setIsSheetEditSubjectGoal,
  setIsSheetEditSubjectPrices,
} from "@/store/features/modalSlice";
import Image from "next/image";
import clsx from "clsx";
import {
  getTutorGoals,
  resetTutorGoalsSaved,
} from "@/store/features/tutorSlice";

export const SubjectModal = () => {
  const dispatch = useAppDispatch();

  // Получаем значение loading из Redux
  const tutor = useAppSelector((state) => state.tutor.tutor);
  const isLoading = useAppSelector((state) => state.tutor.loading);
  const updateStatus = useAppSelector((state) => state.tutor.updateStatus);

  const [successUpdateTutor, setSuccessUpdateTutor] = useState(true);

  const subjects = useAppSelector((state) => state.subject.subjects);

  useEffect(() => {
    dispatch(getAllSubjects());
  }, [dispatch]);

  useEffect(() => {
    updateStatus === "success" && setSuccessUpdateTutor(true);
  }, [updateStatus]);

  const editSubjectId = useAppSelector(
    (state) => state.modal.subjectForEditInModal
  );
  const subject: Subject | undefined = subjects.find(
    (item) => item.id_p === editSubjectId
  );

  useEffect(() => {
    if (tutor?.id && editSubjectId) {
      dispatch(getTutorGoals({ tutorId: tutor.id, subjectId: editSubjectId }));
    }
  }, [dispatch, tutor, editSubjectId]);

  return (
    <>
      <h2 className={componentStyles.title}>{subject?.title}</h2>
      <br></br>
      <div
        onClick={(e) => {
          e.preventDefault();
          if (window.innerWidth < 769) {
            dispatch(setIsSheetEditSubjectPrices(true)); // Открываем шторку
            dispatch(setIsSheetEditSubject(false));
          } else {
            dispatch(setIsModalEditSubjectPrices(true));
            dispatch(setIsModalEditSubject(false));
          }
        }}
        className={clsx(generalStyles.content_block, componentStyles.bgGray)}
      >
        <div className={generalStyles.order_block_flx_rw_spbtw2}>
          <h3>Стоимость занятий</h3>
          <Image
            src="/img/icon/tutor/caretRight.svg"
            alt="Общая информация"
            width={21}
            height={21}
          />
        </div>
      </div>

      <div
        onClick={(e) => {
          e.preventDefault();
          if (window.innerWidth < 769) {
            dispatch(setIsSheetEditSubjectGoal(true)); // Открываем шторку
            dispatch(resetTutorGoalsSaved());
            dispatch(setIsSheetEditSubject(false));
          } else {
            dispatch(setIsModalEditSubjectGoal(true));
            dispatch(resetTutorGoalsSaved());
            dispatch(setIsModalEditSubject(false));
          }
        }}
        className={clsx(generalStyles.content_block, componentStyles.bgGray)}
      >
        <div className={generalStyles.order_block_flx_rw_spbtw2}>
          <h3>Цели занятий</h3>
          <Image
            src="/img/icon/tutor/caretRight.svg"
            alt="Общая информация"
            width={21}
            height={21}
          />
        </div>
      </div>
    </>
  );
};
