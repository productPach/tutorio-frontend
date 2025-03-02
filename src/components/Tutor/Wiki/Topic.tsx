import React from "react";
import ReactMarkdown from "react-markdown";
import styles from "../../../app/tutor/layout.module.css";
import componentStyle from "./Wiki.module.css";
import { memo } from "react";
import { Theme } from "@/types/types";
import Link from "next/link";

export const Topic = memo(
  ({ themes, topicTitle }: { themes: Theme[]; topicTitle: string }) => {
    if (!themes) {
      return <p>Загрузка тем ...</p>;
    }
    console.log(themes);

    return (
      <>
        <div className={styles.content_block}>
          <h3>{topicTitle}</h3>
          <div className={componentStyle.containerThemesList}>
            {themes.map((theme) => (
              <div key={theme.id}>
                <Link
                  className={componentStyle.itemThemesList}
                  href={"#" + theme.id}
                >
                  {theme.title}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {themes.map((theme) => (
          <div id={theme.id} key={theme.id} className={styles.content_block}>
            <h3>{theme.title}</h3>
            {/* <div dangerouslySetInnerHTML={{ __html: theme.content }} /> */}
            <ReactMarkdown>{theme.content}</ReactMarkdown>
          </div>
        ))}

        {/* <div className={componentStyle.contentFlxRw}>
          {themes.map((theme) => (
            <div key={theme.id} className={componentStyle.wikiBlock}>
              <div className={componentStyle.container}>
                <h2 className={componentStyle.titleWiki}>{theme.title}</h2>
                <span>{theme.content}</span>
              </div>
            </div>
          ))}
        </div> */}
      </>
    );
  }
);
