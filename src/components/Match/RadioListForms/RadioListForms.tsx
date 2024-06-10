"use client";
import React, { useEffect, useState } from "react";
import styles from "./RadioListForms.module.css";
import animation from "../../../app/match/layout.module.css";
import { useRouter } from "next/navigation";

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
                <div className={styles.title}>{question}</div>
                {/* <div className={styles.description}>Выберите один из нижеперечисленных вариантов</div> */}
                <div className={styles.containerAnswers}>

                    {answerArray.map((answer) => {
                        return (<>
                            <div onClick={() => handleNextStep(answer.nextPage)} className={styles.answer}>
                                <input type="radio" className={styles.radioInput} id={`radio-${answer.id}`} name="goal" />
                                <label className={styles.radioLabel} htmlFor={`radio-${answer.id}`}>
                                    <span className={styles.radio}></span>
                                    <p className={styles.answerTitle}>{answer.title}</p>
                                </label>
                            </div>
                        </>);
                    })}
                    
                </div>
            </div>
        </>
    );
}