"use client";
import generalStyles from "../../../app/student/layout.module.css";
import styles from "../Order/Order.module.css";
import { SpinnerOrders } from "@/components/Spinner/SpinnerOrders";
import clsx from "clsx";
import { City, Order, Student } from "@/types/types";
import Image from "next/image";
import { host, port } from "@/api/server/configApi";
import Lightbox from "yet-another-react-lightbox"; // Импортируем Lightbox
import "yet-another-react-lightbox/styles.css";
import { useState } from "react";

type OrderProps = {
  loading: boolean;
  student: Student | null;
  orderById: Order | null;
  error: string | null;
  locations: City[];
};

export const TutorsComponent = ({
  loading,
  student,
  orderById,
  error,
  locations,
}: OrderProps) => {
  // Стейт для управления состоянием галереи (открыта ли она)
  const [openLightbox, setOpenLightbox] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Обработчик клика по изображению для открытия Lightbox
  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index); // Устанавливаем текущий индекс изображения
    setOpenLightbox(true); // Открываем Lightbox
  };

  const handleClose = () => {
    setOpenLightbox(false); // Закрываем Lightbox
  };

  if (loading && !student?.name)
    return (
      <div className={generalStyles.container__spinner}>
        <div className={generalStyles.spinner}>
          <SpinnerOrders />
        </div>
      </div>
    );

  if (error) return <div>Видимо, что-то сломалось. Попробуйте зайти позже</div>;

  return (
    <>
      <div
        className={clsx(
          generalStyles.content_block,
          generalStyles.order_block,
          generalStyles.crsr_pntr,
          styles.order_gap
        )}
      >
        <div className={styles.tutorImgFioContainer}>
          <div className={styles.flex1}>
            <Image
              className={styles.tutorImg}
              src={`${host}${port}/uploads/67ddb6b808999575640c78b9_1743151026976-2809.png`}
              width={120}
              height={120}
              alt=""
            />
          </div>
          <div className={styles.flex4}>
            <div className={clsx(styles.containerFlxRw, styles.jtfCntSpBtwn)}>
              <h3>Федотов Павел Сергеевич</h3>
              <div className={styles.containerIsOnline}>
                <div className={styles.isOnline}></div>
                <span>В сети</span>
              </div>
            </div>

            <div className={clsx(styles.containerIsOnline, styles.mt6px)}>
              <Image
                src="../../img/icon/location.svg"
                alt="Геолокация"
                width={15}
                height={18}
                className={styles.header_geoImage}
              />
              <span>Москва и Московская область</span>
            </div>
            <div className={clsx(styles.containerIsOnline, styles.mt6px)}>
              Дистанционно&nbsp;🖥️ // У себя&nbsp;🏠 // Выезд к ученику&nbsp;📍
            </div>
            <div className={clsx(styles.containerIsOnline, styles.mt6px)}>
              <div className={styles.passportControl}>
                ✅&nbsp;Паспорт проверен
              </div>
            </div>
          </div>
        </div>

        <div className={styles.containerOrderInfo}>
          <span className={styles.titleTutorInfo}>О себе</span>
          <div>
            Привет! <br></br>
            👋 Я — репетитор по английскому с опытом 5 лет и готов помочь вам
            заговорить уверенно! 🎯
            <br></br>
            <br></br>
            На моих уроках мы: <br></br>✨ Разберем грамматику на понятных
            примерах. <br></br>🗣 Прокачаем разговорный английский и уберем
            страх общения. <br></br>📚 Расширим словарный запас через интересные
            тексты, видео и диалоги. <br></br>🎓 Подготовимся к экзаменам (ЕГЭ,
            ОГЭ, IELTS, TOEFL). <br></br>
            <br></br>Занятия проходят онлайн или офлайн в дружелюбной атмосфере.
            Готовы учиться? Тогда начнем! 🚀
          </div>
        </div>

        <div className={styles.containerOrderInfo}>
          <span className={styles.titleTutorInfo}>Образование</span>

          <ul>
            <li className={styles.listEducation}>
              МГТУ им. Н.Э. Баумана (2009-2015)
            </li>
            <li className={styles.listEducation}>
              Frontend-разработчик (2023-2024)
            </li>
          </ul>
        </div>

        <div className={styles.containerOrderInfo}>
          <span className={styles.titleTutorInfo}>
            Диплом, сертификаты и другие документы
          </span>

          <ul>
            <li className={styles.listEducation}>
              МГТУ им. Н.Э. Баумана (2009-2015)
            </li>
            <li className={styles.listEducation}>
              Frontend-разработчик (2023-2024)
            </li>
          </ul>
        </div>

        <div className={styles.containerOrderInfo}>
          <span className={styles.titleTutorInfo}>Стоимость занятий</span>

          <div>
            <span className={styles.priceInt}>3&nbsp;000 ₽</span> / 60 мин
            (дистанционно)
          </div>
        </div>

        <button
          className={clsx(
            generalStyles.content_block_button,
            generalStyles.buttonYlw
          )}
        >
          Предложить заказ
        </button>
        {/* <button
          className={clsx(
            generalStyles.content_block_button,
            generalStyles.buttonBlc
          )}
        >
          Перейти в чат
        </button> */}
      </div>

      <div
        className={clsx(
          generalStyles.content_block,
          generalStyles.order_block,
          generalStyles.crsr_pntr,
          styles.order_gap
        )}
      >
        <div className={styles.tutorImgFioContainer}>
          <div className={styles.flex1}>
            <Image
              className={styles.tutorImg}
              src={`${host}${port}/uploads/67ddb6b808999575640c78b9_1743151026976-2809.png`}
              width={120}
              height={120}
              alt=""
            />
          </div>
          <div className={styles.flex4}>
            <div className={clsx(styles.containerFlxRw, styles.jtfCntSpBtwn)}>
              <h3>Федотов Павел Сергеевич</h3>
              <div className={styles.containerIsOnline}>
                <div className={styles.isOnline}></div>
                <span>В сети</span>
              </div>
            </div>

            <div className={clsx(styles.containerIsOnline, styles.mt6px)}>
              <Image
                src="../../img/icon/location.svg"
                alt="Геолокация"
                width={15}
                height={18}
                className={styles.header_geoImage}
              />
              <span>Москва и Московская область</span>
            </div>
            <div className={clsx(styles.containerIsOnline, styles.mt6px)}>
              Дистанционно&nbsp;🖥️ // У себя&nbsp;🏠 // Выезд к ученику&nbsp;📍
            </div>
            <div className={clsx(styles.containerIsOnline, styles.mt6px)}>
              <div className={styles.passportControl}>
                ✅&nbsp;Паспорт проверен
              </div>
            </div>
          </div>
        </div>

        <div className={styles.containerOrderInfo}>
          <span className={styles.titleTutorInfo}>О себе</span>
          <div>
            Привет! <br></br>
            👋 Я — репетитор по английскому с опытом 5 лет и готов помочь вам
            заговорить уверенно! 🎯
            <br></br>
            <br></br>
            На моих уроках мы: <br></br>✨ Разберем грамматику на понятных
            примерах. <br></br>🗣 Прокачаем разговорный английский и уберем
            страх общения. <br></br>📚 Расширим словарный запас через интересные
            тексты, видео и диалоги. <br></br>🎓 Подготовимся к экзаменам (ЕГЭ,
            ОГЭ, IELTS, TOEFL). <br></br>
            <br></br>Занятия проходят онлайн или офлайн в дружелюбной атмосфере.
            Готовы учиться? Тогда начнем! 🚀
          </div>
        </div>

        <div className={styles.containerOrderInfo}>
          <span className={styles.titleTutorInfo}>Образование</span>

          <ul>
            <li className={styles.listEducation}>
              МГТУ им. Н.Э. Баумана (2009-2015)
            </li>
            <li className={styles.listEducation}>
              Frontend-разработчик (2023-2024)
            </li>
          </ul>
        </div>

        <div className={styles.containerOrderInfo}>
          <span className={styles.titleTutorInfo}>
            Диплом, сертификаты и другие документы
          </span>

          <ul>
            <li className={styles.listEducation}>
              МГТУ им. Н.Э. Баумана (2009-2015)
            </li>
            <li className={styles.listEducation}>
              Frontend-разработчик (2023-2024)
            </li>
          </ul>
        </div>

        <div className={styles.containerOrderInfo}>
          <span className={styles.titleTutorInfo}>Стоимость занятий</span>

          <div>
            <span className={styles.priceInt}>3&nbsp;000 ₽</span> / 60 мин
            (дистанционно)
          </div>
        </div>

        <button
          className={clsx(
            generalStyles.content_block_button,
            generalStyles.buttonYlw
          )}
        >
          Предложить заказ
        </button>
        {/* <button
          className={clsx(
            generalStyles.content_block_button,
            generalStyles.buttonBlc
          )}
        >
          Перейти в чат
        </button> */}
      </div>

      <div
        className={clsx(
          generalStyles.content_block,
          generalStyles.order_block,
          generalStyles.crsr_pntr,
          styles.order_gap
        )}
      >
        <div className={styles.tutorImgFioContainer}>
          <div className={styles.flex1}>
            <Image
              className={styles.tutorImg}
              src={`${host}${port}/uploads/67ddb6b808999575640c78b9_1743151026976-2809.png`}
              width={120}
              height={120}
              alt=""
            />
          </div>
          <div className={styles.flex4}>
            <div className={clsx(styles.containerFlxRw, styles.jtfCntSpBtwn)}>
              <h3>Федотов Павел Сергеевич</h3>
              <div className={styles.containerIsOnline}>
                <div className={styles.isOnline}></div>
                <span>В сети</span>
              </div>
            </div>

            <div className={clsx(styles.containerIsOnline, styles.mt6px)}>
              <Image
                src="../../img/icon/location.svg"
                alt="Геолокация"
                width={15}
                height={18}
                className={styles.header_geoImage}
              />
              <span>Москва и Московская область</span>
            </div>
            <div className={clsx(styles.containerIsOnline, styles.mt6px)}>
              Дистанционно&nbsp;🖥️ // У себя&nbsp;🏠 // Выезд к ученику&nbsp;📍
            </div>
            <div className={clsx(styles.containerIsOnline, styles.mt6px)}>
              <div className={styles.passportControl}>
                ✅&nbsp;Паспорт проверен
              </div>
            </div>
          </div>
        </div>

        <div className={styles.containerOrderInfo}>
          <span className={styles.titleTutorInfo}>О себе</span>
          <div>
            Привет! <br></br>
            👋 Я — репетитор по английскому с опытом 5 лет и готов помочь вам
            заговорить уверенно! 🎯
            <br></br>
            <br></br>
            На моих уроках мы: <br></br>✨ Разберем грамматику на понятных
            примерах. <br></br>🗣 Прокачаем разговорный английский и уберем
            страх общения. <br></br>📚 Расширим словарный запас через интересные
            тексты, видео и диалоги. <br></br>🎓 Подготовимся к экзаменам (ЕГЭ,
            ОГЭ, IELTS, TOEFL). <br></br>
            <br></br>Занятия проходят онлайн или офлайн в дружелюбной атмосфере.
            Готовы учиться? Тогда начнем! 🚀
          </div>
        </div>

        <div className={styles.containerOrderInfo}>
          <span className={styles.titleTutorInfo}>Образование</span>

          <ul>
            <li className={styles.listEducation}>
              МГТУ им. Н.Э. Баумана (2009-2015)
            </li>
            <li className={styles.listEducation}>
              Frontend-разработчик (2023-2024)
            </li>
          </ul>
        </div>

        <div className={styles.containerOrderInfo}>
          <span className={styles.titleTutorInfo}>
            Диплом, сертификаты и другие документы
          </span>

          <ul>
            <li className={styles.listEducation}>
              МГТУ им. Н.Э. Баумана (2009-2015)
            </li>
            <li className={styles.listEducation}>
              Frontend-разработчик (2023-2024)
            </li>
          </ul>
        </div>

        <div className={styles.containerOrderInfo}>
          <span className={styles.titleTutorInfo}>Стоимость занятий</span>

          <div>
            <span className={styles.priceInt}>3&nbsp;000 ₽</span> / 60 мин
            (дистанционно)
          </div>
        </div>

        <button
          className={clsx(
            generalStyles.content_block_button,
            generalStyles.buttonYlw
          )}
        >
          Предложить заказ
        </button>
        {/* <button
          className={clsx(
            generalStyles.content_block_button,
            generalStyles.buttonBlc
          )}
        >
          Перейти в чат
        </button> */}
      </div>

      <div
        className={clsx(
          generalStyles.content_block,
          generalStyles.order_block,
          generalStyles.crsr_pntr,
          styles.order_gap
        )}
      >
        <div className={styles.tutorImgFioContainer}>
          <div className={styles.flex1}>
            <Image
              className={styles.tutorImg}
              src={`${host}${port}/uploads/67ddb6b808999575640c78b9_1743151026976-2809.png`}
              width={120}
              height={120}
              alt=""
            />
          </div>
          <div className={styles.flex4}>
            <div className={clsx(styles.containerFlxRw, styles.jtfCntSpBtwn)}>
              <h3>Федотов Павел Сергеевич</h3>
              <div className={styles.containerIsOnline}>
                <div className={styles.isOnline}></div>
                <span>В сети</span>
              </div>
            </div>

            <div className={clsx(styles.containerIsOnline, styles.mt6px)}>
              <Image
                src="../../img/icon/location.svg"
                alt="Геолокация"
                width={15}
                height={18}
                className={styles.header_geoImage}
              />
              <span>Москва и Московская область</span>
            </div>
            <div className={clsx(styles.containerIsOnline, styles.mt6px)}>
              Дистанционно&nbsp;🖥️ // У себя&nbsp;🏠 // Выезд к ученику&nbsp;📍
            </div>
            <div className={clsx(styles.containerIsOnline, styles.mt6px)}>
              <div className={styles.passportControl}>
                ✅&nbsp;Паспорт проверен
              </div>
            </div>
          </div>
        </div>

        <div className={styles.containerOrderInfo}>
          <span className={styles.titleTutorInfo}>О себе</span>
          <div>
            Привет! <br></br>
            👋 Я — репетитор по английскому с опытом 5 лет и готов помочь вам
            заговорить уверенно! 🎯
            <br></br>
            <br></br>
            На моих уроках мы: <br></br>✨ Разберем грамматику на понятных
            примерах. <br></br>🗣 Прокачаем разговорный английский и уберем
            страх общения. <br></br>📚 Расширим словарный запас через интересные
            тексты, видео и диалоги. <br></br>🎓 Подготовимся к экзаменам (ЕГЭ,
            ОГЭ, IELTS, TOEFL). <br></br>
            <br></br>Занятия проходят онлайн или офлайн в дружелюбной атмосфере.
            Готовы учиться? Тогда начнем! 🚀
          </div>
        </div>

        <div className={styles.containerOrderInfo}>
          <span className={styles.titleTutorInfo}>Образование</span>

          <ul>
            <li className={styles.listEducation}>
              МГТУ им. Н.Э. Баумана (2009-2015)
            </li>
            <li className={styles.listEducation}>
              Frontend-разработчик (2023-2024)
            </li>
          </ul>
        </div>

        <div className={styles.containerOrderInfo}>
          <span className={styles.titleTutorInfo}>
            Диплом, сертификаты и другие документы
          </span>

          <ul>
            <li className={styles.listEducation}>
              МГТУ им. Н.Э. Баумана (2009-2015)
            </li>
            <li className={styles.listEducation}>
              Frontend-разработчик (2023-2024)
            </li>
          </ul>
        </div>

        <div className={styles.containerOrderInfo}>
          <span className={styles.titleTutorInfo}>Стоимость занятий</span>

          <div>
            <span className={styles.priceInt}>3&nbsp;000 ₽</span> / 60 мин
            (дистанционно)
          </div>
        </div>

        <button
          className={clsx(
            generalStyles.content_block_button,
            generalStyles.buttonYlw
          )}
        >
          Предложить заказ
        </button>
        {/* <button
          className={clsx(
            generalStyles.content_block_button,
            generalStyles.buttonBlc
          )}
        >
          Перейти в чат
        </button> */}
      </div>
    </>
  );
};
