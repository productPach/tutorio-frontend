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
    typeForm: string;
    answerArray: Answer[];
}

export const RadioListForms: React.FC<ComponentRenderProps> = ( {question, typeForm, answerArray} ) => {
    const route = useRouter();

    const getDataMatchLS = localStorage.getItem("currentMatch");
    const dataMatch = getDataMatchLS && JSON.parse(getDataMatchLS);

    const handleNextStep = (link: string, title: string) => {
        setIsDisabled(true);
        setIsVisible(false);
            const newData = {
                [typeForm]: title,
            }
            const dataToSave = {... dataMatch, ... newData};
            localStorage.setItem("currentMatch", JSON.stringify(dataToSave));
        
        setTimeout(() => route.push(link), 400);
    };

    const handlePrevStep = () => {
        setIsDisabled(true);
        setIsVisible(false);
        delete dataMatch[typeForm];
        localStorage.setItem("currentMatch", JSON.stringify(dataMatch));
        setTimeout(() => route.back(), 400);
    }

    const [isVisible, setIsVisible] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []); // Анимация будет стартовать после монтирования компонента

    const currentDataMatch = dataMatch[typeForm];

    return (
        <>
            <div className={`${styles.container} ${isVisible ? animation.visible : animation.hidden}`}>
                <div className={styles.wrap}>
                    <div onClick={handlePrevStep} className={styles.wrapIcon}>
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
                                <div onClick={() => handleNextStep(answer.nextPage, answer.title)} className={styles.answer}>
                                    <input checked={answer.title === currentDataMatch && true} readOnly type="radio" className={styles.radioInput} id={`radio-${answer.id}`} name="goal" />
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