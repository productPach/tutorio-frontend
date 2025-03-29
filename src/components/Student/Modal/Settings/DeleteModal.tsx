"use client";

import { useAppDispatch, useAppSelector } from "@/store/store";
import styles from "../../../Tutor/Modal/Profil/Fio/Fio.module.css";
import buttonStyles from "../../../../app/tutor/button.module.css";
import componentStyles from "../../../Tutor/Modal/Profil/Education/Education.module.css";
import profileInfoStyles from "../../../Tutor/Modal/Profil/ProfileInfo/ProfileInfo.module.css";
import { setIsModalDelete, setScrollY } from "@/store/features/modalSlice";
import { ChangeEvent, useState } from "react";
import clsx from "clsx";
import { Spinner } from "@/components/Spinner/Spinner";
import {
  deleteStudentRequest,
  resetDeleteRequest,
  updateStudent,
} from "@/store/features/studentSlice";

export const DeleteModal = ({ logout }: { logout: () => void }) => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const student = useAppSelector((state) => state.student.student); // Получаем tutor из Redux
  const deleteRequest = useAppSelector((state) => state.student.deleteRequest);
  const loading = useAppSelector((state) => state.student.loading);

  const handleDeleteRequest = () => {
    if (student && token) {
      dispatch(
        deleteStudentRequest({
          studentId: student?.id,
          answer: inputValue,
          token,
        })
      );
      dispatch(updateStudent({ id: student?.id, token, status: "Deleted" }));
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
                dispatch(setIsModalDelete(false));
                dispatch(setScrollY(0));
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
              dispatch(setIsModalDelete(false));
              dispatch(setScrollY(0));
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
