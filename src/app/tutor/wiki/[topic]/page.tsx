"use client";
import styles from "../../layout.module.css";
import clsx from "clsx";
import LeftBar from "@/components/Tutor/LeftBar/LeftBar";
import { Topic } from "@/components/Tutor/Wiki/Topic";
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
import { InviteSidebar } from "@/components/Tutor/SideBar/InviteSidbar/InviteSidebar";

const TopicPage: React.FC = () => {
  const page = "Main";
  const pageName = "ThemesByTopic";
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
      // Очищаем темы перед загрузкой новых
      dispatch(clearThemes());
      dispatch(getThemesByTopic({ topicId: topic, token }));
    }
  }, [token, topic, dispatch]);

  return (
    <section className={clsx(styles.container, styles.center)}>
      <LeftBar page={page} pageName={pageName} />
      <div className={styles.content}>
        {topicArr && <Topic themes={themes} topicTitle={topicArr.title} />}
      </div>
      <InviteSidebar />
    </section>
  );
};

export default TopicPage;
