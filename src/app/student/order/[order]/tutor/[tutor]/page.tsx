import { fetchTutorByIdPublic } from "@/api/server/tutorApi";
import TutorPage from "@/components/Student/Tutor/TutorPage";
import type { Metadata } from "next";

export async function generateMetadata(context: any): Promise<Metadata> {
  // Вытянем из контекста params.tutor
  const params = (context as { params: { order: string; tutor: string } })
    .params;
  const tutorId = params.tutor;

  const tutor = await fetchTutorByIdPublic(tutorId);

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
