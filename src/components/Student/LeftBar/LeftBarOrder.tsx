"use client";
import styles from "../../../app/tutor/layout.module.css";
import clsx from "clsx";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  setComponentMenu,
  updateScrollPosition,
} from "@/store/features/orderSlice";
import { useRouter } from "next/navigation";

interface LeftBarOrderProps {
  page?: string; // Строковый пропс для указания страницы, если нужно
}

const LeftBarOrder: React.FC<LeftBarOrderProps> = ({ page }) => {
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

  const router = useRouter();

  const handleBack = () => {
    router.back(); // Возврат на предыдущую страницу
  };

  return (
    <div
      className={styles.leftbar}
      style={isSafari ? undefined : { top: `${scrollYForLeftBar}px` }}
    >
      {component === 4 ? (
        <div onClick={() => handleBack()} className={styles.left_menu}>
          <ul>
            <li>
              <Image
                src="/../img/icon/tutor/go-back.svg"
                alt="Заказы"
                width={32}
                height={32}
              />
              <span className={styles.left_menu__list_text}>
                Вернуться назад
              </span>
            </li>
          </ul>
        </div>
      ) : (
        <Link href={"../orders"}>
          <div className={styles.left_menu}>
            <ul>
              <li>
                <Image
                  src="/../img/icon/tutor/go-back.svg"
                  alt="Заказы"
                  width={32}
                  height={32}
                />
                <span className={styles.left_menu__list_text}>
                  Список заказов
                </span>
              </li>
            </ul>
          </div>
        </Link>
      )}
      <div className={styles.left_menu}>
        <ul>
          {page && page === "Tutor" ? (
            <>
              <li
                onClick={() => {
                  dispatch(setComponentMenu(1));
                  dispatch(
                    updateScrollPosition({ scrollPosition: 0, scrollHeight: 0 })
                  );
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
                  Условия заказа
                </span>
              </li>
              <li
                onClick={() => {
                  dispatch(setComponentMenu(2));
                  dispatch(
                    updateScrollPosition({ scrollPosition: 0, scrollHeight: 0 })
                  );
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
                onClick={() => {
                  dispatch(setComponentMenu(3));
                  dispatch(
                    updateScrollPosition({ scrollPosition: 0, scrollHeight: 0 })
                  );
                  route.push("../");
                }}
              >
                <Image
                  src="/../img/icon/tutor/base.svg"
                  alt="Настройки"
                  width={27}
                  height={27}
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
              <li onClick={() => dispatch(setComponentMenu(1))}>
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
                  Условия заказа
                </span>
              </li>
              <li onClick={() => dispatch(setComponentMenu(2))}>
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
              <li onClick={() => dispatch(setComponentMenu(3))}>
                <Image
                  src="/../img/icon/tutor/base.svg"
                  alt="Настройки"
                  width={27}
                  height={27}
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
  );
};

export default LeftBarOrder;
