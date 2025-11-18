import { SelectSubject } from "@/components/SelectSubject/SelectSubject";
import clsx from "clsx";
import styles from "../../../app/page.module.css";
import { IndexClient } from "./IndexClient";
import { SecondBlockSubject } from "@/types/types";
import { SubjectWithSubcategories } from "./SubjectWithSubcategories";
import Image from "next/image";
import Link from "next/link";
import { Faq } from "../Faq/Faq";

// Тип для предмета/секции
interface SubjectItem {
  link: string;
  id_p?: string;
  subject?: string;
  label: string;
  description?: string;
  size?: "small" | "medium";
}

// Первый блок
const subjects: SubjectItem[] = [
  {
    link: "/match/subject/ege",
    label: "Подготовка к ЕГЭ 📝",
    description:
      "Подготовка к единому государственному экзамену по основным предметам",
    subject: "Подготовка к ЕГЭ",
    size: "medium",
  },
  {
    link: "/match/goal/school-subjects",
    id_p: "472",
    label: "Начальная школа 📚",
    description: "Успешный старт в учебе",
    subject: "Начальная школа",
    size: "small",
  },
  {
    link: "/match/goal/english",
    id_p: "5",
    label: "Английский язык 🇬🇧",
    description: "Уверенный английский для учебы и жизни",
    subject: "Английский язык",
    size: "small",
  },
  {
    link: "/match/goal/school-subjects",
    id_p: "366",
    label: "Математика ➗",
    description: "Устраним пробелы, научим решать задачи уверенно",
    subject: "Математика",
    size: "small",
  },
  {
    link: "/match/goal/school-subjects",
    id_p: "614",
    label: "Русский язык 🇷🇺",
    description: "Грамотность без страха. Пишем и говорим правильно!",
    subject: "Русский язык",
    size: "small",
  },
  {
    link: "/match/goal/preparing-for-school",
    id_p: "517",
    label: "Подготовка к школе 🎒",
    description: "Будущий первоклассник: учимся с удовольствием!",
    subject: "Подготовка к школе",
    size: "small",
  },
  {
    link: "/match/goal/school-subjects",
    id_p: "625",
    label: "Физика ⚡",
    description: "Сложная физика станет понятной",
    subject: "Физика",
    size: "small",
  },
];

// Второй блок данных
const subjectsSecond: SecondBlockSubject[] = [
  {
    mainLink: "/match/subject/oge",
    mainLabel: "Подготовка к ОГЭ",
    goal: "Подготовка к ОГЭ",
    subcategories: [
      {
        name: "ОГЭ по русскому языку",
        link: "/match/class/8-9",
        id_p: "614",
        goal: "Подготовка к ОГЭ",
      },
      {
        name: "ОГЭ по математике",
        link: "/match/class/8-9",
        id_p: "366",
        goal: "Подготовка к ОГЭ",
      },
      {
        name: "ОГЭ по обществознанию",
        link: "/match/class/8-9",
        id_p: "506",
        goal: "Подготовка к ОГЭ",
      },
      {
        name: "ОГЭ по информатике и ИКТ",
        link: "/match/class/8-9",
        id_p: "235",
        goal: "Подготовка к ОГЭ",
      },
      {
        name: "ОГЭ по английскому языку",
        link: "/match/class/8-9",
        id_p: "5",
        goal: "Подготовка к ОГЭ",
      },
    ],
  },
  {
    mainLink: "/match/subject/ege",
    mainLabel: "Подготовка к ЕГЭ",
    goal: "Подготовка к ЕГЭ",
    subcategories: [
      {
        name: "ЕГЭ по русскому языку",
        link: "/match/class/10-11",
        id_p: "614",
        goal: "Подготовка к ОГЭ",
      },
      {
        name: "ЕГЭ по математике",
        link: "/match/class/10-11",
        id_p: "366",
        goal: "Подготовка к ОГЭ",
      },
      {
        name: "ЕГЭ по обществознанию",
        link: "/match/class/10-11",
        id_p: "506",
        goal: "Подготовка к ОГЭ",
      },
      {
        name: "ЕГЭ по информатике и ИКТ",
        link: "/match/class/10-11",
        id_p: "235",
        goal: "Подготовка к ОГЭ",
      },
      {
        name: "ЕГЭ по биологии",
        link: "/match/class/10-11",
        id_p: "43",
        goal: "Подготовка к ОГЭ",
      },
    ],
  },
  {
    mainLink: "/match/goal/english",
    mainLabel: "Английский язык",
    id_p: "5",
    subcategories: [
      {
        name: "Немецкий язык",
        link: "/match/goal/german",
        id_p: "490",
      },
      {
        name: "Французский язык",
        link: "/match/goal/french",
        id_p: "672",
      },
      {
        name: "Китайский язык",
        link: "/match/goal/chinese",
        id_p: "309",
      },
      {
        name: "Испанский язык",
        link: "/match/goal/spanish",
        id_p: "282",
      },
      {
        name: "Итальянский язык",
        link: "/match/goal/italian",
        id_p: "302",
      },
    ],
  },
  {
    mainLink: "/match/goal/special-subjects",
    mainLabel: "Высшая математика",
    id_p: "88",
    subcategories: [
      {
        name: "Аналитическая геометрия",
        link: "/match/goal/special-subjects",
        id_p: "89",
      },
      {
        name: "Теория вероятностей",
        link: "/match/goal/special-subjects",
        id_p: "108",
      },
      {
        name: "Интегральные уравнения",
        link: "/match/goal/special-subjects",
        id_p: "97",
      },
      {
        name: "Математический анализ",
        link: "/match/goal/special-subjects",
        id_p: "104",
      },
      {
        name: "Дискретная математика",
        link: "/match/goal/special-subjects",
        id_p: "92",
      },
    ],
  },
  // второй ряд
  {
    mainLink: "/match/goal/school-subjects",
    mainLabel: "Начальная школа",
    id_p: "472",
    subcategories: [
      {
        name: "Подготовка к школе",
        link: "/match/goal/preparing-for-school",
        id_p: "517",
      },
      {
        name: "Повышение успеваемости",
        link: "/match/studentType/3890",
        id_p: "472",
        goal: "Повышение успеваемости",
      },
      {
        name: "Помощь по программе",
        link: "/match/studyProgramms/name",
        id_p: "472",
        goal: "Помощь по программе",
      },
      {
        name: "ВПР по математике",
        link: "/match/studentYears/3990",
        id_p: "472",
        goal: "ВПР по математике",
      },
      {
        name: "ВПР по русскому языку",
        link: "/match/studentYears/3990",
        id_p: "472",
        goal: "ВПР по русскому языку",
      },
    ],
  },
  {
    mainLink: "/match/main/subject",
    mainLabel: "Школьные предметы",
    subcategories: [
      {
        name: "Русский язык",
        link: "/match/goal/school-subjects",
        id_p: "614",
      },
      {
        name: "Математика",
        link: "/match/goal/school-subjects",
        id_p: "366",
      },
      {
        name: "Обществознание",
        link: "/match/goal/school-subjects",
        id_p: "506",
      },
      {
        name: "Биология",
        link: "/match/goal/school-subjects",
        id_p: "43",
      },
      {
        name: "История",
        link: "/match/goal/school-subjects",
        id_p: "289",
      },
    ],
  },
  {
    mainLink: "/match/goal/school-subjects",
    mainLabel: "Литература",
    id_p: "319",
    subcategories: [
      {
        name: "Химия",
        link: "/match/goal/school-subjects",
        id_p: "685",
      },
      {
        name: "Экономика",
        link: "/match/goal/school-subjects-no-ege",
        id_p: "717",
      },
      {
        name: "Информатика",
        link: "/match/goal/school-subjects",
        id_p: "235",
      },
      {
        name: "География",
        link: "/match/goal/school-subjects",
        id_p: "121",
      },
      {
        name: "Программирование",
        link: "/match/goal/programming",
        id_p: "582",
      },
    ],
  },
  {
    mainLink: "/match/goal/artistic-subjects",
    mainLabel: "Музыка",
    id_p: "409",
    subcategories: [
      {
        name: "Гитара",
        link: "/match/goal/artistic-subjects",
        id_p: "426",
      },
      {
        name: "Фортепиано",
        link: "/match/goal/artistic-subjects",
        id_p: "468",
      },
      {
        name: "Вокал",
        link: "/match/goal/artistic-subjects",
        id_p: "77",
      },
      {
        name: "Скрипка",
        link: "/match/goal/artistic-subjects",
        id_p: "459",
      },
      {
        name: "Сольфеджио",
        link: "/match/goal/artistic-subjects",
        id_p: "460",
      },
    ],
  },
];

interface IndexServerProps {
  region_name_dative: string;
}

export const IndexServer = ({ region_name_dative }: IndexServerProps) => {
  return (
    <main>
      {/* === Первый блок === */}
      <section className={clsx(styles.firstSection, styles.center)}>
        <div className={styles.mContainer}>
          <h1>Быстрый поиск репетиторов</h1>
          <h2>
            Выбирайте репетиторов и&nbsp;общайтесь с&nbsp;ними напрямую
            без&nbsp;лишних посредников
          </h2>
        </div>

        <SelectSubject />

        <div className={styles.firstSection__snippetSearch}>
          {subjects.map((s, idx) => (
            <IndexClient
              key={idx}
              link={s.link}
              id_p={s.id_p}
              subject={s.subject}
              label={s.label}
              description={s.description}
              size={s.size}
            />
          ))}
        </div>
      </section>

      {/* === Второй блок === */}
      <section className={clsx(styles.tutorsIn, styles.center)}>
        <div className={styles.howWork__title}>
          Репетиторы в {region_name_dative}
        </div>
        <div className={styles.tutorsIn__subjects}>
          {subjectsSecond.map((s, idx) => (
            <SubjectWithSubcategories
              key={idx}
              mainLink={s.mainLink}
              mainLabel={s.mainLabel}
              subcategories={s.subcategories}
              goal={s.goal}
              id_p={s.id_p}
            />
          ))}
        </div>
      </section>

      <section className={clsx(styles.howWork, styles.center)}>
        <div className={styles.howWork__title}>Как это работает</div>
        <div className={styles.howWork__step}>
          <div className={styles.stepNumber}>01</div>
          <div className={styles.stepDescription}>
            <h3>Создайте заказ&nbsp;📋</h3>
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
              className={styles.howWork__img}
            />
          </div>
        </div>
        <div className={styles.howWork__step}>
          <div className={styles.stepNumber}>02</div>
          <div className={styles.stepDescription}>
            <h3>Получите отклики репетиторов&nbsp;📨</h3>
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
              className={styles.howWork__img}
            />
          </div>
        </div>
        <div className={styles.howWork__step}>
          <div className={styles.stepNumber}>03</div>
          <div className={styles.stepDescription}>
            <h3>Договоритесь о занятиях&nbsp;🤝</h3>
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
              className={styles.howWork__img}
            />
          </div>
        </div>
        <div className={styles.howWork__step}>
          <div className={styles.stepNumber}>04</div>
          <div className={styles.stepDescription}>
            <h3>Мы всегда на связи&nbsp;☎️</h3>
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
              className={styles.howWork__img}
            />
          </div>
        </div>
      </section>

      <section className={styles.content_block_button_section}>
        <Link href={`/match/main/subject`}>
          <button
            className={clsx(
              styles.content_block_button,
              styles.buttonYlw,
              styles.agnCntr
            )}
          >
            👉 Начать поиск репетитора 👈
          </button>
        </Link>
      </section>

      {/* <section className={styles.yourAreTutor}>
        <div className={styles.yourAreTutor__container}>
          <div className={styles.howWork__title}>Вы репетитор?</div>
          <div>Присоединяйтесь и получайте заказы учеников</div>
          <Link href={`/match/main/subject`}>
            <button
              className={clsx(
                styles.content_block_button,
                styles.buttonYlw,
                styles.agnCntr
              )}
            >
              Регистрация репетитор
            </button>
          </Link>
        </div>
      </section> */}

      <Faq />

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
              помогает мне подтянуть английский язык, имеет интересную программу
              занятий, грамотно строит урок, всегда подстраивается под мой
              график, умеет проявить понимание, гибкость. Мне нравится, как
              Илона Михайловна преподносит материал, использует в работе
              различные аудиоподборки и видеозаписи, дополнительные учебные
              пособия. И профессиональные, и личностные качества репетитора
              находятся на высоте! Успехи есть, динамика занятий положительная!
              Благодаря Илоне Михайловне я начала гораздо лучше понимать
              английский язык, стала более уверенной в общении!
            </p>
            <span className={styles.feedbacks__container__name}>Виктория</span>
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
              непонятный учитель. С помощью Ники смог разобраться во всех 12-ти
              временах, перетопил боязнь говорить и подготовился к технике
              написания письма. Планирую и дальше заниматься с этим чудесным
              преподавателем по скайпу, так как хочу подготовиться к сдаче огэ.
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
      </section>
      <section className={clsx(styles.blog, styles.center)}>
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
