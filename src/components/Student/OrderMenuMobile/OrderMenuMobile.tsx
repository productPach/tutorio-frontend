"use client";
import styles from "./OrderMenuMobile.module.css";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useEffect, useState } from "react";
import Image from "next/image";
import { setChat } from "@/store/features/chatSlice";
import Link from "next/link";
import {
  setComponentMenu,
  updateScrollPosition,
} from "@/store/features/orderSlice";
import clsx from "clsx";
import { useRouter } from "next/navigation";

interface LeftBarOrderProps {
  page?: string; // Строковый пропс для указания страницы, если нужно
}

const OrderMenuMobile: React.FC<LeftBarOrderProps> = ({ page }) => {
  const route = useRouter();
  const dispatch = useAppDispatch();
  // Получаем стейт храниения компонента для отображения
  const component = useAppSelector((state) => state.orders.componentMenu);
  // Вытаскиваем значение сколла их redux, чтобы это значение передать в top для стиля leftbar
  const scrollYForLeftBar = useAppSelector((state) => state.modal.scrollY);
  const [isSafari, setIsSafari] = useState(false);

  // Определяем, используется ли Safari
  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes("safari") && !ua.includes("chrome")) {
      setIsSafari(true);
    }
  }, []);

  return (
    <>
      <div className={styles.containerMenu}>
        <div
          className={styles.wrapMenuM}
          style={isSafari ? undefined : { top: `${scrollYForLeftBar}px` }}
        >
          <div className={styles.containerUlM}>
            <ul className={styles.ulM}>
              {page && page === "Tutor" ? (
                <>
                  <li
                    className={clsx(styles.liM, {
                      [styles.activeLi]: component === 1,
                    })}
                    onClick={() => {
                      dispatch(setComponentMenu(1));
                      dispatch(
                        updateScrollPosition({
                          scrollPosition: 0,
                          scrollHeight: 0,
                        })
                      );
                      dispatch(setChat(null));
                      route.push("../");
                    }}
                  >
                    <Image
                      src="/../img/icon/tutor/orders.svg"
                      alt="Заказы"
                      width={32}
                      height={32}
                    />
                    <span
                      className={clsx(styles.left_menu__list_text, {
                        [styles.undrln]: component === 1,
                      })}
                    >
                      Заказ
                    </span>
                  </li>
                  <li
                    className={clsx(styles.liM, {
                      [styles.activeLi]: component === 7,
                    })}
                    onClick={() => {
                      dispatch(setComponentMenu(7));
                      dispatch(
                        updateScrollPosition({
                          scrollPosition: 0,
                          scrollHeight: 0,
                        })
                      );
                      dispatch(setChat(null));
                      route.push("../");
                    }}
                  >
                    <Image
                      src="/../img/icon/tutor/response.svg"
                      alt="Отклики"
                      width={32}
                      height={32}
                    />
                    <span
                      className={clsx(styles.left_menu__list_text, {
                        [styles.undrln]: component === 7,
                      })}
                    >
                      Отклики
                    </span>
                  </li>

                  <li
                    className={clsx(styles.liM, {
                      [styles.activeLi]: component === 2,
                    })}
                    onClick={() => {
                      dispatch(setComponentMenu(2));
                      dispatch(
                        updateScrollPosition({
                          scrollPosition: 0,
                          scrollHeight: 0,
                        })
                      );
                      dispatch(setChat(null));
                      route.push("../");
                    }}
                  >
                    <Image
                      src="/../img/icon/tutor/settings.svg"
                      alt="Настройки"
                      width={32}
                      height={32}
                    />
                    <span
                      className={clsx(styles.left_menu__list_text, {
                        [styles.undrln]: component === 2,
                      })}
                    >
                      Репетиторы
                    </span>
                  </li>
                  <li
                    className={clsx(styles.liM, {
                      [styles.activeLi]: component === 3,
                    })}
                    onClick={() => {
                      dispatch(setComponentMenu(3));
                      dispatch(
                        updateScrollPosition({
                          scrollPosition: 0,
                          scrollHeight: 0,
                        })
                      );
                      dispatch(setChat(null));
                      route.push("../");
                    }}
                  >
                    <Image
                      src="/../img/icon/tutor/base.svg"
                      alt="Настройки"
                      width={32}
                      height={32}
                    />
                    <span
                      className={clsx(styles.left_menu__list_text, {
                        [styles.undrln]: component === 3,
                      })}
                    >
                      Помощь
                    </span>
                  </li>
                </>
              ) : (
                <>
                  <li
                    className={clsx(styles.liM, {
                      [styles.activeLi]: component === 1,
                    })}
                    onClick={() => {
                      dispatch(setComponentMenu(1));
                      dispatch(setChat(null));
                    }}
                  >
                    <Image
                      src="/../img/icon/tutor/orders.svg"
                      alt="Заказы"
                      width={32}
                      height={32}
                    />
                    <span
                      className={clsx(styles.left_menu__list_text, {
                        [styles.undrln]: component === 1,
                      })}
                    >
                      Заказ
                    </span>
                  </li>
                  <li
                    className={clsx(styles.liM, {
                      [styles.activeLi]: component === 7,
                    })}
                    onClick={() => {
                      dispatch(setComponentMenu(7));
                      dispatch(setChat(null));
                    }}
                  >
                    <Image
                      src="/../img/icon/tutor/response.svg"
                      alt="Отклики"
                      width={32}
                      height={32}
                    />
                    <span
                      className={clsx(styles.left_menu__list_text, {
                        [styles.undrln]: component === 7,
                      })}
                    >
                      Отклики
                    </span>
                  </li>
                  <li
                    className={clsx(styles.liM, {
                      [styles.activeLi]: component === 2,
                    })}
                    onClick={() => {
                      dispatch(setComponentMenu(2));
                      dispatch(setChat(null));
                    }}
                  >
                    <Image
                      src="/../img/icon/tutor/settings.svg"
                      alt="Настройки"
                      width={32}
                      height={32}
                    />
                    <span
                      className={clsx(styles.left_menu__list_text, {
                        [styles.undrln]: component === 2,
                      })}
                    >
                      Репетиторы
                    </span>
                  </li>
                  <li
                    className={clsx(styles.liM, {
                      [styles.activeLi]: component === 3,
                    })}
                    onClick={() => {
                      dispatch(setComponentMenu(3));
                      dispatch(setChat(null));
                    }}
                  >
                    <Image
                      src="/../img/icon/tutor/base.svg"
                      alt="Настройки"
                      width={32}
                      height={32}
                    />
                    <span
                      className={clsx(styles.left_menu__list_text, {
                        [styles.undrln]: component === 3,
                      })}
                    >
                      Помощь
                    </span>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderMenuMobile;
