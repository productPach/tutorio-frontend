"use client";
import { NumericFormat } from "react-number-format";
import { useAppDispatch, useAppSelector } from "@/store/store";
import styles from "../ProfileInfo/ProfileInfo.module.css";
import componentStyles from "./SubjectModal.module.css";
import React, { ChangeEvent, useEffect, useState } from "react";
import { availableDurations } from "@/utils/listSubjects";
import clsx from "clsx";
import { LessonDuration, LessonFormat, Subject } from "@/types/types";
import {
  addSubjectPrice,
  getTutorIncompletePrices,
  updateSubjectPrice,
  updateTutor,
} from "@/store/features/tutorSlice";
import { Spinner } from "@/components/Spinner/Spinner";
import { getAllSubjects } from "@/store/features/subjectSlice";
import { getAccessToken } from "@/api/server/auth";

export const SubjectPriceModal = () => {
  const dispatch = useAppDispatch();
  //const token = useAppSelector((state) => state.auth.token);
  const token = getAccessToken(); // берём из localStorage
  const tutor = useAppSelector((state) => state.tutor.tutor);

  // Получаем значение loading из Redux
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

  const subjectPrices = tutor?.subjectPrices?.filter(
    (item) => item.subjectId === editSubjectId
  );

  const getPriceData = (format: LessonFormat) => {
    const priceEntry = subjectPrices?.find((p) => p.format === format);
    return {
      price: priceEntry?.price ? priceEntry.price.toString() : "",
      duration: priceEntry?.duration || "60",
    };
  };

  const formats: { key: LessonFormat; label: string }[] = [
    { key: "online", label: "Стоимость занятий онлайн" },
    { key: "group", label: "Стоимость групповых занятий" },
    { key: "travel", label: "Стоимость занятий с выездом" },
    { key: "home", label: "Стоимость занятий у себя дома" },
  ];

  const [prices, setPrices] = useState(() =>
    formats.reduce(
      (acc, { key }) => ({
        ...acc,
        [key]: {
          price: getPriceData(key).price,
          duration: getPriceData(key).duration,
        },
      }),
      {} as Record<LessonFormat, { price: string; duration: LessonDuration }>
    )
  );

  const handlePriceChange = (format: LessonFormat, value: string) => {
    setPrices((prev) => ({
      ...prev,
      [format]: { ...prev[format], price: value },
    }));
    setSuccessUpdateTutor(false);
  };

  const handleDurationChange = (
    format: LessonFormat,
    value: LessonDuration
  ) => {
    setPrices((prev) => ({
      ...prev,
      [format]: { ...prev[format], duration: value },
    }));
    setSuccessUpdateTutor(false);
  };

  const existingComment =
    tutor?.subjectComments?.find((c) => c.subjectId === editSubjectId)
      ?.comment || "";

  const [inputValue, setInputValue] = useState(existingComment);
  const [isFocused, setIsFocused] = useState(false);
  const [errorInput, setErrorInput] = useState(false);

  const handleInputValue = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    setSuccessUpdateTutor(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const [focusedFields, setFocusedFields] = useState<Record<string, boolean>>(
    {}
  );
  const handleFocusInput = (key: string) => {
    setFocusedFields((prev) => ({ ...prev, [key]: true }));
  };
  const handleBlurInput = (key: string) => {
    setFocusedFields((prev) => ({ ...prev, [key]: false }));
  };

  const update = async () => {
    if (!token || !tutor?.id || !editSubjectId) return;

    // СОХРАНЕНИЕ ПРЕДМЕТА ИЗ НЕДОБАВЛЕННЫХ: ВЫБИРАЕМ ДОБАВИТЬ СТОИМОСТЬ У НЕДОБАВЛЕННОГО ПРЕДМЕТА, УКАЗЫВАЕМ СТОИМОСТЬ
    // И СОХРАНЯЕМ. СНАЧАЛА СОХРАНИТСЯ ПРЕДМЕТ, ПОТОМ К НЕМУ СОХРАНЯТСЯ ЦЕНЫ И КОММЕНТАРИЙ
    // const hasSubject = tutor.subject?.includes(editSubjectId);

    // if (!hasSubject) {
    //   await dispatch(
    //     updateTutor({
    //       id: tutor.id,
    //       token,
    //       status: tutor.status,
    //       subject: [...(tutor.subject || []), editSubjectId],
    //     })
    //   );
    // }

    const priceUpdates = formats
      .map(({ key: format }) => {
        const { price, duration } = prices[format];
        if (!price) return null;

        const existingPrice = subjectPrices?.find((p) => p.format === format);

        return existingPrice
          ? updateSubjectPrice({
              id: existingPrice.id,
              price: Number(price),
              duration,
            })
          : addSubjectPrice({
              tutorId: tutor.id,
              subjectId: editSubjectId,
              format,
              price: Number(price),
              duration,
            });
      })
      .filter(Boolean);

    await Promise.all(priceUpdates.map(dispatch));

    const trimmedComment = inputValue.trim();
    const existingComments = tutor.subjectComments || [];

    const updatedComments = trimmedComment
      ? [
          ...existingComments.filter((c) => c.subjectId !== editSubjectId),
          { subjectId: editSubjectId, comment: trimmedComment },
        ]
      : existingComments.filter((c) => c.subjectId !== editSubjectId);

    dispatch(
      updateTutor({
        id: tutor.id,
        subjectComments: updatedComments,
      })
    ).unwrap();
    await dispatch(getTutorIncompletePrices({ id: tutor.id })).unwrap();
  };

  return (
    <>
      <h2 className={componentStyles.title}>{subject?.title}</h2>

      {formats.map(({ key, label }) => (
        <div key={key}>
          <div className={componentStyles.description}>{label}</div>
          <div className={componentStyles.inputContainerFlxRw}>
            <NumericFormat
              value={prices[key].price}
              onValueChange={(values) =>
                handlePriceChange(key, values.value || "")
              }
              thousandSeparator=" "
              placeholder="Стоимость, ₽"
              autoComplete="off"
              className={clsx(componentStyles.input, {
                [componentStyles.focused]: focusedFields[key],
                [componentStyles.errorInput]: errorInput,
              })}
              customInput={"input" as any}
              allowNegative={false}
              isAllowed={(values) => values.value.length <= 6}
              onFocus={(e) => {
                requestAnimationFrame(() => {
                  e.target.setSelectionRange(
                    e.target.value.length,
                    e.target.value.length
                  );
                });
                handleFocusInput(key);
              }}
              onBlur={() => handleBlurInput(key)}
            />

            <select
              className={componentStyles.inputPriceSelect}
              value={prices[key].duration}
              onChange={(e) =>
                handleDurationChange(key, e.target.value as LessonDuration)
              }
            >
              {availableDurations.map((duration) => (
                <option key={duration} value={duration}>
                  {duration === "day" ? "день" : `${duration} мин.`}
                </option>
              ))}
            </select>
          </div>
        </div>
      ))}

      <br />
      <div className={componentStyles.description}>Комментарий по занятиям</div>
      <div className={styles.inputContainer}>
        <textarea
          placeholder={
            "Дополнительная информация о занятиях: пожелания, формат, особенности обучения"
          }
          autoComplete="off"
          value={inputValue}
          onChange={handleInputValue}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={clsx(componentStyles.textarea, {
            [componentStyles.focused]: isFocused,
            [styles.errorInput]: errorInput,
          })}
          maxLength={5000}
        />
      </div>

      <div className={styles.button}>
        <button
          onClick={update}
          type="button"
          disabled={isLoading || successUpdateTutor}
        >
          {successUpdateTutor && updateStatus === "success"
            ? "Сохранено"
            : "Сохранить"}
          {isLoading && (
            <div className={componentStyles.buttonYlSpinner}>
              <Spinner />
            </div>
          )}
        </button>
      </div>
    </>
  );
};
