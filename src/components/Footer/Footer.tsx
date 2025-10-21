import styles from "../../app/page.module.css";
import clsx from "clsx";
import { RegionalLink } from "../RegionalLink/RegionalLink";
import { validSlug } from "@/utils/region/validSlug";
import { notFound } from "next/navigation";

interface FooterProps {
  city?: string; // передаём из SSR или страницы
}

export const Footer = ({ city }: FooterProps) => {
  if (!city || !validSlug.includes(city)) {
    return notFound(); // 404 если невалидный slug
  }

  return (
    <footer className={clsx(styles.footer, styles.center)}>
      <div className={styles.footer__left}>
        <div className={styles.footer__rightM}>
          <RegionalLink href="/" citySlug={city}>
            <div className={styles.footer__right__logo}>
              tutorio
              <span className={styles.footer__right__underLogo}>
                Онлайн-сервис подбора репетиторов
              </span>
            </div>
          </RegionalLink>
        </div>
        <div className={styles.footer__menu}>
          <a href="">Найти репетитора</a>
          <a href="">Заказы учеников</a>
          <a href="">Каталог репетиторов</a>
          <br />
          <a href="">Блог</a>
          <a href="">Стать репетитором</a>
          <a href="">Личный кабинет</a>
          <br />
          <RegionalLink href="/" citySlug={city}>
            Пользовательское соглашение
          </RegionalLink>
          <a href="">Обработка информации</a>
          <a href="">Защита персональных данных</a>
        </div>

        <div className={styles.footer__right__socialM}>
          <p>Мы в социальных сетях</p>
          <svg
            data-qa="Telegram"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M2.622 8.8s-.672.234-.619.664c.053.43.602.627.602.627l3.574 1.219 8.583-5.52s.495-.305.477 0c0 0 .089.054-.177.305-.265.25-6.742 6.147-6.742 6.147l-.013.11 5.835 4.531c.974.43 1.328-.466 1.328-.466L18 3.497c0-.861-1.168-.341-1.168-.341L2.622 8.8Z"
              fill="currentColor"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M11.514 13.826 8.232 16.22s-.18.14-.378.052l.378-4.021 3.282 1.575Z"
              fill="currentColor"
            />
          </svg>
          <svg
            data-qa="VK"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.804 15.646c-6.15 0-9.658-4.216-9.804-11.232h3.08c.102 5.15 2.373 7.33 4.172 7.78v-7.78h2.9v4.441c1.777-.19 3.643-2.215 4.272-4.44h2.901c-.483 2.743-2.507 4.766-3.946 5.598 1.439.675 3.744 2.44 4.62 5.633h-3.192c-.686-2.136-2.395-3.789-4.655-4.014v4.014h-.348Z"
              fill="currentColor"
            />
          </svg>
          <svg
            data-qa="Odnoklassniki"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10 4.345c.913 0 1.656.742 1.656 1.656 0 .912-.743 1.655-1.656 1.655a1.658 1.658 0 0 1-1.656-1.655c0-.914.743-1.656 1.656-1.656ZM10 10c2.206 0 4-1.794 4-4s-1.794-4-4-4-4 1.794-4 4 1.794 4 4 4ZM11.622 13.626a7.387 7.387 0 0 0 2.329-.993 1.231 1.231 0 0 0 .368-1.668 1.154 1.154 0 0 0-1.62-.38 4.968 4.968 0 0 1-5.398 0 1.154 1.154 0 0 0-1.62.38 1.231 1.231 0 0 0 .368 1.668 7.4 7.4 0 0 0 2.328.993l-2.241 2.309a1.235 1.235 0 0 0 0 1.71 1.154 1.154 0 0 0 1.661 0L10 15.378l2.204 2.269a1.15 1.15 0 0 0 1.66 0c.46-.473.46-1.24 0-1.711l-2.242-2.309Z"
              fill="currentColor"
            />
          </svg>
          <svg
            data-qa="Dzen"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="currentColor"
              d="M9.4 6.8c.4-1.1.4-2.6.5-4.8-3.3 0-5.6 0-6.7 1.2C2 4.3 2 6.7 2 9.9c3.5-.1 5.2-.2 6.5-1.5.4-.4.7-1 .9-1.6zM18 9.9c0-3.2 0-5.6-1.2-6.8C15.7 2 13.4 2 10.1 2c.1 3.5.2 5.2 1.5 6.5 1.2 1.2 2.9 1.3 6.4 1.4zm-9.5 1.6C7.2 10.2 5.6 10.1 2 10c0 3.2 0 5.6 1.2 6.8C4.3 18 6.6 18 9.9 18c-.1-3.5-.2-5.2-1.4-6.5zm9.5-1.4c-3.5.1-5.2.2-6.5 1.5-.6.6-1 1.4-1.2 2.4-.1.5-.1 1-.2 1.6v.2c0 .7-.1 1.4-.1 2.3 3.3 0 5.6 0 6.8-1.2 1.2-1.2 1.2-3.6 1.2-6.8z"
            />
          </svg>
        </div>

        <div className={styles.footer__copiright}>
          © 2011–2024, ООО «Туторио». При использовании материалов гиперссылка
          на tutorio.ru обязательна. ИНН 7710718303, ОГРН 1087746642774. 109544,
          г. Москва, бульвар Энтузиастов, дом 2, 26 этаж.
        </div>
        <div className={styles.footer__description}>
          ООО «Туторио» осуществляет деятельность в сфере IT: сервис
          предоставляет онлайн - услуги по подбору финансовых продуктов, а также
          распространению рекламы организаций - партнеров в сети Интернет
        </div>
        <div className={styles.footer__cookie}>
          Мы используем файлы cookie для того, чтобы предоставить пользователям
          больше возможностей при посещении сайта tutorio.ru. Подробнее об
          условиях использования.
        </div>
      </div>
      <div className={styles.footer__right}>
        <a href="#">
          <div className={styles.footer__right__logo}>
            tutorio
            <span className={styles.footer__right__underLogo}>
              Онлайн-сервис подбора репетиторов
            </span>
          </div>
        </a>
        <div className={styles.footer__right__social}>
          <p>Мы в социальных сетях</p>
          <svg
            data-qa="Telegram"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M2.622 8.8s-.672.234-.619.664c.053.43.602.627.602.627l3.574 1.219 8.583-5.52s.495-.305.477 0c0 0 .089.054-.177.305-.265.25-6.742 6.147-6.742 6.147l-.013.11 5.835 4.531c.974.43 1.328-.466 1.328-.466L18 3.497c0-.861-1.168-.341-1.168-.341L2.622 8.8Z"
              fill="currentColor"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M11.514 13.826 8.232 16.22s-.18.14-.378.052l.378-4.021 3.282 1.575Z"
              fill="currentColor"
            />
          </svg>
          <svg
            data-qa="VK"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.804 15.646c-6.15 0-9.658-4.216-9.804-11.232h3.08c.102 5.15 2.373 7.33 4.172 7.78v-7.78h2.9v4.441c1.777-.19 3.643-2.215 4.272-4.44h2.901c-.483 2.743-2.507 4.766-3.946 5.598 1.439.675 3.744 2.44 4.62 5.633h-3.192c-.686-2.136-2.395-3.789-4.655-4.014v4.014h-.348Z"
              fill="currentColor"
            />
          </svg>
          <svg
            data-qa="Odnoklassniki"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10 4.345c.913 0 1.656.742 1.656 1.656 0 .912-.743 1.655-1.656 1.655a1.658 1.658 0 0 1-1.656-1.655c0-.914.743-1.656 1.656-1.656ZM10 10c2.206 0 4-1.794 4-4s-1.794-4-4-4-4 1.794-4 4 1.794 4 4 4ZM11.622 13.626a7.387 7.387 0 0 0 2.329-.993 1.231 1.231 0 0 0 .368-1.668 1.154 1.154 0 0 0-1.62-.38 4.968 4.968 0 0 1-5.398 0 1.154 1.154 0 0 0-1.62.38 1.231 1.231 0 0 0 .368 1.668 7.4 7.4 0 0 0 2.328.993l-2.241 2.309a1.235 1.235 0 0 0 0 1.71 1.154 1.154 0 0 0 1.661 0L10 15.378l2.204 2.269a1.15 1.15 0 0 0 1.66 0c.46-.473.46-1.24 0-1.711l-2.242-2.309Z"
              fill="currentColor"
            />
          </svg>
          <svg
            data-qa="Dzen"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="currentColor"
              d="M9.4 6.8c.4-1.1.4-2.6.5-4.8-3.3 0-5.6 0-6.7 1.2C2 4.3 2 6.7 2 9.9c3.5-.1 5.2-.2 6.5-1.5.4-.4.7-1 .9-1.6zM18 9.9c0-3.2 0-5.6-1.2-6.8C15.7 2 13.4 2 10.1 2c.1 3.5.2 5.2 1.5 6.5 1.2 1.2 2.9 1.3 6.4 1.4zm-9.5 1.6C7.2 10.2 5.6 10.1 2 10c0 3.2 0 5.6 1.2 6.8C4.3 18 6.6 18 9.9 18c-.1-3.5-.2-5.2-1.4-6.5zm9.5-1.4c-3.5.1-5.2.2-6.5 1.5-.6.6-1 1.4-1.2 2.4-.1.5-.1 1-.2 1.6v.2c0 .7-.1 1.4-.1 2.3 3.3 0 5.6 0 6.8-1.2 1.2-1.2 1.2-3.6 1.2-6.8z"
            />
          </svg>
        </div>
      </div>
    </footer>
  );
};
