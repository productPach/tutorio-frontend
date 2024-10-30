"use client";
import styles from "../layout.module.css";
import locationsStyles from "../locations.module.css";
import generalStyles from "../../general.module.css";
import clsx from "clsx";
import { useAppSelector } from "@/store/store";
import Image from "next/image";
import { useEffect, useState } from "react";

const TutorOrders: React.FC = () => {
  // Стейт для меню с ссылками помощи
  const [supportMenu, setSupportMenu] = useState(false);
  const tutor = useAppSelector((state) => state.tutor.tutor);
  useEffect(() => {
    localStorage.removeItem("confirm-code");
    localStorage.removeItem("current-user");
    localStorage.removeItem("origin-phone");
    localStorage.removeItem("confirm-time");
    localStorage.removeItem("_cr-tripData");
  }, []);

  const handleSupportMenu = () => {
    setSupportMenu((state) => !state);
  };
  return (
    <>
      <section className={clsx(styles.container, styles.center)}>
        <div className={styles.leftbar}>
          <div className={styles.left_menu}>
            <ul>
              <a href="orders.html">
                <li>
                  <Image
                    src="../img/icon/tutor/orders.svg"
                    alt="Заказы"
                    width={32}
                    height={32}
                  />
                  <span
                    className={clsx(styles.left_menu__list_text, styles.undrln)}
                  >
                    Заказы
                  </span>
                </li>
              </a>
              <a href="response.html">
                <li>
                  <Image
                    src="../img/icon/tutor/response.svg"
                    alt="Отклики"
                    width={32}
                    height={32}
                  />
                  <span className={clsx(styles.left_menu__list_text)}>
                    Отклики
                  </span>
                  <span className={styles.count_block}>9</span>
                </li>
              </a>
              <a href="profile.html">
                <li>
                  <Image
                    src="../img/icon/tutor/profile.svg"
                    alt="Анкета"
                    width={32}
                    height={32}
                  />
                  <span className={clsx(styles.left_menu__list_text)}>
                    Анкета
                  </span>
                </li>
              </a>
              <a href="wallet.html">
                <li>
                  <Image
                    src="../img/icon/tutor/balance.svg"
                    alt="Баланс"
                    width={32}
                    height={32}
                  />
                  <span className={clsx(styles.left_menu__list_text)}>
                    Баланс
                  </span>
                </li>
              </a>
              <a href="settings.html">
                <li>
                  <Image
                    src="../img/icon/tutor/settings.svg"
                    alt="Настройки"
                    width={32}
                    height={32}
                  />
                  <span className={clsx(styles.left_menu__list_text)}>
                    Настройки
                  </span>
                </li>
              </a>
              <li onClick={() => handleSupportMenu()}>
                <Image
                  src="../img/icon/tutor/support.svg"
                  alt="Помощь"
                  width={32}
                  height={32}
                />
                <span className={clsx(styles.left_menu__list_text)}>
                  Помощь
                </span>
                <span className={styles.count_block}>3</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M15.5359 10.4082L12.3539 13.5902C12.1586 13.7855 11.842 13.7855 11.6468 13.5902L8.46481 10.4082C8.26954 10.213 8.26954 9.8964 8.46481 9.70113C8.66007 9.50587 8.97665 9.50587 9.17191 9.70113L11.972 12.5012C11.9814 12.5007 11.9908 12.5004 12.0003 12.5004C12.0027 12.5004 12.0051 12.5004 12.0075 12.5005C12.0146 12.5006 12.0216 12.5008 12.0287 12.5012L14.8288 9.70113C15.024 9.50587 15.3406 9.50587 15.5359 9.70113C15.7311 9.8964 15.7311 10.213 15.5359 10.4082Z"
                    fill="#2A2A2A"
                  />
                </svg>
              </li>

              <ul
                className={clsx(styles.accrd_content, {
                  [styles.open]: supportMenu,
                })}
              >
                <a href="wiki.html">
                  <li style={{ padding: "12px 0 12px 40px" }}>
                    <span className={clsx(styles.left_menu__list_text)}>
                      База знаний
                    </span>
                  </li>
                </a>
                <a href="ask-question.html">
                  <li style={{ padding: "0 0 12px 40px" }}>
                    <span className={clsx(styles.left_menu__list_text)}>
                      Создать запрос
                    </span>
                  </li>
                </a>
                <a href="questions.html">
                  <li style={{ padding: "0 0 12px 40px" }}>
                    <span className={clsx(styles.left_menu__list_text)}>
                      Мои запросы
                    </span>
                    <span className={styles.count_block}>3</span>
                  </li>
                </a>
              </ul>
            </ul>
          </div>
        </div>

        <div className={styles.content}>
          <div className={clsx(styles.content_block, styles.info_block)}>
            <h3>Как работать с заказами</h3>
            <p className={styles.content_block_p}>
              Здесь отображаются новые заказы учеников с условиями, которые
              указаны у вас в анкете. Откликайтесь на заказ, чтобы ученик
              получил уведомление. Ученик свяжется с вами, если ваше предложение
              заинтересует его.
            </p>
            <button className={styles.buttonBlc} type="button">
              Всё понятно
            </button>
          </div>

          <a href="order.html">
            <div
              className={clsx(
                styles.content_block,
                styles.order_block,
                styles.crsr_pntr
              )}
            >
              <div className={styles.order_block_flx_rw_spbtw}>
                <h3>Математика</h3>
                <span className={styles.order_block_flx_rw_spbtw_price}>
                  1200 — 1500 ₽
                </span>
              </div>

              <p className={styles.content_block_p}>
                Подготовка к ОГЭ // Несколько месяцев до экзамена // 9 класс //
                Уровень&nbspученика&nbspнизкий
              </p>
              <p className={styles.content_block_p}>
                Нужен срочно крутой перец-репетитор
              </p>

              <div className={styles.order_block_flx_rw_flxstrt}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M13.5 12C13.5 13.6569 12.1569 15 10.5 15C8.84315 15 7.5 13.6569 7.5 12C7.5 10.3431 8.84315 9 10.5 9C12.1569 9 13.5 10.3431 13.5 12ZM12.5 12C12.5 13.1046 11.6046 14 10.5 14C9.39543 14 8.5 13.1046 8.5 12C8.5 10.8954 9.39543 10 10.5 10C11.6046 10 12.5 10.8954 12.5 12Z"
                    fill="#2A2A2A"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M17 17V15L19.2764 16.1382C19.6088 16.3044 20 16.0627 20 15.691V8.30902C20 7.93733 19.6088 7.69558 19.2764 7.8618L17 9V7C17 5.89543 16.1046 5 15 5H6C4.89543 5 4 5.89543 4 7V17C4 18.1046 4.89543 19 6 19H15C16.1046 19 17 18.1046 17 17ZM15 6H6C5.44772 6 5 6.44772 5 7V17C5 17.5523 5.44772 18 6 18H15C15.5523 18 16 17.5523 16 17V7C16 6.44772 15.5523 6 15 6ZM19 14.882L17 13.882V10.118L19 9.11803V14.882Z"
                    fill="#2A2A2A"
                  />
                </svg>
                <span className={styles.order_block_flx_rw_flxstrt_text}>
                  Дистанционно — Москва
                </span>
              </div>

              <div className={styles.order_block_flx_rw_flxstrt}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M17.2326 10.0951L13.2326 6.96466C12.5086 6.398 11.4914 6.398 10.7674 6.96466L6.76738 10.0951C6.28301 10.4742 6 11.055 6 11.6701V16C6 17.1046 6.89543 18 8 18H12H16C17.1046 18 18 17.1046 18 16V11.6701C18 11.055 17.717 10.4742 17.2326 10.0951Z"
                    stroke="#2A2A2A"
                  />
                  <rect
                    x="9"
                    y="15"
                    width="6"
                    height="1"
                    rx="0.5"
                    fill="#2A2A2A"
                  />
                </svg>
                <span className={styles.order_block_flx_rw_flxstrt_text}>
                  Занятия у ученика —
                  <div className={locationsStyles.crcl_mtr_wrap}>
                    <div className={locationsStyles.crcl_mtr_container}>
                      <div
                        className={clsx(
                          styles.order_block,
                          locationsStyles.crcl_mtr,
                          locationsStyles.crcl_mtr_msk_7
                        )}
                      ></div>
                    </div>
                  </div>
                  Кузьминки
                </span>
              </div>

              <div className={styles.order_block_flx_rw_flxstrt}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M16.5 11C17.6046 11 18.5 10.1046 18.5 9C18.5 7.89543 17.6046 7 16.5 7C15.3954 7 14.5 7.89543 14.5 9C14.5 10.1046 15.3954 11 16.5 11ZM16.5 10C17.0523 10 17.5 9.55228 17.5 9C17.5 8.44772 17.0523 8 16.5 8C15.9477 8 15.5 8.44772 15.5 9C15.5 9.55228 15.9477 10 16.5 10Z"
                    fill="#2A2A2A"
                  />
                  <path
                    d="M13.8975 12.291L13.277 12.4461L11.881 14.0885C11.7021 14.2989 11.3866 14.3245 11.1762 14.1457C10.9658 13.9668 10.9402 13.6513 11.119 13.4409L12.5774 11.7251C12.6721 11.6137 12.7992 11.5348 12.941 11.4994L14.634 11.0761C15.1612 10.9443 15.578 11.5253 15.2843 11.9825L14.0247 13.9431L15.4927 14.7742C15.8062 14.9517 16 15.2842 16 15.6444V18C16 18.2761 15.7761 18.5 15.5 18.5C15.2239 18.5 15 18.2761 15 18V15.6444L13.1639 14.6049C12.864 14.4351 12.7684 14.0483 12.9547 13.7584L13.8975 12.291Z"
                    fill="#2A2A2A"
                  />
                  <path
                    d="M12.8969 15.0944C13.1209 15.2559 13.1716 15.5684 13.0101 15.7924L11.4056 18.018C11.2441 18.242 10.9316 18.2927 10.7076 18.1312C10.4836 17.9697 10.4329 17.6572 10.5944 17.4332L12.1989 15.2076C12.3604 14.9836 12.6729 14.9329 12.8969 15.0944Z"
                    fill="#2A2A2A"
                  />
                  <path
                    d="M16.6373 11.6897C16.3948 11.5577 16.0911 11.6474 15.9592 11.89C15.8273 12.1326 15.917 12.4362 16.1595 12.5681L17.7611 13.4392C18.0037 13.5712 18.3073 13.4815 18.4392 13.2389C18.5712 12.9963 18.4815 12.6927 18.2389 12.5608L16.6373 11.6897Z"
                    fill="#2A2A2A"
                  />
                  <path
                    d="M8.5 9.5C8.22386 9.5 8 9.72386 8 10C8 10.2761 8.22386 10.5 8.5 10.5H11.29C11.5662 10.5 11.79 10.2761 11.79 10C11.79 9.72386 11.5662 9.5 11.29 9.5H8.5Z"
                    fill="#2A2A2A"
                  />
                  <path
                    d="M5.5 12C5.5 11.7239 5.72386 11.5 6 11.5H8.79004C9.06618 11.5 9.29004 11.7239 9.29004 12C9.29004 12.2761 9.06618 12.5 8.79004 12.5H6C5.72386 12.5 5.5 12.2761 5.5 12Z"
                    fill="#2A2A2A"
                  />
                  <path
                    d="M7 13.5C6.72386 13.5 6.5 13.7239 6.5 14C6.5 14.2761 6.72386 14.5 7 14.5H9.79004C10.0662 14.5 10.29 14.2761 10.29 14C10.29 13.7239 10.0662 13.5 9.79004 13.5H7Z"
                    fill="#2A2A2A"
                  />
                </svg>
                <span className={styles.order_block_flx_rw_flxstrt_text}>
                  Готов приехать —
                  <div className={locationsStyles.crcl_mtr_wrap}>
                    <div className={locationsStyles.crcl_mtr_container}>
                      <div
                        className={clsx(
                          styles.order_block,
                          locationsStyles.crcl_mtr,
                          locationsStyles.crcl_mtr_msk_1
                        )}
                      ></div>
                      <div
                        className={clsx(
                          styles.order_block,
                          locationsStyles.crcl_mtr,
                          locationsStyles.crcl_mtr_msk_7
                        )}
                      ></div>
                    </div>
                  </div>
                  Кузьминки
                  <span
                    className={clsx(
                      styles.order_block_flx_rw_subtext,
                      generalStyles.mrgnLt5
                    )}
                  >
                    и ещё 7
                  </span>
                </span>
              </div>

              <div
                className={clsx(
                  styles.order_block_flx_rw_spbtw,
                  generalStyles.mrgnTp10
                )}
              >
                <button className={styles.buttonYlw} type="button">
                  Откликнуться
                </button>
                <span className={styles.order_block_flx_rw_subtext}>
                  3 минуты назад
                </span>
              </div>
            </div>
          </a>

          {/* <a href="order.html">
                    <div className="content__block order-block crsr-pntr">
                        <div className="order-block__flx-rw-spbtw">
                            <h3>Информатика</h3>
                            <span className="order-block__flx-rw-spbtw-price">900 ₽</span>
                        </div>
                        
                        <p className="content__block-p">Подготовка к ОГЭ // Несколько месяцев до экзамена // 9 класс // Уровень ученика низкий</p>
                        <p className="content__block-p">Нужен срочно крутой перец-репетитор</p>

                        <div className="order-block__flx-rw-flxstrt">
                            <img src="../media/icons/online.svg" alt="online" width="32">
                            <span>Дистанционно</span>
                        </div>

                        <div className="order-block__flx-rw-flxstrt">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M16.5 11C17.6046 11 18.5 10.1046 18.5 9C18.5 7.89543 17.6046 7 16.5 7C15.3954 7 14.5 7.89543 14.5 9C14.5 10.1046 15.3954 11 16.5 11ZM16.5 10C17.0523 10 17.5 9.55228 17.5 9C17.5 8.44772 17.0523 8 16.5 8C15.9477 8 15.5 8.44772 15.5 9C15.5 9.55228 15.9477 10 16.5 10Z" fill="#2A2A2A"/>
                                <path d="M13.8975 12.291L13.277 12.4461L11.881 14.0885C11.7021 14.2989 11.3866 14.3245 11.1762 14.1457C10.9658 13.9668 10.9402 13.6513 11.119 13.4409L12.5774 11.7251C12.6721 11.6137 12.7992 11.5348 12.941 11.4994L14.634 11.0761C15.1612 10.9443 15.578 11.5253 15.2843 11.9825L14.0247 13.9431L15.4927 14.7742C15.8062 14.9517 16 15.2842 16 15.6444V18C16 18.2761 15.7761 18.5 15.5 18.5C15.2239 18.5 15 18.2761 15 18V15.6444L13.1639 14.6049C12.864 14.4351 12.7684 14.0483 12.9547 13.7584L13.8975 12.291Z" fill="#2A2A2A"/>
                                <path d="M12.8969 15.0944C13.1209 15.2559 13.1716 15.5684 13.0101 15.7924L11.4056 18.018C11.2441 18.242 10.9316 18.2927 10.7076 18.1312C10.4836 17.9697 10.4329 17.6572 10.5944 17.4332L12.1989 15.2076C12.3604 14.9836 12.6729 14.9329 12.8969 15.0944Z" fill="#2A2A2A"/>
                                <path d="M16.6373 11.6897C16.3948 11.5577 16.0911 11.6474 15.9592 11.89C15.8273 12.1326 15.917 12.4362 16.1595 12.5681L17.7611 13.4392C18.0037 13.5712 18.3073 13.4815 18.4392 13.2389C18.5712 12.9963 18.4815 12.6927 18.2389 12.5608L16.6373 11.6897Z" fill="#2A2A2A"/>
                                <path d="M8.5 9.5C8.22386 9.5 8 9.72386 8 10C8 10.2761 8.22386 10.5 8.5 10.5H11.29C11.5662 10.5 11.79 10.2761 11.79 10C11.79 9.72386 11.5662 9.5 11.29 9.5H8.5Z" fill="#2A2A2A"/>
                                <path d="M5.5 12C5.5 11.7239 5.72386 11.5 6 11.5H8.79004C9.06618 11.5 9.29004 11.7239 9.29004 12C9.29004 12.2761 9.06618 12.5 8.79004 12.5H6C5.72386 12.5 5.5 12.2761 5.5 12Z" fill="#2A2A2A"/>
                                <path d="M7 13.5C6.72386 13.5 6.5 13.7239 6.5 14C6.5 14.2761 6.72386 14.5 7 14.5H9.79004C10.0662 14.5 10.29 14.2761 10.29 14C10.29 13.7239 10.0662 13.5 9.79004 13.5H7Z" fill="#2A2A2A"/>
                            </svg>
                            <span className="order-block__flx-rw-flxstrt-text">
                                Готов приехать — 
                                <div className="order-block crcl-mtr crcl-mtr__msk-2"></div>
                                <div className="order-block crcl-mtr crcl-mtr__msk-3"></div>
                                Бауманская
                                <span className="order-block__flx-rw-subtext">и ещё 3</span>
                            </span>
                        </div>

                        <div className="order-block__flx-rw-spbtw mrgn-tp-10">
                            <button className="buttonBlc" type="button">Перейти в чат</button>
                            <span className="order-block__flx-rw-subtext">47 минут назад</span>
                        </div>
                    </div>
                </a>

                <a href="order.html">
                    <div className="content__block order-block crsr-pntr">
                    <div className="order-block__flx-rw-spbtw">
                        <h3>Математика</h3>
                        <span className="order-block__flx-rw-spbtw-price">1200 — 1500 ₽</span>
                    </div>
                    
                    <p className="content__block-p">Подготовка к ОГЭ // Несколько месяцев до экзамена // 9 класс // Уровень ученика низкий</p>
                    <p className="content__block-p">Нужен срочно крутой перец-репетитор</p>

                    <div className="order-block__flx-rw-flxstrt">
                        <img src="../media/icons/online.svg" alt="online" width="32">
                        <span>Дистанционно</span>
                    </div>

                    <div className="order-block__flx-rw-spbtw mrgn-tp-10">
                        <button className="buttonYlw" type="button">Откликнуться</button>
                        <span className="order-block__flx-rw-subtext">3 часа назад</span>
                    </div>
                    </div>
                </a>
                
                <a href="order.html">
                    <div className="content__block order-block crsr-pntr">
                    <div className="order-block__flx-rw-spbtw">
                        <h3>Информатика</h3>
                        <span className="order-block__flx-rw-spbtw-price">900 ₽</span>
                    </div>
                    
                    <p className="content__block-p">Подготовка к ОГЭ // Несколько месяцев до экзамена // 9 класс // Уровень ученика низкий</p>
                    <p className="content__block-p">Нужен срочно крутой перец-репетитор</p>

                    <div className="order-block__flx-rw-flxstrt">
                        <img src="../media/icons/online.svg" alt="online" width="32">
                        <span>Дистанционно</span>
                    </div>

                    <div className="order-block__flx-rw-spbtw mrgn-tp-10">
                        <button className="buttonYlw" type="button">Откликнуться</button>
                        <span className="order-block__flx-rw-subtext">3 часа назад</span>
                    </div>
                    </div>
                </a>
        
                <a href="order.html">
                    <div className="content__block order-block crsr-pntr">
                    <div className="order-block__flx-rw-spbtw">
                        <h3>Математика</h3>
                        <span className="order-block__flx-rw-spbtw-price">1200 — 1500 ₽</span>
                    </div>
                    
                    <p className="content__block-p">Подготовка к ОГЭ // Несколько месяцев до экзамена // 9 класс // Уровень ученика низкий</p>
                    <p className="content__block-p">Нужен срочно крутой перец-репетитор</p>

                    <div className="order-block__flx-rw-flxstrt">
                        <img src="../media/icons/online.svg" alt="online" width="32">
                        <span>Дистанционно</span>
                    </div>

                    <div className="order-block__flx-rw-spbtw mrgn-tp-10">
                        <button className="buttonYlw" type="button">Откликнуться</button>
                        <span className="order-block__flx-rw-subtext">4 часа назад</span>
                    </div>
                    </div>
                </a>
                
                <a href="order.html">
                    <div className="content__block order-block crsr-pntr">
                    <div className="order-block__flx-rw-spbtw">
                        <h3>Информатика</h3>
                        <span className="order-block__flx-rw-spbtw-price">900 ₽</span>
                    </div>
                    
                    <p className="content__block-p">Подготовка к ОГЭ // Несколько месяцев до экзамена // 9 класс // Уровень ученика низкий</p>
                    <p className="content__block-p">Нужен срочно крутой перец-репетитор</p>

                    <div className="order-block__flx-rw-flxstrt">
                        <img src="../media/icons/online.svg" alt="online" width="32">
                        <span>Дистанционно</span>
                    </div>

                    <div className="order-block__flx-rw-spbtw mrgn-tp-10">
                        <button className="buttonYlw" type="button">Откликнуться</button>
                        <span className="order-block__flx-rw-subtext">вчера в 21:57</span>
                    </div>
                    </div>
                </a> */}
        </div>

        <div className="sidebar">
          <div className="sidebar__filter">
            <div>
              <p className="sidebar__title">Место занятий</p>
              <input
                type="checkbox"
                className="checkbox-input"
                id="checkbox-1"
              />
              <label className="checkbox-label" htmlFor="checkbox-1">
                <span className="checkbox"></span>
                <p className="checkbox-label__text">Дистанционно</p>
              </label>

              <input
                type="checkbox"
                className="checkbox-input"
                id="checkbox-2"
              />
              <label className="checkbox-label" htmlFor="checkbox-2">
                <span className="checkbox"></span>
                <p className="checkbox-label__text">У репетитора</p>
              </label>

              <input
                type="checkbox"
                className="checkbox-input"
                id="checkbox-3"
              />
              <label className="checkbox-label" htmlFor="checkbox-3">
                <span className="checkbox"></span>
                <p className="checkbox-label__text">У ученика</p>
              </label>
            </div>

            <div>
              <p className="sidebar__title">Регион</p>
              <div className="header__geo sidebar-geo">
                {/* <img src="../media/icons/location.svg" width="15" alt="Выбор города"> */}
                Москва
              </div>
            </div>

            <div>
              <p className="sidebar__title">Цель занятий</p>
              <input
                type="checkbox"
                className="checkbox-input"
                id="checkbox-4"
              />
              <label className="checkbox-label" htmlFor="checkbox-4">
                <span className="checkbox"></span>
                <p className="checkbox-label__text">
                  Всероссийская проверочная работа (ВПР)
                </p>
              </label>

              <input
                type="checkbox"
                className="checkbox-input"
                id="checkbox-5"
              />
              <label className="checkbox-label" htmlFor="checkbox-5">
                <span className="checkbox"></span>
                <p className="checkbox-label__text">
                  Подготовка к экзамену в&nbspвузе
                </p>
              </label>

              <input
                type="checkbox"
                className="checkbox-input"
                id="checkbox-6"
              />
              <label className="checkbox-label" htmlFor="checkbox-6">
                <span className="checkbox"></span>
                <p className="checkbox-label__text">Подготовка к ЕГЭ</p>
              </label>

              <input
                type="checkbox"
                className="checkbox-input"
                id="checkbox-7"
              />
              <label className="checkbox-label" htmlFor="checkbox-7">
                <span className="checkbox"></span>
                <p className="checkbox-label__text">Подготовка к школе</p>
              </label>

              <input
                type="checkbox"
                className="checkbox-input"
                id="checkbox-8"
              />
              <label className="checkbox-label" htmlFor="checkbox-8">
                <span className="checkbox"></span>
                <p className="checkbox-label__text">Повышение успеваемости</p>
              </label>

              <input
                type="checkbox"
                className="checkbox-input"
                id="checkbox-9"
              />
              <label className="checkbox-label" htmlFor="checkbox-9">
                <span className="checkbox"></span>
                <p className="checkbox-label__text">Подготовка к ОГЭ</p>
              </label>

              <input
                type="checkbox"
                className="checkbox-input"
                id="checkbox-10"
              />
              <label className="checkbox-label" htmlFor="checkbox-10">
                <span className="checkbox"></span>
                <p className="checkbox-label__text">Для себя</p>
              </label>

              <input
                type="checkbox"
                className="checkbox-input"
                id="checkbox-11"
              />
              <label className="checkbox-label" htmlFor="checkbox-11">
                <span className="checkbox"></span>
                <p className="checkbox-label__text">Для работы</p>
              </label>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default TutorOrders;
