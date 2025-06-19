"use client";
import { YearsInputForms } from "@/components/Match/YearsInputForm/YearsInputForms";
import { RadioListForms } from "@/components/Match/RadioListForms/RadioListForms";
import { listQuestionsAnswers } from "@/utils/listQuestionsAnswers";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { UniversityInputForms } from "@/components/Match/UniversityInputForm/UniversityInputForm";
import { TextForms } from "@/components/Match/TextForms/TextForms";
import { CheckboxListForms } from "@/components/Match/CheckboxListForms/CheckboxListForms";
import { AdressInputForms } from "@/components/Match/AdressInputForms/AdressInputForms";
import { PhoneInputForms } from "@/components/Match/PhoneInputForms/PhoneInputForms";
import { ConfirmInputForm } from "@/components/Match/ConfirmInputForms/ConfirmInputForm";
import { FioInputForms } from "@/components/Match/FioInputForm/FioInputForm";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/store";
import { getTokenFromCookie } from "@/utils/cookies/cookies";
import { setToken } from "@/store/features/authSlice";
import { setStudent } from "@/store/features/studentSlice";
import { getStudentFromLocalStorage } from "@/utils/localStorage/localStorage";
import { LocationMultiDropdownForm } from "@/components/Match/LocationMultiDropdownForm/LocationMultiDropdownForm";

interface Answer {
  id: number;
  title: string;
  nextPage: string;
}

interface ComponentRenderProps {
  id: number;
  question: string;
  description: string;
  typeForm: string;
  answerArray: Answer[];
}

interface ComponentsList {
  [key: string]: React.ComponentType<ComponentRenderProps>;
}

const Match: React.FC = () => {
  const route = useRouter();
  const dispatch = useAppDispatch();
  const [matchData, setMatchData] = useState<any | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Получаем токен из куки
    // Если токен в куки есть, тогда добавляем токен в Redux
    const token = getTokenFromCookie();
    if (token) {
      dispatch(setToken(token));
    }

    const student = getStudentFromLocalStorage();
    if (student) {
      dispatch(setStudent(student));
    }
  }, [dispatch]);

  // Вытаскиваем актуальный массив c данными формы из LocalStorage
  // Проверяем localStorage (только на клиенте)
  useEffect(() => {
    const raw = localStorage.getItem("currentMatch");

    if (!raw) {
      // Если в LS нет объекта с ключом currentMatch, делаем редирект на главную
      route.push("/");
    } else {
      try {
        setMatchData(JSON.parse(raw));
        setIsReady(true);
      } catch {
        route.push("/");
      }
    }
  }, [route]);

  const { typeForm, componentRoute } = useParams<{
    typeForm: string;
    componentRoute: string;
  }>();

  const ComponentsList: ComponentsList = {
    goal: RadioListForms,
    class: RadioListForms,
    studentType: RadioListForms,
    studentCourse: RadioListForms,
    deadline: RadioListForms,
    studentLevel: RadioListForms,
    tutorGender: RadioListForms,
    internationalExam: RadioListForms,
    studyMethods: RadioListForms,
    studyProgramms: RadioListForms,
    studentYears: YearsInputForms,
    studentUniversity: UniversityInputForms,
    timetable: TextForms,
    studyPlace: CheckboxListForms,
    studentAdress: AdressInputForms,
    studentTrip: LocationMultiDropdownForm,
    tutorType: RadioListForms,
    autoContacts: RadioListForms,
    info: TextForms,
    fio: FioInputForms,
    phone: PhoneInputForms,
    confirmation: ConfirmInputForm,
  };

  const ComponentRender = ComponentsList[typeForm];

  const questionObject = listQuestionsAnswers.find(
    (item) => item.typeForm === typeForm
  );
  const question = questionObject?.question || "";
  const description = questionObject?.description || "";
  const id = questionObject?.id || 0;
  const answerArray =
    questionObject?.page.find((page) => page.type === componentRoute)
      ?.answers || [];

  return (
    <>
      {ComponentRender ? (
        <ComponentRender
          id={id}
          question={question}
          description={description}
          typeForm={typeForm}
          answerArray={answerArray}
        />
      ) : null}
    </>
  );
};

export default Match;
