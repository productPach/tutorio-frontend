"use client";

import ReactMarkdown from "react-markdown";
import componentStyle from "../Wiki/Wiki.module.css";
import styles from "../Order/Order.module.css";
import { SpinnerOrders } from "@/components/Spinner/SpinnerOrders";
import clsx from "clsx";
import { Student, Theme } from "@/types/types";
import Link from "next/link";
import { useEffect } from "react";

type OrderProps = {
  loading: boolean;
  student: Student | null;
  error: string | null;
};

export const WikiForOrderComponent = ({
  themes,
  topicTitle,
}: {
  themes: Theme[];
  topicTitle: string;
}) => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, []);

  return (
    <>
      <div className={styles.content_block}>
        <h3 className={componentStyle.h3}>{topicTitle}</h3>
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
    </>
  );
};
