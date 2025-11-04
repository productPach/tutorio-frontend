import { SelectSubject } from "@/components/SelectSubject/SelectSubject";
import clsx from "clsx";
import styles from "../../../app/page.module.css";
import { Tutor } from "@/types/types";

interface RepetitorsServerProps {
  region_name_dative: string;
  tutors: Tutor[];
  total: number;
  page: number;
  pages: number;
  subject?: {
    title: string;
    for_request: string;
    for_chpu: string;
    nextPage?: string;
  };
  goal?: {
    title: string;
    for_request: string;
    for_chpu: string;
  };
  place?: {
    slug: string;
    title: string;
  };
}

export const RepetitorsServer = ({
  region_name_dative,
  tutors,
  total,
  page,
  pages,
  subject,
  goal,
  place,
}: RepetitorsServerProps) => {
  // формируем заголовок по новой логике
  const buildTitle = () => {
    const parts = [];

    // Определяем, нужно ли указывать предмет
    const shouldShowSubject =
      subject &&
      ![
        "Помощь по программе",
        "ВПР по математике",
        "ВПР по русскому",
        "ВПР по окружающему миру",
        "Обучение чтению, письму или счёту",
        "Подготовка по методике",
      ].includes(goal?.title || "");

    // Определяем цели, где предмет ставится ПЕРЕД целью
    const subjectBeforeGoalGoals = [
      "Подготовка к школе",
      "Для себя",
      "Для работы",
      "Подготовка к специализированной школе",
      "Для ребёнка",
    ];

    const shouldPutSubjectBeforeGoal =
      goal && subjectBeforeGoalGoals.includes(goal.title);

    // Если есть место "online" - убираем город из заголовка
    if (place?.slug === "online") {
      if (subject && goal && shouldShowSubject) {
        if (shouldPutSubjectBeforeGoal) {
          parts.push(
            `Репетиторы по ${subject.for_request} для ${goal.for_request} онлайн`
          );
        } else {
          parts.push(
            `Репетиторы для ${goal.for_request} по ${subject.for_request} онлайн`
          );
        }
      } else if (goal && !shouldShowSubject) {
        // Для целей где предмет не указывается
        parts.push(`Репетиторы для ${goal.for_request} онлайн`);
      } else if (subject && shouldShowSubject) {
        parts.push(`Репетиторы по ${subject.for_request} онлайн`);
      } else if (goal) {
        parts.push(`Репетиторы для ${goal.for_request} онлайн`);
      } else {
        parts.push(`Репетиторы онлайн`);
      }
    } else {
      // Логика с городом для других случаев
      if (subject && goal && shouldShowSubject) {
        if (shouldPutSubjectBeforeGoal) {
          parts.push(
            `Репетиторы по ${subject.for_request} для ${goal.for_request} в ${region_name_dative}`
          );
        } else {
          parts.push(
            `Репетиторы для ${goal.for_request} по ${subject.for_request} в ${region_name_dative}`
          );
        }
      } else if (goal && !shouldShowSubject) {
        // Для целей где предмет не указывается
        parts.push(
          `Репетиторы для ${goal.for_request} в ${region_name_dative}`
        );
      } else if (subject && shouldShowSubject) {
        parts.push(
          `Репетиторы по ${subject.for_request} в ${region_name_dative}`
        );
      } else if (goal) {
        parts.push(
          `Репетиторы для ${goal.for_request} в ${region_name_dative}`
        );
      } else {
        parts.push(`Репетиторы в ${region_name_dative}`);
      }

      // Добавляем только "на дому", "у репетитора" не добавляем
      if (place?.slug === "na-domu") {
        parts.push(`на дому`);
      }
    }

    return parts.join(" ");
  };

  const buildAlternativeTitle = () => {
    const parts = [];

    // Определяем, нужно ли указывать предмет
    const shouldShowSubject =
      subject &&
      ![
        "Помощь по программе",
        "ВПР по математике",
        "ВПР по русскому",
        "ВПР по окружающему миру",
        "Обучение чтению, письму или счёту",
        "Подготовка по методике",
      ].includes(goal?.title || "");

    // Определяем цели, где предмет ставится ПЕРЕД целью
    const subjectBeforeGoalGoals = [
      "Подготовка к школе",
      "Для себя",
      "Для работы",
      "Подготовка к специализированной школе",
      "Для ребёнка",
    ];

    const shouldPutSubjectBeforeGoal =
      goal && subjectBeforeGoalGoals.includes(goal.title);

    // Формируем основную часть без "Репетиторы" и региона
    if (subject && goal && shouldShowSubject) {
      if (shouldPutSubjectBeforeGoal) {
        parts.push(`${goal.title} по ${subject.for_request}`);
      } else {
        parts.push(`${goal.title} по ${subject.for_request}`);
      }
    } else if (goal && !shouldShowSubject) {
      // Для целей где предмет не указывается
      parts.push(`${goal.title}`);
    } else if (subject && shouldShowSubject) {
      parts.push(`Занятия по ${subject.for_request}`);
    } else if (goal) {
      parts.push(`${goal.title}`);
    } else {
      parts.push(`Занятия с репетитором`);
    }

    // Добавляем место занятий если есть
    if (place) {
      parts.push(`${place.title}`);
    }

    return parts.join(" ");
  };

  return (
    <main>
      {/* === Первый блок === */}
      <section className={clsx(styles.firstSection, styles.center)}>
        <div className={styles.mContainer}>
          <h1>{buildTitle()}</h1>
          <h2>Подберём репетиторов, сможете общаться с&nbsp;ними напрямую</h2>
        </div>

        {/* <SelectSubject /> */}
      </section>

      <section className={styles.firstSection__snippetSearch}>
        <div
          className={clsx(
            styles.firstSection__snippet_tutor,
            styles.snippetMedium
          )}
        >
          <div className={styles.fs_SnippetItemEmj}>
            Оставьте заказ за 2 минуты&nbsp;🎯
          </div>
          <p className={styles.firstSection__snippetL}>
            Ответьте на несколько простых вопросов — предмет, цель, формат и
            стоимость занятий
          </p>
        </div>

        <div
          className={clsx(
            styles.firstSection__snippet_tutor,
            styles.snippetSmall
          )}
        >
          <div className={styles.fs_SnippetItemEmj}>
            Получайте отклики&nbsp;📢
          </div>

          <p className={styles.firstSection__snippetM}>
            Подходящие репетиторы сами откликаются на ваш запрос
          </p>
        </div>
        <div
          className={clsx(
            styles.firstSection__snippet_tutor,
            styles.snippetSmall
          )}
        >
          <div className={styles.fs_SnippetItemEmj}>
            Сравнивайте профили&nbsp;👀
          </div>

          <p className={styles.firstSection__snippetM}>
            Смотрите опыт, образование, отзывы и ставку за час
          </p>
        </div>
        <div
          className={clsx(
            styles.firstSection__snippet_tutor,
            styles.snippetSmall
          )}
        >
          <div className={styles.fs_SnippetItemEmj}>
            Общайтесь в чате&nbsp;💬
          </div>

          <p className={styles.firstSection__snippetM}>
            {/* Пишите репетиторам, обсуждайте детали и назначай первое занятие —
            без звонков и посредников */}
            Назначайте первое занятие — без звонков и посредников
          </p>
        </div>
        <div
          className={clsx(
            styles.firstSection__snippet_tutor,
            styles.snippetSmall
          )}
        >
          <div className={styles.fs_SnippetItemEmj}>
            Выбирайте по отзывам&nbsp;⭐
          </div>

          <p className={styles.firstSection__snippetM}>
            Рейтинг и отзывы помогают выбрать подходящего репетитора
          </p>
        </div>
        <div
          className={clsx(
            styles.firstSection__snippet_tutor,
            styles.snippetSmall
          )}
        >
          <div className={styles.fs_SnippetItemEmj}>
            Занимайтесь где удобно&nbsp;📍
          </div>

          <p className={styles.firstSection__snippetM}>
            Онлайн, у себя дома или у репетитора — как вам комфортно
          </p>
        </div>
        <div
          className={clsx(
            styles.firstSection__snippet_tutor,
            styles.snippetSmall
          )}
        >
          <div className={styles.fs_SnippetItemEmj}>
            Бесплатно для учеников&nbsp;🎁
          </div>

          <p className={styles.firstSection__snippetM}>
            Создание заказа и общение с репетиторами — всегда бесплатно
          </p>
        </div>
      </section>

      {/* === Список репетиторов === */}
      <section className={styles.tutorsList}>
        <h2>{buildAlternativeTitle()}</h2>
        <div className={styles.mContainer}>
          {tutors.length ? (
            tutors.map((tutor, index) => (
              <div key={index} className={styles.tutorCard}>
                <img
                  src={tutor.avatarUrl || "/default-avatar.png"}
                  alt={tutor.name}
                  className={styles.avatar}
                />
                <div>
                  <h3>{tutor.name}</h3>
                  <p>Предметы: {tutor.subject.join(", ")}</p>
                  {tutor.totalRating && <p>Рейтинг: {tutor.totalRating}</p>}
                  {/* Можно добавить отображение места занятий репетитора */}
                  {tutor.tutorPlace && tutor.tutorPlace.length > 0 && (
                    <p>
                      Место:{" "}
                      {tutor.tutorPlace
                        .map((p) => {
                          const placeMap: Record<string, string> = {
                            "1": "онлайн",
                            "2": "у репетитора",
                            "3": "на дому",
                          };
                          return placeMap[p] || p;
                        })
                        .join(", ")}
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>Репетиторы не найдены</p>
          )}
        </div>
      </section>

      {/* === Пагинация === */}
      {pages > 1 && (
        <section className={styles.pagination}>
          <div className={styles.mContainer}>
            {Array.from({ length: pages }, (_, i) => (
              <button
                key={i + 1}
                className={clsx(
                  styles.pageButton,
                  i + 1 === page && styles.active
                )}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </section>
      )}
    </main>
  );
};
