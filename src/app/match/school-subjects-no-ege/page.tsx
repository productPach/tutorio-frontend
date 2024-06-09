"use client";
import React from "react";
import styles from "./page.module.css";


const SchoolSubjectsNoEge = () => {
    return (
        <>
            <div className={styles.container}>
                <div className={styles.title}>Какая цель занятий?</div>
                <div className={styles.containerAnswers}>

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
                            <p className={styles.answerTitle}>Для себя</p>
                        </label>
                    </div>

                    <div className={styles.answer}>
                        <input type="radio" className={styles.radioInput} id="radio-7" name="goal" />
                        <label className={styles.radioLabel} htmlFor="radio-7">
                            <span className={styles.radio}></span>
                            <p className={styles.answerTitle}>Для работы</p>
                        </label>
                    </div>

                    <div className={styles.answer}>
                        <input type="radio" className={styles.radioInput} id="radio-8" name="goal" />
                        <label className={styles.radioLabel} htmlFor="radio-8">
                            <span className={styles.radio}></span>
                            <p className={styles.answerTitle}>Другое</p>
                        </label>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SchoolSubjectsNoEge;