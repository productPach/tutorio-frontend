import { SelectSubject } from "@/components/SelectSubject/SelectSubject";
import clsx from "clsx";
import styles from "../../app/page.module.css";
import Link from "next/link";
import { Faq } from "../Landing/Faq/Faq";
import { SitemapSubjectList } from "./SitemapSubjectList";
import { SitemapListCategories } from "./SitemapListCategories";

interface IndexServerProps {
  region_name_dative: string;
  subjects: { id: string; title: string; for_chpu: string }[];
  subjectSlug?: string;
  region_slug?: string;
}

export const SitemapServer = ({
  region_name_dative,
  subjects,
  subjectSlug,
  region_slug,
}: IndexServerProps) => {
  return (
    <main>
      {/* === Первый блок === */}
      <section className={clsx(styles.firstSection, styles.center)}>
        <div className={styles.mContainer}>
          <h1>Карта сайта</h1>
          <h2>
            Репетиторы в {region_name_dative} — выбирай предмет и начинай
            занятия!
          </h2>
        </div>

        <SelectSubject />
      </section>

      {subjectSlug ? (
        <SitemapListCategories
          subjectSlug={subjectSlug}
          region_slug={region_slug}
        />
      ) : (
        <SitemapSubjectList subjects={subjects} />
      )}

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

      <Faq />
    </main>
  );
};
