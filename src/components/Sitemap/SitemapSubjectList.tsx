import Link from "next/link";
import styles from "../../app/page.module.css";

interface Props {
  subjects: { id: string; title: string; for_chpu: string }[];
}

export const SitemapSubjectList = ({ subjects }: Props) => {
  return (
    <section className={styles.sectionSitemapList}>
      <ul className={styles.sectionSitemapListUl}>
        {/* Всегда первые пункты */}
        <li className={styles.sectionSitemapListLi1}>
          <Link href="/">Главная</Link>
        </li>
        <li className={styles.sectionSitemapListLi2}>
          <Link href="/repetitors">Все предметы</Link>
        </li>

        {/* Предметы */}
        {subjects.map((s) => (
          <li key={s.id} className={styles.sectionSitemapListLi}>
            <Link href={`/sitemap/${s.for_chpu}`}>{s.title}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
};
