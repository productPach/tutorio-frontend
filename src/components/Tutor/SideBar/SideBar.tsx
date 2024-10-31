"use client";
import Image from "next/image";
import styles from "../../../app/tutor/layout.module.css";
import inputStyles from "../../../app/tutor/input.module.css";
import clsx from "clsx";
import React from "react";

const SideBar = () => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebar_filter}>
        <div>
          <p className={styles.sidebar_title}>Место занятий</p>
          <input
            type="checkbox"
            className={inputStyles.checkbox_input}
            id="checkbox-1"
          />
          <label className={inputStyles.checkbox_label} htmlFor="checkbox-1">
            <span className={inputStyles.checkbox}></span>
            <p className={inputStyles.checkbox_label_text}>Дистанционно</p>
          </label>

          <input
            type="checkbox"
            className={inputStyles.checkbox_input}
            id="checkbox-2"
          />
          <label className={inputStyles.checkbox_label} htmlFor="checkbox-2">
            <span className={inputStyles.checkbox}></span>
            <p className={inputStyles.checkbox_label_text}>У репетитора</p>
          </label>

          <input
            type="checkbox"
            className={inputStyles.checkbox_input}
            id="checkbox-3"
          />
          <label className={inputStyles.checkbox_label} htmlFor="checkbox-3">
            <span className={inputStyles.checkbox}></span>
            <p className={inputStyles.checkbox_label_text}>У ученика</p>
          </label>
        </div>

        <div>
          <p className={styles.sidebar_title}>Регион</p>
          <div className={clsx(styles.header_geo, styles.sidebar_geo)}>
            <Image
              src="../img/icon/location.svg"
              alt="Геолокация"
              width={15}
              height={18}
              className={styles.header_geoImage}
            />
            Москва
          </div>
        </div>

        <div>
          <p className={styles.sidebar_title}>Цель занятий</p>
          <input
            type="checkbox"
            className={inputStyles.checkbox_input}
            id="checkbox-4"
          />
          <label className={inputStyles.checkbox_label} htmlFor="checkbox-4">
            <span className={inputStyles.checkbox}></span>
            <p className={inputStyles.checkbox_label_text}>
              Всероссийская проверочная работа (ВПР)
            </p>
          </label>

          <input
            type="checkbox"
            className={inputStyles.checkbox_input}
            id="checkbox-5"
          />
          <label className={inputStyles.checkbox_label} htmlFor="checkbox-5">
            <span className={inputStyles.checkbox}></span>
            <p className={inputStyles.checkbox_label_text}>
              Подготовка к экзамену в&nbspвузе
            </p>
          </label>

          <input
            type="checkbox"
            className={inputStyles.checkbox_input}
            id="checkbox-6"
          />
          <label className={inputStyles.checkbox_label} htmlFor="checkbox-6">
            <span className={inputStyles.checkbox}></span>
            <p className={inputStyles.checkbox_label_text}>Подготовка к ЕГЭ</p>
          </label>

          <input
            type="checkbox"
            className={inputStyles.checkbox_input}
            id="checkbox-7"
          />
          <label className={inputStyles.checkbox_label} htmlFor="checkbox-7">
            <span className={inputStyles.checkbox}></span>
            <p className={inputStyles.checkbox_label_text}>
              Подготовка к школе
            </p>
          </label>

          <input
            type="checkbox"
            className={inputStyles.checkbox_input}
            id="checkbox-8"
          />
          <label className={inputStyles.checkbox_label} htmlFor="checkbox-8">
            <span className={inputStyles.checkbox}></span>
            <p className={inputStyles.checkbox_label_text}>
              Повышение успеваемости
            </p>
          </label>

          <input
            type="checkbox"
            className={inputStyles.checkbox_input}
            id="checkbox-9"
          />
          <label className={inputStyles.checkbox_label} htmlFor="checkbox-9">
            <span className={inputStyles.checkbox}></span>
            <p className={inputStyles.checkbox_label_text}>Подготовка к ОГЭ</p>
          </label>

          <input
            type="checkbox"
            className={inputStyles.checkbox_input}
            id="checkbox-10"
          />
          <label className={inputStyles.checkbox_label} htmlFor="checkbox-10">
            <span className={inputStyles.checkbox}></span>
            <p className={inputStyles.checkbox_label_text}>Для себя</p>
          </label>

          <input
            type="checkbox"
            className={inputStyles.checkbox_input}
            id="checkbox-11"
          />
          <label className={inputStyles.checkbox_label} htmlFor="checkbox-11">
            <span className={inputStyles.checkbox}></span>
            <p className={inputStyles.checkbox_label_text}>Для работы</p>
          </label>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
