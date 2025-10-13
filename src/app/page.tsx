import Image from "next/image";
import styles from "./page.module.css";
import clsx from "clsx";
import { SelectSubject } from "@/components/SelectSubject/SelectSubject";
import { Header } from "@/components/Header/Header";

export const metadata = {
  title: "Tutorio — подбор репетиторов и поиск учеников онлайн",
  description:
    "Tutorio — онлайн-сервис для поиска репетиторов и учеников. Индивидуальные занятия по математике, русскому, английскому и другим предметам. Подготовка к ЕГЭ, ОГЭ и помощь с домашними заданиями.",
  keywords: [
    "поиск репетитора",
    "подбор репетитора",
    "найти репетитора онлайн",
    "репетитор по математике",
    "репетитор по русскому языку",
    "репетитор по английскому",
    "подготовка к ЕГЭ",
    "подготовка к ОГЭ",
    "подготовка к ВПР",
    "подготовка к школе",
    "репетитор для школьника",
    "онлайн репетитор",
    "домашнее задание",
    "помощь с дз",
    "объяснение темы",
    "занятия онлайн",
    "занятия с репетитором",
    "индивидуальные уроки",
    "обучение школьников",
    "репетиторская платформа",
    "найти ученика",
    "Tutorio",
    "образовательный сервис",
    "репетиторская помощь",
    "дистанционное обучение",
    "подготовка к экзаменам",
    "обучение онлайн",
    "уроки по Zoom",
    "репетитор начальных классов",
    "репетитор по литературе",
    "репетитор по химии",
    "репетитор по физике",
    "репетитор по биологии",
    "репетитор по истории",
    "репетитор по обществознанию",
    "индивидуальные занятия",
    "репетитор недорого",
    "лучшие репетиторы",
    "поиск учеников",
  ],
};

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <section className={clsx(styles.firstSection, styles.center)}>
          <div className={styles.mContainer}>
            <h1>Быстрый поиск репетиторов</h1>
            <h2>
              {/* Выбирайте проверенных репетиторов и{"\u00A0"}общайтесь с{"\u00A0"}
              ними напрямую */}
              Подберём репетиторов, сможете общаться с{"\u00A0"}ними напрямую
            </h2>
          </div>
          <SelectSubject />

          <div className={styles.firstSection__snippetSearch}>
            <div
              className={clsx(
                styles.firstSection__snippet,
                styles.snippetMedium
              )}
            >
              Подготовка к ЕГЭ 📝
              <p className={styles.firstSection__snippetL}>
                Подготовка к единому государственному экзамену по основным
                предметам{" "}
              </p>
              {/* <Image
                src="img/icon/15SVuaWGVoLUQKfaewU9N.svg"
                alt="Подготовка к ЕГЭ"
                width={98}
                height={98}
                className={styles.firstSection__snippetImage}
              /> */}
            </div>
            <div
              className={clsx(
                styles.firstSection__snippet,
                styles.snippetSmall
              )}
            >
              <div className={styles.fs_SnippetItemEmj}>Начальная школа 📚</div>
              <p className={styles.firstSection__snippetM}>
                Успешный старт в{"\u00A0"}учебе
              </p>
              {/* <Image
                src="img/icon/5qBfrtWBerdJfAGoeMhRG.svg"
                alt="Подготовка к ЕГЭ"
                width={98}
                height={98}
                className={styles.firstSection__snippetImage}
              /> */}
            </div>
            <div
              className={clsx(
                styles.firstSection__snippet,
                styles.snippetSmall
              )}
            >
              <div className={styles.fs_SnippetItemEmj}>
                Английский язык
                <Image
                  src="/img/icon/Greatbritainflag.svg"
                  alt="Английский язык"
                  width={17}
                  height={17}
                  className={styles.fs_SnippetItemImg}
                />
              </div>
              <p className={styles.firstSection__snippetM}>
                Уверенный английский для{"\u00A0"}учебы и{"\u00A0"}жизни
              </p>
              {/* <Image
                src="img/icon/fkCvxuEhaO12Mt68ulWN8.svg"
                alt="Подготовка к ЕГЭ"
                width={98}
                height={98}
                className={styles.firstSection__snippetImage}
              /> */}
            </div>
            <div
              className={clsx(
                styles.firstSection__snippet,
                styles.snippetSmall
              )}
            >
              <div className={styles.fs_SnippetItemEmj}>Математика ➗</div>
              <p className={styles.firstSection__snippetM}>
                Устраним пробелы, научим решать задачи уверенно
              </p>
              {/* <Image
                src="img/icon/fkCvxuEhaO12Mt68ulWN8.svg"
                alt="Подготовка к ЕГЭ"
                width={98}
                height={98}
                className={styles.firstSection__snippetImage}
              /> */}
            </div>
            <div
              className={clsx(
                styles.firstSection__snippet,
                styles.snippetSmall
              )}
            >
              <div className={styles.fs_SnippetItemEmj}>
                Русский язык
                <Image
                  src="/img/icon/Russianflag.svg"
                  alt="Русский язык"
                  width={17}
                  height={17}
                  className={styles.fs_SnippetItemImg}
                />
              </div>

              <p className={styles.firstSection__snippetM}>
                Грамотность без страха. Пишем и{"\u00A0"}говорим правильно!
              </p>
            </div>
            <div
              className={clsx(
                styles.firstSection__snippet,
                styles.snippetSmall
              )}
            >
              <div className={styles.fs_SnippetItemEmj}>
                Подготовка к школе 🎒
              </div>
              <p className={styles.firstSection__snippetM}>
                Будущий первоклассник: учимся с{"\u00A0"}удовольствием!
              </p>
              {/* <Image
                src="/img/icon/PvEmA6wAmMTYaCPr9g0XH.png"
                alt="Подготовка к ЕГЭ"
                width={98}
                height={98}
                className={styles.firstSection__snippetImage}
              /> */}
            </div>
            <div
              className={clsx(
                styles.firstSection__snippet,
                styles.snippetSmall
              )}
            >
              <div className={styles.fs_SnippetItemEmj}>Физика ⚡</div>
              <p className={styles.firstSection__snippetM}>
                Сложная физика станет понятной
              </p>
              {/* <Image
                src="/img/icon/6p_qT465khupqdKiWpIWG.png"
                alt="Подготовка к ЕГЭ"
                width={98}
                height={98}
                className={styles.firstSection__snippetImage}
              /> */}
            </div>
          </div>
        </section>
        {/* <section className={clsx(styles.howWork, styles.center)}>
          <div className={styles.howWork__title}>Как это работает</div>
          <div className={styles.howWork__step}>
            <div className={styles.stepNumber}>01</div>
            <div className={styles.stepDescription}>
              <h3>Создайте заказ</h3>
              <p className={styles.howWork__text}>
                Мы зададим необходимые вопросы, чтобы вам было{" "}
                <span>проще описать задачу</span>, а репетитору — понять{" "}
                <span>цель занятий</span>
              </p>
            </div>
            <div>
              <Image
                src="/img/icon/im-service-step1@2x.webp"
                alt="Создание заказа"
                width={300}
                height={215}
              />
            </div>
          </div>
          <div className={styles.howWork__step}>
            <div className={styles.stepNumber}>02</div>
            <div className={styles.stepDescription}>
              <h3>Получите отклики репетиторов</h3>
              <p className={styles.howWork__text}>
                Покажем заказ подходящим репетиторам. <span>Они напишут</span>,
                если готовы помочь, а вы <span>сможете уточнить</span> у них все
                детали <span>напрямую в чате</span>
              </p>
            </div>
            <div>
              <Image
                src="/img/icon/im-service-step2@2x.webp"
                alt="Получите отклики"
                width={300}
                height={215}
              />
            </div>
          </div>
          <div className={styles.howWork__step}>
            <div className={styles.stepNumber}>03</div>
            <div className={styles.stepDescription}>
              <h3>Договоритесь о занятиях</h3>
              <p className={styles.howWork__text}>
                <span>Выберите репетиторов</span>, которые подходят под ваши
                критерии, обменяйтесь контактами и{" "}
                <span>приступите к занятиям</span>
              </p>
            </div>
            <div>
              <Image
                src="/img/icon/im-service-step3@2x.webp"
                alt="Договоритесь о занятиях"
                width={300}
                height={215}
              />
            </div>
          </div>
          <div className={styles.howWork__step}>
            <div className={styles.stepNumber}>04</div>
            <div className={styles.stepDescription}>
              <h3>Мы всегда на связи</h3>
              <p className={styles.howWork__text}>
                На любом этапе занятий вы <span>можете задать нам вопрос</span>,
                поделиться впечатлениями о результатах или{" "}
                <span>оставить отзыв</span> о сервисе
              </p>
            </div>
            <div>
              <Image
                src="/img/icon/im-service-step5@2x.webp"
                alt="Мы всегда на связи"
                width={300}
                height={215}
              />
            </div>
          </div>
        </section> */}
        <section className={clsx(styles.tutorsIn, styles.center)}>
          <div className={styles.howWork__title}>Репетиторы в Москве</div>
          <div className={styles.tutorsIn__subjects}>
            <div className={styles.tutorsIn__subject}>
              <h4>Английский язык</h4>
              <ul>
                <li>
                  <a href="#">Английский для малышей</a>
                </li>
                <li>
                  <a href="#">Академический английский</a>
                </li>
                <li>
                  <a href="#">Американский английский язык</a>
                </li>
                <li>
                  <a href="#">Английский для путешествий</a>
                </li>
                <li>
                  <a href="#">Экзамены по английскому</a>
                </li>
              </ul>
            </div>
            <div className={styles.tutorsIn__subject}>
              <h4>Математика</h4>
              <ul>
                <li>
                  <a href="#">Английский для малышей</a>
                </li>
                <li>
                  <a href="#">Академический английский</a>
                </li>
                <li>
                  <a href="#">Американский английский язык</a>
                </li>
                <li>
                  <a href="#">Английский для путешествий</a>
                </li>
                <li>
                  <a href="#">Экзамены по английскому</a>
                </li>
              </ul>
            </div>
            <div className={styles.tutorsIn__subject}>
              <h4>Русский язык</h4>
              <ul>
                <li>
                  <a href="#">Английский для малышей</a>
                </li>
                <li>
                  <a href="#">Академический английский</a>
                </li>
                <li>
                  <a href="#">Американский английский язык</a>
                </li>
                <li>
                  <a href="#">Английский для путешествий</a>
                </li>
                <li>
                  <a href="#">Экзамены по английскому</a>
                </li>
              </ul>
            </div>
            <div className={styles.tutorsIn__subject}>
              <h4>Начальная школа</h4>
              <ul>
                <li>
                  <a href="#">Английский для малышей</a>
                </li>
                <li>
                  <a href="#">Академический английский</a>
                </li>
                <li>
                  <a href="#">Американский английский язык</a>
                </li>
                <li>
                  <a href="#">Английский для путешествий</a>
                </li>
                <li>
                  <a href="#">Экзамены по английскому</a>
                </li>
              </ul>
            </div>
            <div className={styles.tutorsIn__subject}>
              <h4>Подготовка к школе</h4>
              <ul>
                <li>
                  <a href="#">Английский для малышей</a>
                </li>
                <li>
                  <a href="#">Академический английский</a>
                </li>
                <li>
                  <a href="#">Американский английский язык</a>
                </li>
                <li>
                  <a href="#">Английский для путешествий</a>
                </li>
                <li>
                  <a href="#">Экзамены по английскому</a>
                </li>
              </ul>
            </div>
            <div className={styles.tutorsIn__subject}>
              <h4>Подготовка к ЕГЭ</h4>
              <ul>
                <li>
                  <a href="#">Английский для малышей</a>
                </li>
                <li>
                  <a href="#">Академический английский</a>
                </li>
                <li>
                  <a href="#">Американский английский язык</a>
                </li>
                <li>
                  <a href="#">Английский для путешествий</a>
                </li>
                <li>
                  <a href="#">Экзамены по английскому</a>
                </li>
              </ul>
            </div>
            <div className={styles.tutorsIn__subject}>
              <h4>Подготовка к ОГЭ</h4>
              <ul>
                <li>
                  <a href="#">Английский для малышей</a>
                </li>
                <li>
                  <a href="#">Академический английский</a>
                </li>
                <li>
                  <a href="#">Американский английский язык</a>
                </li>
                <li>
                  <a href="#">Английский для путешествий</a>
                </li>
                <li>
                  <a href="#">Экзамены по английскому</a>
                </li>
              </ul>
            </div>
            <div className={styles.tutorsIn__subject}>
              <h4>Китайский язык</h4>
              <ul>
                <li>
                  <a href="#">Английский для малышей</a>
                </li>
                <li>
                  <a href="#">Академический английский</a>
                </li>
                <li>
                  <a href="#">Американский английский язык</a>
                </li>
                <li>
                  <a href="#">Английский для путешествий</a>
                </li>
                <li>
                  <a href="#">Экзамены по английскому</a>
                </li>
              </ul>
            </div>
            <div className={styles.tutorsIn__subject}>
              <h4>Физика</h4>
              <ul>
                <li>
                  <a href="#">Английский для малышей</a>
                </li>
                <li>
                  <a href="#">Академический английский</a>
                </li>
                <li>
                  <a href="#">Американский английский язык</a>
                </li>
                <li>
                  <a href="#">Английский для путешествий</a>
                </li>
                <li>
                  <a href="#">Экзамены по английскому</a>
                </li>
              </ul>
            </div>
            <div className={styles.tutorsIn__subject}>
              <h4>Информатика</h4>
              <ul>
                <li>
                  <a href="#">Английский для малышей</a>
                </li>
                <li>
                  <a href="#">Академический английский</a>
                </li>
                <li>
                  <a href="#">Американский английский язык</a>
                </li>
                <li>
                  <a href="#">Английский для путешествий</a>
                </li>
                <li>
                  <a href="#">Экзамены по английскому</a>
                </li>
              </ul>
            </div>
            <div className={styles.tutorsIn__subject}>
              <h4>Биология</h4>
              <ul>
                <li>
                  <a href="#">Английский для малышей</a>
                </li>
                <li>
                  <a href="#">Академический английский</a>
                </li>
                <li>
                  <a href="#">Американский английский язык</a>
                </li>
                <li>
                  <a href="#">Английский для путешествий</a>
                </li>
                <li>
                  <a href="#">Экзамены по английскому</a>
                </li>
              </ul>
            </div>
            <div className={styles.tutorsIn__subject}>
              <h4>Химия</h4>
              <ul>
                <li>
                  <a href="#">Английский для малышей</a>
                </li>
                <li>
                  <a href="#">Академический английский</a>
                </li>
                <li>
                  <a href="#">Американский английский язык</a>
                </li>
                <li>
                  <a href="#">Английский для путешествий</a>
                </li>
                <li>
                  <a href="#">Экзамены по английскому</a>
                </li>
              </ul>
            </div>
          </div>
        </section>
        {/* <section className={clsx(styles.feedbacks, styles.center)}>
          <div className={styles.howWork__title}>Отзывы о репетиторах</div>
          <div className={styles.feedbacks__container}>
            <div className={styles.feedbacks__container__feedback1}>
              <div className={styles.feedbacks__container__fio}>
                <Image
                  src="/img/feedback/https---097ba299e7b4d84da1e30bc4457f04a0.cdn.bubble.io-f1684343262553x750894426470190800-14896_1623164697.jpeg"
                  width={70}
                  height={70}
                  alt="Сергеева Илона Михайловна"
                />
                <div className={styles.feedbacks__container__tutor}>
                  <a href="">Сергеева Илона Михайловна</a>
                  <span>английский язык</span>
                </div>
              </div>
              <p className={styles.feedbacks__container__text}>
                Илона Михайловна как преподаватель мне очень нравится! Она
                помогает мне подтянуть английский язык, имеет интересную
                программу занятий, грамотно строит урок, всегда подстраивается
                под мой график, умеет проявить понимание, гибкость. Мне
                нравится, как Илона Михайловна преподносит материал, использует
                в работе различные аудиоподборки и видеозаписи, дополнительные
                учебные пособия. И профессиональные, и личностные качества
                репетитора находятся на высоте! Успехи есть, динамика занятий
                положительная! Благодаря Илоне Михайловне я начала гораздо лучше
                понимать английский язык, стала более уверенной в общении!
              </p>
              <span className={styles.feedbacks__container__name}>
                Виктория
              </span>
            </div>
            <div className={styles.feedbacks__container__feedback2}>
              <div className={styles.feedbacks__container__fio}>
                <Image
                  src="/img/feedback/https---097ba299e7b4d84da1e30bc4457f04a0.cdn.bubble.io-f1684346017808x877098376543103400-6510_1579039804.jpg"
                  width={70}
                  height={70}
                  alt="Гуминский Максим"
                />
                <div className={styles.feedbacks__container__tutor}>
                  <a href="">Гуминский Максим</a>
                  <span>ЕГЭ по русскому</span>
                </div>
              </div>
              <p className={styles.feedbacks__container__text}>
                Спасибо большое Максиму Сергеевичу! Сдали ОГЭ на 93 балла
                благодаря его работе. Очень ответственный и грамотный
                преподаватель.
              </p>
              <span className={styles.feedbacks__container__name}>Кирилл</span>
            </div>
            <div className={styles.feedbacks__container__feedback3}>
              <div className={styles.feedbacks__container__fio}>
                <Image
                  src="/img/feedback/6219.jpg"
                  width={287}
                  height={215}
                  alt="Плотникова Нина"
                />
                <div className={styles.feedbacks__container__tutor}>
                  <a href="">Плотникова Нина</a>
                  <span>английский язык</span>
                </div>
              </div>
              <p className={styles.feedbacks__container__text}>
                Занимался с Никой Витальевной на протяжении 2-х лет. Подняли
                английский с нуля, так как в младших классах был странный и
                непонятный учитель. С помощью Ники смог разобраться во всех
                12-ти временах, перетопил боязнь говорить и подготовился к
                технике написания письма. Планирую и дальше заниматься с этим
                чудесным преподавателем по скайпу, так как хочу подготовиться к
                сдаче огэ.
              </p>
              <span className={styles.feedbacks__container__name}>Сергей</span>
            </div>
            <div className={styles.feedbacks__container__feedback3}>
              <div className={styles.feedbacks__container__fio}>
                <Image
                  src="/img/feedback/1980.jpeg"
                  width={70}
                  height={70}
                  alt="Ираида Викторовн"
                />
                <div className={styles.feedbacks__container__tutor}>
                  <a href="">Ираида Викторовна</a>
                  <span>начальная школа</span>
                </div>
              </div>
              <p className={styles.feedbacks__container__text}>
                Хорошо обучает, психологический и эмоциональный настрой хороший,
                позитивный. Мальчик не охотно любит заниматься, а к ней охотно
                идет. Она с детьми находит свой контакт, это плюс. Успеваемость
                повысилась, мы довольны, несмотря на то, что далеко. Технику она
                нам поставила, а дальше пока будем самостоятельно заниматься.
                Сказала на что обратить внимание и как правильно заниматься,
                какими источниками пользоваться, как руку ставить мальчику.
                Занимались недолго, но сдвиги есть.
              </p>
              <span className={styles.feedbacks__container__name}>Олеся</span>
            </div>
            <div className={styles.feedbacks__container__feedback4}>
              <div className={styles.feedbacks__container__fio}>
                <Image
                  src="/img/feedback/2254.jpg"
                  width={70}
                  height={70}
                  alt="Ираида Викторовн"
                />
                <div className={styles.feedbacks__container__tutor}>
                  <a href="">Петренко Мария Викторовна</a>
                  <span>английский язык</span>
                </div>
              </div>
              <p className={styles.feedbacks__container__text}>
                Мария Игореана занималась с ребенком и за 6 месяцев помогла
                &quot;догнать&quot; одноклассников, так как сильно отставал при
                переходе в новую школу. Большое спасибо.
              </p>
              <span className={styles.feedbacks__container__name}>Кирилл</span>
            </div>
            <div className={styles.feedbacks__container__feedback4}>
              <div className={styles.feedbacks__container__fio}>
                <Image
                  src="/img/feedback/2600.png"
                  width={70}
                  height={70}
                  alt="Ираида Викторовн"
                />
                <div className={styles.feedbacks__container__tutor}>
                  <a href="">Завесова Татьяна Львовна</a>
                  <span>Коррекционная педагогика</span>
                </div>
              </div>
              <p className={styles.feedbacks__container__text}>
                Для нас с сыном Татьяна Львовна открыла целый мир. Дала
                консультацию по нашим диагнозам, проверила все возможности
                ребёнка, и определила его сложности.
              </p>
              <span className={styles.feedbacks__container__name}>Наталья</span>
            </div>
            <div className={styles.feedbacks__container__feedback4}>
              <div className={styles.feedbacks__container__fio}>
                <Image
                  src="/img/feedback/https---097ba299e7b4d84da1e30bc4457f04a0.cdn.bubble.io-f1684343262553x750894426470190800-14896_1623164697.jpeg"
                  width={70}
                  height={70}
                  alt="Ираида Викторовн"
                />
                <div className={styles.feedbacks__container__tutor}>
                  <a href="">Ираида Викторовна</a>
                  <span>начальная школа</span>
                </div>
              </div>
              <p className={styles.feedbacks__container__text}>
                Мария Игореана занималась с ребенком и за 6 месяцев помогла
                &quot;догнать&quot; одноклассников, так как сильно отставал при
                переходе в новую школу. Большое спасибо.
              </p>
              <span className={styles.feedbacks__container__name}>Олеся</span>
            </div>
          </div>
        </section> */}
        {/* <section className={clsx(styles.blog, styles.center)}>
          <div className={styles.howWork__title}>
            Интересное в{" "}
            <a href="#" style={{ textDecoration: "underline" }}>
              блоге
            </a>
          </div>
          <div className={styles.blog__article}>
            <a href="#">
              <div className={styles.blog__articleContainer}>
                <Image
                  src="/img/blog/1617019367_post.jpg"
                  width={287}
                  height={215}
                  alt="Актуальные профессии будущего: что нас ждет через 10 лет?"
                />
                <p className={styles.blog__articleContainer__date}>10 января</p>
                <p className={styles.blog__articleContainer__title}>
                  Актуальные профессии будущего: что нас ждет через 10 лет?
                </p>
              </div>
            </a>
            <a href="#">
              <div className={styles.blog__articleContainer}>
                <Image
                  src="/img/blog/1617018277_post.jpg"
                  width={287}
                  height={215}
                  alt="Как выучить информацию без зубрежки: метод флеш-карточек"
                />
                <p className={styles.blog__articleContainer__date}>10 января</p>
                <p className={styles.blog__articleContainer__title}>
                  Как выучить информацию без зубрежки: метод флеш-карточек
                </p>
              </div>
            </a>
            <a href="#">
              <div className={styles.blog__articleContainer}>
                <Image
                  src="/img/blog/1616080202_post.jpg"
                  width={287}
                  height={215}
                  alt="Как умножить обыкновенные и десятичные дроби"
                />
                <p className={styles.blog__articleContainer__date}>10 января</p>
                <p className={styles.blog__articleContainer__title}>
                  Как умножить обыкновенные и десятичные дроби
                </p>
              </div>
            </a>
            <a href="#">
              <div className={styles.blog__articleContainer}>
                <Image
                  src="/img/blog/1617019085_post.jpg"
                  width={287}
                  height={215}
                  alt="Причины для перевода ребенка в другую школу"
                />
                <p className={styles.blog__articleContainer__date}>10 января</p>
                <p className={styles.blog__articleContainer__title}>
                  Причины для перевода ребенка в другую школу
                </p>
              </div>
            </a>
            <a href="#">
              <div className={styles.blog__articleContainer}>
                <Image
                  src="/img/blog/1617019272_post.jpg"
                  width={287}
                  height={215}
                  alt="ОГЭ-2019: как это будет"
                />
                <p className={styles.blog__articleContainer__date}>10 января</p>
                <p className={styles.blog__articleContainer__title}>
                  ОГЭ-2019: как это будет
                </p>
              </div>
            </a>
            <a href="#">
              <div className={styles.blog__articleContainer}>
                <Image
                  src="/img/blog/1617019170_post.jpg"
                  width={287}
                  height={215}
                  alt="Чем полезны школьные олимпиады"
                />
                <p className={styles.blog__articleContainer__date}>10 января</p>
                <p className={styles.blog__articleContainer__title}>
                  Чем полезны школьные олимпиады
                </p>
              </div>
            </a>
            <a href="#">
              <div className={styles.blog__articleContainer}>
                <Image
                  src="/img/blog/1617019236_post.jpg"
                  width={287}
                  height={215}
                  alt="Новая проверка учителей"
                />
                <p className={styles.blog__articleContainer__date}>10 января</p>
                <p className={styles.blog__articleContainer__title}>
                  Новая проверка учителей
                </p>
              </div>
            </a>
            <a href="#">
              <div className={styles.blog__articleContainer}>
                <Image
                  src="/img/blog/1617019202_post.jpg"
                  width={287}
                  height={215}
                  alt="Профессия учителя: сложности, особенности и достоинства"
                />
                <p className={styles.blog__articleContainer__date}>10 января</p>
                <p className={styles.blog__articleContainer__title}>
                  Профессия учителя: сложности, особенности и достоинства
                </p>
              </div>
            </a>
          </div>
        </section> */}
      </main>
      <footer className={clsx(styles.footer, styles.center)}>
        <div className={styles.footer__left}>
          <div className={styles.footer__rightM}>
            <a href="#">
              <div className={styles.footer__right__logo}>
                tutorio
                <span className={styles.footer__right__underLogo}>
                  Онлайн-сервис подбора репетиторов
                </span>
              </div>
            </a>
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
            <a href="">Условия использования</a>
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
            © 2011–2024, ООО «Туторио». При использовании материалов
            гиперссылка на tutorio.ru обязательна. ИНН 7710718303, ОГРН
            1087746642774. 109544, г. Москва, бульвар Энтузиастов, дом 2, 26
            этаж.
          </div>
          <div className={styles.footer__description}>
            ООО «Туторио» осуществляет деятельность в сфере IT: сервис
            предоставляет онлайн - услуги по подбору финансовых продуктов, а
            также распространению рекламы организаций - партнеров в сети
            Интернет
          </div>
          <div className={styles.footer__cookie}>
            Мы используем файлы cookie для того, чтобы предоставить
            пользователям больше возможностей при посещении сайта tutorio.ru.
            Подробнее об условиях использования.
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
    </>
  );
}
