import styles from "../../page.module.css";
import clsx from "clsx";
import { Header } from "@/components/Header/Header";
import { RegionalLink } from "@/components/RegionalLink/RegionalLink";
import { getCitySlug, validSlug } from "@/utils/region/validSlug";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer/Footer";
import { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Политика конфиденциальности — Tutorio",
    description: "Политика конфиденциальности сервиса Tutorio",
    keywords: [
      "Политика конфиденциальности",
      "Tutorio",
      "правила сервиса",
      "условия использования",
      "договор оферта",
      "репетиторский сервис",
      "онлайн обучение",
      "поиск репетиторов",
      "поиск учеников",
      "платформа для репетиторов",
      "услуги онлайн-обучения",
      "обязанности пользователя",
      "ответственность сторон",
      "согласие с условиями",
      "регистрация на платформе",
      "использование сайта",
      "дистанционное обучение",
      "взаимодействие с учениками",
      "взаимодействие с репетиторами",
    ],
  };
}

export default function PrivacyPolicy({ params }: any) {
  // const city = params.city;

  // if (!validSlug.includes(city)) {
  //   return notFound(); // 404 если невалидный slug
  // }

  const city = getCitySlug(params.city);

  if (!city) {
    return notFound();
  }

  return (
    <>
      <Header city={city} />
      <main>
        <section className={clsx(styles.center, styles.containerPublicPage)}>
          <div className={styles.content}>
            <div className={styles.content_block}>
              <span className={styles.breadcrumbs}>
                <RegionalLink href="/" citySlug={city}>
                  Главная
                </RegionalLink>
                <span>→</span>
                <span>Политика конфиденциальности</span>
              </span>
            </div>
            <div className={styles.content_block}>
              <h1 className={styles.titleH1Page}>
                Политика конфиденциальности
              </h1>
              <div className={styles.versionDocument}>
                Редакция от 15 ноября 2025
              </div>

              <div className={styles.text}>
                <p>
                  Настоящая Политика конфиденциальности (далее — «Политика»)
                  определяет порядок обработки и защиты персональных данных
                  пользователей онлайн-платформы Tutorio (далее — «Платформа»),
                  расположенной по адресу{" "}
                  <Link href="https://tutorio.ru">https://tutorio.ru</Link>,
                  включая её поддомены и мобильные интерфейсы.
                </p>

                <p>Оператором персональных данных является:</p>

                <p>
                  ИП Федотов Павел Сергеевич
                  <br />
                  ИНН: 772161785163
                  <br />
                  ОГРН: 324508100346247
                  <br />
                  Адрес регистрации: 140093, Московская область, г. Дзержинский,
                  ул. Угрешская, дом 26А, кв. 65
                  <br />
                  E-mail для запросов субъектов данных: info@tutorio.ru
                </p>

                <p>
                  Используя Платформу, Пользователь подтверждает, что
                  ознакомился с Политикой и согласен на обработку персональных
                  данных на изложенных условиях.
                </p>

                {/* ---------------- 1 ---------------- */}

                <h2 id="Какие_данные_мы_собираем" className={styles.subtitle}>
                  1. Какие данные мы собираем
                </h2>

                <p>
                  Мы собираем данные, необходимые для работы Платформы,
                  исполнения договора и обеспечения безопасности:
                </p>

                <p>1.1. Данные, которые предоставляет пользователь</p>

                <p>Для учеников:</p>
                <ul className={styles.styledList}>
                  <li>Номер телефона</li>
                  <li>Город проживания</li>
                  <li>
                    Информация о заказах (предмет, цель, место занятий, бюджет и
                    др.)
                  </li>
                  <li>Сообщения в чате</li>
                </ul>

                <p>Для репетиторов:</p>
                <ul className={styles.styledList}>
                  <li>Номер телефона</li>
                  <li>ФИО</li>
                  <li>Фотография профиля</li>
                  <li>Предметы преподавания</li>
                  <li>Локации</li>
                  <li>Адрес для проведения занятий (если указан)</li>
                  <li>Опыт, образование, достижения</li>
                  <li>Документы об образовании (если загружены)</li>
                  <li>Сообщения в чате</li>
                </ul>

                <p>1.2. Данные, собираемые автоматически</p>
                <ul className={styles.styledList}>
                  <li>IP-адрес</li>
                  <li>Cookie-файлы</li>
                  <li>Данные об устройстве и браузере</li>
                  <li>
                    История действий на сайте: переходы, запросы, взаимодействие
                    с заказами
                  </li>
                  <li>Логи ошибок и технические данные работоспособности</li>
                </ul>

                <p>1.3. Данные от сторонних сервисов</p>
                <ul className={styles.styledList}>
                  <li>SMS.ru — проверка номера телефона</li>
                  <li>Mailopost — отправка уведомлений по email</li>
                  <li>
                    CloudPayments — данные об оплате (мы НЕ храним банковские
                    данные, только статус операции)
                  </li>
                  <li>Dadata — проверка корректности адресов и городов</li>
                  <li>
                    Yandex Cloud — хранение данных, логов и файлов пользователей
                  </li>
                </ul>

                {/* ---------------- 2 ---------------- */}

                <h2
                  id="Цели_обработки_персональных_данных"
                  className={styles.subtitle}
                >
                  2. Цели обработки персональных данных
                </h2>

                <p>Мы обрабатываем данные для:</p>

                <ul className={styles.styledList}>
                  <li>регистрации и авторизации пользователей</li>
                  <li>создания и размещения заказов</li>
                  <li>подбора репетиторов под параметры заказов</li>
                  <li>отправки откликов</li>
                  <li>организации чатов между учениками и репетиторами</li>
                  <li>оплаты откликов репетиторами</li>
                  <li>технической поддержки и обеспечения безопасности</li>
                  <li>улучшения качества работы Платформы</li>
                  <li>исполнения требований законодательства РФ</li>
                </ul>

                {/* ---------------- 3 ---------------- */}

                <h2 id="Правовое_основание" className={styles.subtitle}>
                  3. Правовое основание обработки
                </h2>

                <p>Мы обрабатываем данные на основании:</p>

                <ul className={styles.styledList}>
                  <li>согласия субъекта данных (ст. 9 152-ФЗ)</li>
                  <li>
                    исполнения договора (Пользовательское соглашение и Оферта)
                  </li>
                  <li>законных интересов Оператора (улучшение сервиса)</li>
                  <li>требований законодательства РФ</li>
                </ul>

                {/* ---------------- 4 ---------------- */}

                <h2 id="Передача_третьим_лицам" className={styles.subtitle}>
                  4. Передача третьим лицам
                </h2>

                <p>
                  Мы передаём данные только сервисам, необходимым для работы
                  Платформы:
                </p>

                <ul className={styles.styledList}>
                  <li>SMS.ru — отправка SMS-кодов подтверждения</li>
                  <li>Mailopost — e-mail уведомления</li>
                  <li>CloudPayments — обработка платежей</li>
                  <li>Yandex Cloud — хостинг данных и файлов</li>
                  <li>DaData — проверка корректности адресов</li>
                </ul>

                <p>
                  Передача осуществляется строго в соответствии с договорами и
                  ст. 6 ФЗ «О персональных данных». Мы не продаём и не
                  распространяем данные третьим лицам.
                </p>

                {/* ---------------- 5 ---------------- */}

                <h2 id="Хранение_данных" className={styles.subtitle}>
                  5. Хранение данных
                </h2>

                <p>Все данные хранятся на серверах в Yandex Cloud (Россия).</p>

                <p>Сроки хранения:</p>
                <ul className={styles.styledList}>
                  <li>
                    данные аккаунта — пока пользователь пользуется Платформой
                  </li>
                  <li>данные заказов — 3 года</li>
                  <li>чаты — 1 год</li>
                  <li>финансовые данные — 5 лет (по закону)</li>
                </ul>

                {/* ---------------- 6 ---------------- */}

                <h2 id="Удаление_данных" className={styles.subtitle}>
                  6. Удаление персональных данных
                </h2>

                <p>Пользователь может:</p>

                <ul className={styles.styledList}>
                  <li>удалить аккаунт самостоятельно в Личном кабинете</li>
                  <li>направить запрос на удаление на info@tutorio.ru</li>
                </ul>

                <p>
                  Удаление осуществляется в течение 30 календарных дней.
                  Финансовая информация может храниться дольше, если это
                  требуется законодательством.
                </p>

                {/* ---------------- 7 ---------------- */}

                <h2 id="Права_пользователя" className={styles.subtitle}>
                  7. Права пользователя
                </h2>

                <p>Пользователь имеет право:</p>

                <ul className={styles.styledList}>
                  <li>получать информацию о своих данных</li>
                  <li>требовать исправления данных</li>
                  <li>требовать удаления данных</li>
                  <li>ограничивать обработку</li>
                  <li>отзывать согласие</li>
                  <li>обжаловать действия Оператора</li>
                </ul>

                <p>Все запросы принимаются по адресу: info@tutorio.ru</p>

                {/* ---------------- 8 ---------------- */}

                <h2 id="Защита_данных" className={styles.subtitle}>
                  8. Защита данных
                </h2>

                <p>
                  Мы применяем современные технические и организационные меры
                  защиты:
                </p>

                <ul className={styles.styledList}>
                  <li>шифрование каналов передачи данных</li>
                  <li>двухфакторная защита сервисов</li>
                  <li>резервное копирование данных</li>
                  <li>ограничение доступа по ролям</li>
                  <li>регулярные проверки безопасности</li>
                </ul>

                {/* ---------------- 9 ---------------- */}

                <h2 id="Изменения" className={styles.subtitle}>
                  9. Изменения Политики
                </h2>

                <p>
                  Политика может быть обновлена. Новая версия вступает в силу с
                  момента публикации на сайте. Продолжая пользоваться
                  Платформой, пользователь подтверждает согласие с обновлённой
                  Политикой.
                </p>

                {/* ---------------- 10 ---------------- */}

                <h2 id="Контакты" className={styles.subtitle}>
                  10. Контакты
                </h2>

                <p>
                  Оператор персональных данных: ИП Федотов Павел Сергеевич
                  <br />
                  Адрес: 140093, Московская область, г. Дзержинский, ул.
                  Угрешская, дом 26А, кв. 65
                  <br />
                  E-mail: info@tutorio.ru
                </p>
              </div>
            </div>
          </div>

          <div className={styles.sidebarAppPage}>
            <div className={styles.content_block}>
              <div className={styles.toc}>
                <h2 className={styles.subtitle}>Содержание документа</h2>
                <ol className={styles.ol} type="1">
                  <li className={styles.olLi}>
                    <Link
                      className={styles.olLiLink}
                      href={`#Какие_данные_мы_собираем`}
                    >
                      1. Какие данные мы собираем
                    </Link>
                  </li>
                  <li className={styles.olLi}>
                    <Link
                      className={styles.olLiLink}
                      href={`#Цели_обработки_персональных_данных`}
                    >
                      2. Цели обработки персональных данных
                    </Link>
                  </li>
                  <li className={styles.olLi}>
                    <Link
                      className={styles.olLiLink}
                      href={`#Правовое_основание`}
                    >
                      3. Правовое основание обработки
                    </Link>
                  </li>
                  <li className={styles.olLi}>
                    <Link
                      className={styles.olLiLink}
                      href={`#Передача_третьим_лицам`}
                    >
                      4. Передача третьим лицам
                    </Link>
                  </li>
                  <li className={styles.olLi}>
                    <Link className={styles.olLiLink} href={`#Хранение_данных`}>
                      5. Хранение данных
                    </Link>
                  </li>
                  <li className={styles.olLi}>
                    <Link className={styles.olLiLink} href={`#Удаление_данных`}>
                      6. Удаление персональных данных
                    </Link>
                  </li>
                  <li className={styles.olLi}>
                    <Link
                      className={styles.olLiLink}
                      href={`#Права_пользователя`}
                    >
                      7. Права пользователя
                    </Link>
                  </li>

                  <li className={styles.olLi}>
                    <Link className={styles.olLiLink} href={`#Защита_данных`}>
                      8. Защита данных
                    </Link>
                  </li>

                  <li className={styles.olLi}>
                    <Link className={styles.olLiLink} href={`#Изменения`}>
                      9. Изменения Политики
                    </Link>
                  </li>

                  <li className={styles.olLi}>
                    <Link className={styles.olLiLink} href={`#Контакты`}>
                      10. Контакты
                    </Link>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer city={city} />
    </>
  );
}
