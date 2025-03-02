import React, { useEffect, useState } from "react";
import styles from "../../../app/tutor/layout.module.css";
import componentStyle from "./InviteSidebar.module.css";
import { useAppDispatch, useAppSelector } from "@/store/store";

export const InviteSidebar = () => {
  const dispatch = useAppDispatch();
  // Вытаскиваем значение сколла их redux, чтобы это значение передать в top для стиля sidebarResponse
  const scrollYForSidebarResponse = useAppSelector(
    (state) => state.modal.scrollY
  );
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
      <div
        className={componentStyle.sidebarResponse}
        style={isSafari ? undefined : { top: `${scrollYForSidebarResponse}px` }}
      >
        <div className={componentStyle.sidebar_filterBlack}>
          <div>
            <h3 className={componentStyle.sidebar__block}>
              Приводите друзей и&nbsp;зарабатывайте
            </h3>
            <p>
              Пожизненно будем начислять вам 30% от стоимости откликов, которые
              совершили ваши друзья <br></br>
              <br></br>
              Делитесь с ними вашей реферальной ссылкой и начните дополнительно
              зарабатывать.
            </p>
            <button className={componentStyle.buttonBlc} type="button">
              Участвовать
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
