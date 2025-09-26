"use client";
import styles from "../../../app/tutor/layout.module.css";
import clsx from "clsx";
import LeftBar from "@/components/Tutor/LeftBar/LeftBar";
import { WikiComponent } from "@/components/Tutor/Wiki/Wiki";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { getAllTopics } from "@/store/features/wikiSlice";

const WikiPage: React.FC = () => {
  const page = "Wiki";
  const dispatch = useAppDispatch();
  const topics = useAppSelector((state) => state.wiki.topics).filter((topic) =>
    topic.visibleToRoles.includes("tutor")
  );

  useEffect(() => {
    dispatch(getAllTopics());
  }, [dispatch]);

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
