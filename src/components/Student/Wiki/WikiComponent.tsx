import styles from "../../../app/student/layout.module.css";
import componentStyle from "./Wiki.module.css";
import Link from "next/link";
import { Topic } from "@/types/types";

export const WikiComponent = ({ topics }: { topics: Topic[] }) => {
  return (
    <>
      <div className={styles.content_block}>
        <h3>База знаний</h3>
      </div>

      <div className={componentStyle.contentFlxRw}>
        {topics &&
          topics.map((topicItem) => (
            <div key={topicItem.id} className={componentStyle.wikiBlock}>
              <Link href={"wiki/" + topicItem.id}>
                <div className={componentStyle.container}>
                  <h2 className={componentStyle.titleWiki}>
                    {topicItem.title}
                  </h2>
                  <span>{topicItem.description}</span>
                </div>
              </Link>
            </div>
          ))}
      </div>
    </>
  );
};
