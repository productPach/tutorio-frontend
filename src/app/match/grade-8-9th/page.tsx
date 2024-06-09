"use client";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import animation from "../layout.module.css";
import { useRouter } from "next/navigation";


const Grade89th = () => {

    const route = useRouter();

    const handleNextStep = (link: string) => {
        setIsDisabled(true);
        setIsVisible(false);
        setTimeout(() => route.push(link), 300);
    };

    const [isVisible, setIsVisible] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []); // Анимация будет стартовать после монтирования компонента


    return (
        <>
            <div className={`${styles.container} ${isVisible ? animation.visible : animation.hidden}`}>
                <div className={styles.title}>В каком классе ученик?</div>
                <div className={styles.containerAnswers}>
                    <div className={styles.answer}>
                        <input type="radio" className={styles.radioInput} id="radio-1" name="goal" />
                        <label className={styles.radioLabel} htmlFor="radio-1">
                            <span className={styles.radio}></span>
                            <p className={styles.answerTitle}>8 класс</p>
                        </label>
                    </div>

                    <div className={styles.answer}>
                        <input type="radio" className={styles.radioInput} id="radio-2" name="goal" />
                        <label className={styles.radioLabel} htmlFor="radio-2">
                            <span className={styles.radio}></span>
                            <p className={styles.answerTitle}>9 класс</p>
                        </label>
                    </div>

                </div>
            </div>
        </>
    );
};

export default Grade89th;