"use client";
import { YearsInputForms } from "@/components/Match/YearsInputForm/YearsInputForms";
import { RadioListForms } from "@/components/Match/RadioListForms/RadioListForms";
import { listQuestionsAnswers } from "@/utils/listQuestionsAnswers";
import { useParams } from "next/navigation";
import React from "react";
import { UniversityInputForms } from "@/components/Match/UniversityInputForm/UniversityInputForm";
import { TextForms } from "@/components/Match/TextForms/TextForms";
import { CheckboxListForms } from "@/components/Match/CheckboxListForms/CheckboxListForms";
import { AdressInputForms } from "@/components/Match/AdressInputForms/AdressInputForms";

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

const MatchPage: React.FC = () => {
  const { typeForm, componentRoute } = useParams<{
    typeForm: string;
    componentRoute: string;
  }>();

  const ComponentsList: ComponentsList = {
    goal: RadioListForms,
    class: RadioListForms,
    "student-type": RadioListForms,
    "student-course": RadioListForms,
    deadline: RadioListForms,
    "student-level": RadioListForms,
    "tutor-gender": RadioListForms,
    "international-exam": RadioListForms,
    "study-methods": RadioListForms,
    "study-programms": RadioListForms,
    "student-years": YearsInputForms,
    "student-university": UniversityInputForms,
    timetable: TextForms,
    "study-place": CheckboxListForms,
    "student-place": AdressInputForms,
    "tutor-place": TextForms,
    "tutor-type": RadioListForms,
    info: TextForms,
    //"phone": PhoneInputForms,
    //"confirmation": ConfirmInputForms,
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

export default MatchPage;
