import { useDispatch } from "react-redux";
import generalStyle from "../../../../app/general.module.css";
import styles from "../../../../app/tutor/layout.module.css";
import componentStyle from "../Wiki.module.css";

import clsx from "clsx";
import { AppDispatch, useAppSelector } from "@/store/store";
import Image from "next/image";
import {
  setIsModalFio,
  setIsModalProfileInfo,
} from "@/store/features/modalSlice";

export const GettingStarted = () => {
  const dispatch = useDispatch<AppDispatch>();
  const token = useAppSelector((state) => state.auth.token);
  const tutor = useAppSelector((state) => state.tutor.tutor);
  return (
    <>
      <div className={styles.content_block}>
        <h3>📌 Начало работы</h3>
      </div>

      <div className={componentStyle.contentFlxRw}>
        <div className={componentStyle.wikiBlock}>
          <div className={componentStyle.container}>
            <h2 className={componentStyle.titleWiki}>📌 Начало работы</h2>
            <span>
              Узнайте, как зарегистрироваться, заполнить профиль и подготовиться
              к первым заказам
            </span>
          </div>
        </div>
        <div className={componentStyle.wikiBlock}>
          <div className={componentStyle.container}>
            <h2 className={componentStyle.titleWiki}>🛠️ Настройка анкеты</h2>
            <span>
              Подробное руководство по редактированию анкеты: добавление
              предметов, указание цен и описания
            </span>
          </div>
        </div>
        <div className={componentStyle.wikiBlock}>
          <div className={componentStyle.container}>
            <h2 className={componentStyle.titleWiki}>📨 Заказы и отклики</h2>
            <span>
              Как искать заказы, откликаться на них и общаться с клиентами для
              успешного сотрудничества
            </span>
          </div>
        </div>
        <div className={componentStyle.wikiBlock}>
          <div className={componentStyle.container}>
            <h2 className={componentStyle.titleWiki}>⚠️ Правила платформы</h2>
            <span>
              Основные требования и рекомендации для репетиторов: что можно и
              нельзя делать на платформе
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
