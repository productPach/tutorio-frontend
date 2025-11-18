import Link from "next/link";
import styles from "../../app/page.module.css";
import {
  fetchGoalsWithTutors,
  fetchSubjectFormatsAvailability,
} from "@/api/server/landingApi";

interface Props {
  subjectSlug: string;
  region_slug?: string; // передаём регион, если нужен
}

interface GoalWithTutor {
  id: string;
  title: string;
  goalSlug?: string;
}

export const SitemapListCategories = async ({
  subjectSlug,
  region_slug,
}: Props) => {
  // 1️⃣ Получаем цели по предмету и региону
  const goals: GoalWithTutor[] = await fetchGoalsWithTutors(
    subjectSlug,
    region_slug
  );

  // 2️⃣ Получаем доступность форматов занятий
  const formats = await fetchSubjectFormatsAvailability(
    subjectSlug,
    region_slug
  );

  if (goals.length === 0) {
    return (
      <section className={styles.sectionSitemapList}>
        <p>Целей занятий пока нет для этого предмета в указанном регионе.</p>
      </section>
    );
  }

  return (
    <>
      <section className={styles.sectionSitemapList}>
        <ul className={styles.sectionSitemapListUl}>
          {/* Всегда первая ссылка */}
          <li className={styles.sectionSitemapListLi1}>Цели занятий</li>

          {/* Список целей */}
          {goals.map((goal) => (
            <li key={goal.id} className={styles.sectionSitemapListLi}>
              <Link
                href={`/repetitors/${subjectSlug}/${goal.goalSlug || goal.id}`}
              >
                {goal.title}
              </Link>
            </li>
          ))}
        </ul>
        <br></br>
        {/* Новый блок ниже целей */}
        <ul className={styles.sectionSitemapListUl}>
          <li className={styles.sectionSitemapListLi1}>Форматы занятий</li>

          {formats.remote && (
            <li className={styles.sectionSitemapListLi}>
              <Link href={`/repetitors/${subjectSlug}/online`}>
                Дистанционно
              </Link>
            </li>
          )}

          {formats.atTutor && (
            <li className={styles.sectionSitemapListLi}>
              <Link href={`/repetitors/${subjectSlug}/u-repetitora`}>
                У репетитора
              </Link>
            </li>
          )}

          {formats.atStudent && (
            <li className={styles.sectionSitemapListLi}>
              <Link href={`/repetitors/${subjectSlug}/na-domu`}>
                На дому (выезд к ученику)
              </Link>
            </li>
          )}
        </ul>
      </section>
    </>
  );
};
