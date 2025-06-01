import { fetchGetPublicOrderById } from "@/api/server/orderApi";
import { fetchTutorByIdPublic } from "@/api/server/tutorApi";
import TutorPage from "@/components/Student/Tutor/TutorPage";
import { data } from "@/utils/listSubjects";
import { Metadata } from "next";

type Props = {
  params: {
    order: string;
    tutor: string;
  };
};

// Динамическая генерация мета-тегов
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tutor = await fetchTutorByIdPublic(params.tutor);

  if (!tutor) {
    return {
      title: "Репетитор не найден — Tutorio",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${tutor.name} — Tutorio`,
    robots: { index: false, follow: false },
  };
}

export default function StudentTutorPage() {
  return <TutorPage />;
}
