import { locations } from "@/utils/locations/locations";
import styles from "../SelectCity/SelectCityModal.module.css";
import React from "react";

export const SelectCity = () => {
  return (
    <>
      <div className={styles.firstSection__tutorSearch2}>
        <div className={styles.searchContainer}>
          <input
            id="subjectInput"
            type="text"
            placeholder="Введите название предмета"
            autoComplete="off"
            //   value={inputSearchTutor}
            //   onChange={(e) => handleSearchTutor(e.target.value)}
            //   className={errorSubject ? styles.errorInput : undefined}
          />
        </div>
      </div>

      <div className={styles.wrapCity}>
        {locations.map((item) => (
          <React.Fragment key={item.id}>
            <div className={styles.answer}>
              <input
                //   checked={answer.title === valueProperty && true}
                readOnly
                type="radio"
                className={styles.radioInput}
                id={`radio-${item.id}`}
                name={"city"}
              />
              <label className={styles.radioLabel} htmlFor={`radio-${item.id}`}>
                <span className={styles.radio}></span>
                <p className={styles.answerTitle}>{item.title}</p>
              </label>
            </div>
          </React.Fragment>
        ))}
      </div>
      <div className={styles.opacity}></div>
    </>
  );
};
