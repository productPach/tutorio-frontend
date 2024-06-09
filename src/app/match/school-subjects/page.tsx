"use client";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import animation from "../layout.module.css";
import { useRouter } from "next/navigation";


const SchoolSubjects = () => {

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
                <div className={styles.title}>Какая цель занятий?</div>
                {/* <div className={styles.description}>Выберите один из нижеперечисленных вариантов</div> */}
                <div className={styles.containerAnswers}>

                    <div onClick={() => handleNextStep("/match/grade-8-9th")} className={styles.answer}>
                        <input type="radio" className={styles.radioInput} id="radio-1" name="goal" />
                        <label className={styles.radioLabel} htmlFor="radio-1">
                            <span className={styles.radio}></span>
                            <p className={styles.answerTitle}>Подготовка к ОГЭ</p>
                        </label>
                    </div>

                    <div className={styles.answer}>
                        <input type="radio" className={styles.radioInput} id="radio-2" name="goal" />
                        <label className={styles.radioLabel} htmlFor="radio-2">
                            <span className={styles.radio}></span>
                            <p className={styles.answerTitle}>Подготовка к ЕГЭ</p>
                        </label>
                    </div>

                    <div className={styles.answer}>
                        <input type="radio" className={styles.radioInput} id="radio-3" name="goal" />
                        <label className={styles.radioLabel} htmlFor="radio-3">
                            <span className={styles.radio}></span>
                            <p className={styles.answerTitle}>Повышение успеваемости</p>
                        </label>
                    </div>

                    <div className={styles.answer}>
                        <input type="radio" className={styles.radioInput} id="radio-4" name="goal" />
                        <label className={styles.radioLabel} htmlFor="radio-4">
                            <span className={styles.radio}></span>
                            <p className={styles.answerTitle}>Подготовка к экзамену в вузе</p>
                        </label>
                    </div>

                    <div className={styles.answer}>
                        <input type="radio" className={styles.radioInput} id="radio-5" name="goal" />
                        <label className={styles.radioLabel} htmlFor="radio-5">
                            <span className={styles.radio}></span>
                            <p className={styles.answerTitle}>Подготовка к олимпиаде</p>
                        </label>
                    </div>

                    <div className={styles.answer}>
                        <input type="radio" className={styles.radioInput} id="radio-6" name="goal" />
                        <label className={styles.radioLabel} htmlFor="radio-6">
                            <span className={styles.radio}></span>
                            <p className={styles.answerTitle}>Подготовка к школе</p>
                        </label>
                    </div>

                    <div className={styles.answer}>
                        <input type="radio" className={styles.radioInput} id="radio-7" name="goal" />
                        <label className={styles.radioLabel} htmlFor="radio-7">
                            <span className={styles.radio}></span>
                            <p className={styles.answerTitle}>ДВИ</p>
                        </label>
                    </div>

                    <div className={styles.answer}>
                        <input type="radio" className={styles.radioInput} id="radio-8" name="goal" />
                        <label className={styles.radioLabel} htmlFor="radio-8">
                            <span className={styles.radio}></span>
                            <p className={styles.answerTitle}>ВПР</p>
                        </label>
                    </div>

                    <div className={styles.answer}>
                        <input type="radio" className={styles.radioInput} id="radio-9" name="goal" />
                        <label className={styles.radioLabel} htmlFor="radio-9">
                            <span className={styles.radio}></span>
                            <p className={styles.answerTitle}>Для себя</p>
                        </label>
                    </div>

                    <div className={styles.answer}>
                        <input type="radio" className={styles.radioInput} id="radio-10" name="goal" />
                        <label className={styles.radioLabel} htmlFor="radio-10">
                            <span className={styles.radio}></span>
                            <p className={styles.answerTitle}>Для работы</p>
                        </label>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SchoolSubjects;