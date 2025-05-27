import { fetchGetTopicById } from "@/api/server/wikiApi";
import TopicPage from "@/components/Tutor/Wiki/TopicPage";
import { Topic } from "@/types/types";
import { Metadata } from "next";

type Props = {
  params: {
    topic: string;
  };
};

// Динамическая генерация мета-тегов
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const topic: Topic = await fetchGetTopicById(params.topic);

  if (!topic) {
    return {
      title: "Топик не найден — Tutorio",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${topic.title} — Tutorio`,
    robots: { index: false, follow: false },
  };
}

export default function TutorTopicPage() {
  return <TopicPage />;
}
