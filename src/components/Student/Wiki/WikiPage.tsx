"use client";
import styles from "../../../app/student/layout.module.css";
import clsx from "clsx";
import LeftBar from "@/components/Student/LeftBar/LeftBar";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { getAllTopics } from "@/store/features/wikiSlice";
import { WikiComponent } from "@/components/Student/Wiki/WikiComponent";

const WikiPage: React.FC = () => {
  const page = "Wiki";
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const topics = useAppSelector((state) => state.wiki.topics).filter((topic) =>
    topic.visibleToRoles.includes("student")
  );

  useEffect(() => {
    if (token) {
      dispatch(getAllTopics(token));
    }
  }, [token, dispatch]);

  return (
    <>
      <section
        className={clsx(styles.container, styles.center, styles.paddingBottM)}
      >
        <LeftBar page={page} />
        <div className={styles.contentFull}>
          <WikiComponent topics={topics} />
        </div>
        {/* <SideBar /> */}
      </section>
    </>
  );
};

export default WikiPage;
