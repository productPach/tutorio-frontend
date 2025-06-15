import { fetchGetTopicById } from "@/api/server/wikiApi";
import TopicPage from "@/components/Tutor/Wiki/TopicPage";
import { Topic } from "@/types/types";
import type { Metadata } from "next";

export async function generateMetadata(context: any): Promise<Metadata> {
  // Вытянем params.topic из переданного Next.js контекста:
  const params = (context as { params: { topic: string } }).params;
  const topicId = params.topic;

  const topic: Topic = await fetchGetTopicById(topicId);

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
