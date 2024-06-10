"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import styles from "../RadioListForms/RadioListForms.module.css";
import animation from "../../../app/match/layout.module.css";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import Image from "next/image";

interface Answer {
    id: number;
    title: string;
    nextPage: string;
}
  
interface ComponentRenderProps {
    question: string;
    answerArray: Answer[];
}

export const InputForms: React.FC<ComponentRenderProps> = ({question, answerArray}) => {
    const route = useRouter();

    // Состояние текстового поля
    const [inputValue, setInputValue] = useState("");
    // Состояние для ошибки текстового поля
    const [errorInput, setErrorInput] = useState(false);

    // Функция для валидации значения поля
    const handleInputValue = (e: ChangeEvent<HTMLInputElement>) => {

        if (/[^\d]/.test(e.target.value)) {
            setErrorInput(true);
        } else {
            setErrorInput(false);
        }

        setInputValue(e.target.value)
    }

    const handleNextStep = (link: string) => {
        setIsDisabled(true);
        setIsVisible(false);
        setTimeout(() => route.push(link), 400);
    };

    const [isVisible, setIsVisible] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []); // Анимация будет стартовать после монтирования компонента

    return (
        <>
            <div className={`${styles.container} ${isVisible ? animation.visible : animation.hidden}`}>
                <div className={styles.wrap}>
                    <div onClick={route.back} className={styles.wrapIcon}>
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
                    {/* <div className={styles.description}>Выберите один из нижеперечисленных вариантов</div> */}
                        <input
                            id="stydentYears"
                            type="text"
                            placeholder={answerArray[0].title}
                            autoComplete="off"
                            value={inputValue}
                            onChange={handleInputValue}
                            className={clsx(styles.inputStudentYears, {[styles.errorInput] : errorInput})}
                            maxLength={2}
                        />
                        {errorInput ? (
                            <div className={styles.errorInputText}>
                                Пожалуйста, введите возраст ученика используя только цифры
                            </div>
                        ) : null}
                </div>
                <div className={styles.wrapButton}>
                    <button type="submit" className={styles.continueButton} disabled={!inputValue || errorInput}>Продолжить</button>
                </div>
            </div>
        </>
    );
}