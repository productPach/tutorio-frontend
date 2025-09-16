"use client";

import { useAppDispatch, useAppSelector } from "@/store/store";
import styles from "../Profil/Fio/Fio.module.css";
import buttonStyles from "../../../../app/tutor/button.module.css";
import componentStyles from "../Profil/Education/Education.module.css";
import profileInfoStyles from "../Profil/ProfileInfo/ProfileInfo.module.css";
import {
  setIsModalDelete,
  setIsSheetDelete,
  setScrollY,
} from "@/store/features/modalSlice";
import { ChangeEvent, useState } from "react";
import clsx from "clsx";
import {
  deleteTutorRequest,
  resetDeleteRequest,
  updateTutor,
} from "@/store/features/tutorSlice";
import { Spinner } from "@/components/Spinner/Spinner";

export const DeleteModal = ({ logout }: { logout: () => void }) => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const tutor = useAppSelector((state) => state.tutor.tutor); // Получаем tutor из Redux
  const deleteRequest = useAppSelector((state) => state.tutor.deleteRequest);
  const loading = useAppSelector((state) => state.tutor.loading);

  const handleDeleteRequest = () => {
    if (tutor && token) {
      dispatch(
        deleteTutorRequest({ tutorId: tutor?.id, answer: inputValue, token })
      );
      dispatch(updateTutor({ id: tutor?.id, token, status: "Deleted" }));
    }
  };
  // Стейт для знаения инпута с суммой пополнения
  const [inputValue, setInputValue] = useState("");
  const handleInputValue = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputValue(value);
  };

  // Состояние для ошибки текстового поля
  const [errorInput, setErrorInput] = useState(false);

  // Состояние для фиксации фокусирования на поле с вводом телефона
  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <>
      {!deleteRequest ? (
        <div>
          <div className={styles.description}>
            Нам очень жаль, что вы приняли решение удалить аккаунт 😞 <br></br>
            <br></br>Пожалуйста, расскажите, почему вы решили уйти — ваше мнение
            поможет нам сделать Tutorio лучше
          </div>

          <div className={profileInfoStyles.inputContainer}>
            <textarea
              placeholder={
                "Пожалуйста, расскажите нам что послужило причиной удаления аккаунта"
              }
              autoComplete="off"
              value={inputValue}
              onChange={handleInputValue}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className={clsx(profileInfoStyles.textarea, {
                [profileInfoStyles.focused]: isFocused,
                [profileInfoStyles.errorInput]: errorInput,
              })}
              maxLength={5000}
            />
          </div>

          <div
            className={clsx(
              componentStyles.containerFlxRw,
              componentStyles.button
            )}
          >
            <button
              disabled={inputValue.length < 5 || loading}
              className={buttonStyles.buttonGr}
              onClick={() => {
                handleDeleteRequest();
              }}
              type="button"
            >
              Удалить
              {loading && (
                <div className={componentStyles.spinner}>
                  <Spinner />
                </div>
              )}
            </button>
            <button
              className={buttonStyles.buttonBlc}
              onClick={(e) => {
                e.preventDefault();
                dispatch(setScrollY(0));
                if (window.innerWidth < 769) {
                  dispatch(setIsSheetDelete(false)); // Открываем шторку
                } else {
                  dispatch(setIsModalDelete(false));
                }
              }}
              type="button"
            >
              Отмена
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className={styles.description}>
            Ваш аккаунт будет удален через 30 дней. ⏳<br></br>
            <br></br>
            Он больше не доступен для просмотра другим пользователям, но у вас
            есть возможность восстановить его в течение этого времени.
            <br></br>
            <br></br>
            Если передумаете, просто войдите в аккаунт, и удаление отменится
            автоматически 💙
          </div>

          <button
            className={buttonStyles.buttonBlc}
            onClick={(e) => {
              e.preventDefault();
              dispatch(setScrollY(0));
              if (window.innerWidth < 769) {
                dispatch(setIsSheetDelete(false)); // Открываем шторку
              } else {
                dispatch(setIsModalDelete(false));
              }
              resetDeleteRequest();
              logout();
            }}
            type="button"
          >
            Хорошо
          </button>
        </div>
      )}
    </>
  );
};
