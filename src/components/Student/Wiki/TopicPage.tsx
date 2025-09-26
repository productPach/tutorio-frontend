"use client";
import styles from "../../../app/student/layout.module.css";
import clsx from "clsx";
import LeftBar from "@/components/Student/LeftBar/LeftBar";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "@/store/store";
import { useParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import {
  clearThemes,
  getAllTopics,
  getThemesByTopic,
} from "@/store/features/wikiSlice";
import { shallowEqual } from "react-redux";
import { Topic } from "@/components/Student/Wiki/Topic";

const TopicPage: React.FC = () => {
  const page = "Main";
  const pageName = "ThemesByTopic";
  const dispatch = useDispatch<AppDispatch>();

  // Используем shallowEqual, чтобы предотвратить лишние ререндеры
  const topics = useAppSelector(
    (state) => state.wiki.topics,
    shallowEqual
  ).filter((topic) => topic.visibleToRoles.includes("student"));
  const themes = useAppSelector(
    (state) => state.wiki.themes,
    shallowEqual
  ).filter((theme) => theme.visibleToRoles.includes("student"));
  const { topic } = useParams<{ topic: string }>();

  // Находим топик в массиве
  const topicArr = useMemo(
    () => topics.find((t) => t.id === topic),
    [topics, topic]
  );

  useEffect(() => {
    dispatch(getAllTopics());
  }, [dispatch]);

  useEffect(() => {
    if (topic) {
      // Очищаем темы перед загрузкой новых
      dispatch(clearThemes());
      dispatch(getThemesByTopic({ topicId: topic }));
    }
  }, [topic, dispatch]);

  return (
    <section className={clsx(styles.container, styles.center)}>
      <LeftBar page={page} pageName={pageName} />
      <div className={styles.contentFull}>
        {topicArr && <Topic themes={themes} topicTitle={topicArr.title} />}
      </div>
      {/* <InviteSidebar /> */}
    </section>
  );
};

export default TopicPage;
