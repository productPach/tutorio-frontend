"use client";
import styles from "./BottomMenuMobile.module.css";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useEffect, useState } from "react";
import { setChat } from "@/store/features/chatSlice";
import {
  setComponentMenu,
  updateScrollPosition,
} from "@/store/features/orderSlice";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import {
  MessageCircleQuestionMark,
  Send,
  Text,
  Users,
  Wallet,
} from "lucide-react";
import { useTotalUnreadCount } from "@/hooks/useTotalUnreadCount";

interface LeftBarOrderProps {
  page?: string; // Строковый пропс для указания страницы, если нужно
}

const BottomMenuMobile: React.FC<LeftBarOrderProps> = ({ page }) => {
  const route = useRouter();
  const dispatch = useAppDispatch();
  // Получаем стейт храниения компонента для отображения
  const component = useAppSelector((state) => state.orders.componentMenu);
  const pathname = usePathname();
  // Определяем активный пункт меню на основе pathname
  const isActive = (path: string) => pathname.startsWith(path);
  // Вытаскиваем значение сколла их redux, чтобы это значение передать в top для стиля leftbar
  const scrollYForLeftBar = useAppSelector((state) => state.modal.scrollY);
  const [isSafari, setIsSafari] = useState(false);
  const chat = useAppSelector((state) => state.chat.chat);
  const unreadCount = useTotalUnreadCount();

  // Определяем, используется ли Safari
  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes("safari") && !ua.includes("chrome")) {
      setIsSafari(true);
    }
  }, []);

  return (
    ((isActive("/tutor/responses") && !chat) ||
      !isActive("/tutor/responses")) && (
      <div className={styles.containerMenu}>
        <div
          className={styles.wrapMenuM}
          style={isSafari ? undefined : { top: 0 }}
        >
          <div className={styles.containerUlM}>
            <ul className={styles.ulM}>
              <li
                className={clsx(styles.liM, {
                  [styles.activeLi]: isActive("/tutor/orders"),
                })}
                onClick={() => route.push("/tutor/orders")}
              >
                <Text
                  size={24}
                  color={isActive("/tutor/orders") ? "#343330" : "#777777"}
                  strokeWidth={isActive("/tutor/orders") ? 1.5 : 1.25}
                />
                <span
                  className={clsx(styles.left_menu__list_text, {
                    [styles.boldTM]: isActive("/tutor/orders"),
                  })}
                >
                  Заказы
                </span>
              </li>

              <li
                className={clsx(styles.liM, {
                  [styles.activeLi]: isActive("/tutor/responses"),
                })}
                onClick={() => route.push("/tutor/responses")}
              >
                <Send
                  size={24}
                  color={isActive("/tutor/responses") ? "#343330" : "#777777"}
                  strokeWidth={isActive("/tutor/responses") ? 1.5 : 1.25}
                />
                {unreadCount > 0 && (
                  <span className={styles.unreadCountM}>{unreadCount}</span>
                )}
                <span
                  className={clsx(styles.left_menu__list_text, {
                    [styles.boldTM]: isActive("/tutor/responses"),
                  })}
                >
                  Отклики
                </span>
              </li>

              <li
                className={clsx(styles.liM, {
                  [styles.activeLi]: isActive("/tutor/wallet"),
                })}
                onClick={() => route.push("/tutor/wallet")}
              >
                <Wallet
                  size={24}
                  color={isActive("/tutor/wallet") ? "#343330" : "#777777"}
                  strokeWidth={isActive("/tutor/wallet") ? 1.5 : 1.25}
                />
                <span
                  className={clsx(styles.left_menu__list_text, {
                    [styles.boldTM]: isActive("/tutor/wallet"),
                  })}
                >
                  Баланс
                </span>
              </li>

              <li
                className={clsx(styles.liM, {
                  [styles.activeLi]: isActive("/tutor/wiki"),
                })}
                onClick={() => route.push("/tutor/wiki")}
              >
                <MessageCircleQuestionMark
                  size={24}
                  color={isActive("/tutor/wiki") ? "#343330" : "#777777"}
                  strokeWidth={isActive("/tutor/wiki") ? 1.5 : 1.25}
                />
                <span
                  className={clsx(styles.left_menu__list_text, {
                    [styles.boldTM]: isActive("/tutor/wiki"),
                  })}
                >
                  Помощь
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  );
};

export default BottomMenuMobile;
