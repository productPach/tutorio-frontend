"use client";
import { SelectSubject } from "@/components/SelectSubject/SelectSubject";
import clsx from "clsx";
import styles from "../../../app/page.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export const Index = () => {
  const router = useRouter();

  const linkApplicationSubject = useCallback(
    (link: string) => {
      document.body.style.overflow = "auto";
      router.push(link);
    },
    [router]
  );

  // Функция для подставления предмета в поле поиска по клику + прокидываем флоу дальше
  const handleSubject = useCallback(
    (nextPage: string, id_p?: string, subject?: string) => {
      // Очищаем предыдущие данные заявок из LS, если они есть
      localStorage.removeItem("currentMatch");
      // Очищаем предыдущие данные по таймеру
      localStorage.removeItem("confirm-time");
      // Очищаем предыдущие данные телефона
      localStorage.removeItem("origin-phone");

      let dataToSave;
      if (id_p) {
        // Создаем новый объект для добавления в LS
        dataToSave = [
          {
            id: 0,
            subject: id_p,
          },
        ];
      } else {
        // Создаем новый объект для добавления в LS
        dataToSave = [
          {
            id: 1,
            goal: subject,
          },
        ];
      }

      // Добавляем объект в LS
      localStorage.setItem("currentMatch", JSON.stringify(dataToSave));
      linkApplicationSubject(nextPage);
    },
    [linkApplicationSubject]
  );

  return (
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
            onClick={() =>
              handleSubject("/match/subject/ege", "", "Подготовка к ЕГЭ")
            }
            className={clsx(styles.firstSection__snippet, styles.snippetMedium)}
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
            onClick={() =>
              handleSubject(
                "/match/goal/school-subjects",
                "472",
                "Начальная школа"
              )
            }
            className={clsx(styles.firstSection__snippet, styles.snippetSmall)}
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
            onClick={() =>
              handleSubject("/match/goal/english", "5", "Английский язык")
            }
            className={clsx(styles.firstSection__snippet, styles.snippetSmall)}
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
            onClick={() =>
              handleSubject("/match/goal/school-subjects", "366", "Математика")
            }
            className={clsx(styles.firstSection__snippet, styles.snippetSmall)}
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
            onClick={() =>
              handleSubject(
                "/match/goal/school-subjects",
                "614",
                "Русский язык"
              )
            }
            className={clsx(styles.firstSection__snippet, styles.snippetSmall)}
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
            onClick={() =>
              handleSubject(
                "/match/goal/preparing-for-school",
                "517",
                "Подготовка к школе"
              )
            }
            className={clsx(styles.firstSection__snippet, styles.snippetSmall)}
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
            onClick={() =>
              handleSubject("/match/goal/school-subjects", "625", "Физика")
            }
            className={clsx(styles.firstSection__snippet, styles.snippetSmall)}
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
  );
};
