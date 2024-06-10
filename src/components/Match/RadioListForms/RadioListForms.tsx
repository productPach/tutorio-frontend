"use client";
import React, { useEffect, useState } from "react";
import styles from "./RadioListForms.module.css";
import animation from "../../../app/match/layout.module.css";
import { useRouter } from "next/navigation";
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

export const RadioListForms: React.FC<ComponentRenderProps> = ( {question, answerArray} ) => {
    const route = useRouter();

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
                    <div className={styles.containerAnswers}>

                        {answerArray.map((answer) => {
                            return (<React.Fragment key={answer.id}>
                                <div onClick={() => handleNextStep(answer.nextPage)} className={styles.answer}>
                                    <input type="radio" className={styles.radioInput} id={`radio-${answer.id}`} name="goal" />
                                    <label className={styles.radioLabel} htmlFor={`radio-${answer.id}`}>
                                        <span className={styles.radio}></span>
                                        <p className={styles.answerTitle}>{answer.title}</p>
                                    </label>
                                </div>
                            </React.Fragment>);
                        })}
                        
                    </div>
                </div>
                <div className={styles.wrapButton}>
                    <button type="submit" className={styles.continueButton}>Продолжить</button>
                </div>
            </div>
        </>
    );
}