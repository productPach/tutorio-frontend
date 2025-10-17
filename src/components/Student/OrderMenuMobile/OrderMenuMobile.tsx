"use client";
import styles from "./OrderMenuMobile.module.css";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useEffect, useState } from "react";
import { setChat } from "@/store/features/chatSlice";
import {
  setComponentMenu,
  updateScrollPosition,
} from "@/store/features/orderSlice";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { MessageCircleQuestionMark, Send, Text, Users } from "lucide-react";
import { useTotalUnreadCount } from "@/hooks/useTotalUnreadCount";

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

  const unreadCount = useTotalUnreadCount();

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
                      route.push("../tab=1");
                    }}
                  >
                    <Text
                      size={24}
                      color={component === 1 ? "#343330" : "#777777"}
                      strokeWidth={component === 1 ? 1.5 : 1.25}
                      // fill={component === 1 ? "#e1e1e1" : "none"}
                    />
                    {/* <span className={styles.pulseDot} /> */}
                    <span
                      className={clsx(styles.left_menu__list_text, {
                        [styles.boldTM]: component === 1,
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
                      route.push("../tab=7");
                    }}
                  >
                    <Send
                      size={24}
                      color={component === 7 ? "#343330" : "#777777"}
                      strokeWidth={component === 7 ? 1.5 : 1.25}
                      // fill={component === 7 ? "#e1e1e1" : "none"}
                    />
                    {unreadCount > 0 && (
                      <span className={styles.unreadCountM}>{unreadCount}</span>
                    )}
                    <span
                      className={clsx(styles.left_menu__list_text, {
                        [styles.boldTM]: component === 7,
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
                      route.push("../tab=2");
                    }}
                  >
                    <Users
                      size={24}
                      color={component === 2 ? "#343330" : "#777777"}
                      strokeWidth={component === 2 ? 1.5 : 1.25}
                      // fill={component === 2 ? "#e1e1e1" : "none"}
                    />
                    <span
                      className={clsx(styles.left_menu__list_text, {
                        [styles.boldTM]: component === 2,
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
                      route.push("../tab=3");
                    }}
                  >
                    <MessageCircleQuestionMark
                      size={24}
                      color={component === 3 ? "#343330" : "#777777"}
                      strokeWidth={component === 3 ? 1.5 : 1.25}
                      // fill={component === 3 ? "#e1e1e1" : "none"}
                    />
                    <span
                      className={clsx(styles.left_menu__list_text, {
                        [styles.boldTM]: component === 3,
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
                      // меняем URL, добавляем query-параметр tab
                      route.push(`?tab=1`, { scroll: false });
                      dispatch(setChat(null));
                    }}
                  >
                    <Text
                      size={24}
                      color={component === 1 ? "#343330" : "#777777"}
                      strokeWidth={component === 1 ? 1.5 : 1.25}
                      // fill={component === 1 ? "#e1e1e1" : "none"}
                    />
                    {/* <span className={styles.pulseDot} /> */}
                    <span
                      className={clsx(styles.left_menu__list_text, {
                        [styles.boldTM]: component === 1,
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
                      // меняем URL, добавляем query-параметр tab
                      route.push(`?tab=7`, { scroll: false });
                      dispatch(setChat(null));
                    }}
                  >
                    {/* 
                    <MessageSquareText size={24} strokeWidth={1.25} /> */}
                    {/* <MessageSquareMore size={24} strokeWidth={1.25} /> */}
                    {/* <MessageCircleMore size={24} strokeWidth={1.25} /> */}
                    <Send
                      size={24}
                      color={component === 7 ? "#343330" : "#777777"}
                      strokeWidth={component === 7 ? 1.5 : 1.25}
                      // fill={component === 7 ? "#e1e1e1" : "none"}
                    />
                    {unreadCount > 0 && (
                      <span className={styles.unreadCountM}>{unreadCount}</span>
                    )}
                    <span
                      className={clsx(styles.left_menu__list_text, {
                        [styles.boldTM]: component === 7,
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
                      // меняем URL, добавляем query-параметр tab
                      route.push(`?tab=2`, { scroll: false });
                      dispatch(setChat(null));
                    }}
                  >
                    <Users
                      size={24}
                      color={component === 2 ? "#343330" : "#777777"}
                      strokeWidth={component === 2 ? 1.5 : 1.25}
                      // fill={component === 2 ? "#e1e1e1" : "none"}
                    />
                    <span
                      className={clsx(styles.left_menu__list_text, {
                        [styles.boldTM]: component === 2,
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
                      // меняем URL, добавляем query-параметр tab
                      route.push(`?tab=3`, { scroll: false });
                      dispatch(setChat(null));
                    }}
                  >
                    <MessageCircleQuestionMark
                      size={24}
                      color={component === 3 ? "#343330" : "#777777"}
                      strokeWidth={component === 3 ? 1.5 : 1.25}
                      // fill={component === 3 ? "#e1e1e1" : "none"}
                    />
                    <span
                      className={clsx(styles.left_menu__list_text, {
                        [styles.boldTM]: component === 3,
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
