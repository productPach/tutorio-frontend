"use client";
import styles from "../../layout.module.css";
import clsx from "clsx";
import LeftBar from "@/components/Tutor/LeftBar/LeftBar";
import { Topic } from "@/components/Tutor/Wiki/Topic";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "@/store/store";
import { useParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { getAllTopics, getThemesByTopic } from "@/store/features/wikiSlice";
import { shallowEqual } from "react-redux";

const TopicPage: React.FC = () => {
  const page = "Main";
  const dispatch = useDispatch<AppDispatch>();
  const token = useAppSelector((state) => state.auth.token);

  // Используем shallowEqual, чтобы предотвратить лишние ререндеры
  const topics = useAppSelector((state) => state.wiki.topics, shallowEqual);
  const themes = useAppSelector((state) => state.wiki.themes, shallowEqual);
  const { topic } = useParams<{ topic: string }>();

  // Находим топик в массиве
  const topicArr = useMemo(
    () => topics.find((t) => t.id === topic),
    [topics, topic]
  );

  useEffect(() => {
    if (token) {
      dispatch(getAllTopics(token));
    }
  }, [token, dispatch]);

  useEffect(() => {
    if (token && topic) {
      dispatch(getThemesByTopic({ topicId: topic, token }));
    }
  }, [token, topic, dispatch]);

  return (
    <section className={clsx(styles.container, styles.center)}>
      <LeftBar page={page} />
      <div className={styles.content}>
        {topicArr && <Topic themes={themes} topicTitle={topicArr.title} />}
      </div>
    </section>
  );
};

export default TopicPage;
