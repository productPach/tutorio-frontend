"use client";
import { ConfirmInputForm } from "@/components/SignIn/SignInTutor/ConfirmInputForms/ConfirmInputForm";
import { FioInputForms } from "@/components/SignIn/SignInTutor/FioInputForm/FioInputForm";
import { LocationForms } from "@/components/SignIn/SignInTutor/LocationForms/LocationForms";
import { PhoneInputForms } from "@/components/SignIn/SignInTutor/PhoneInputForms/PhoneInputForms";
import { SubjectsForms } from "@/components/SignIn/SignInTutor/SubjectsForms/SubjectsForms";
import { listQuestionsForTutorSignIn } from "@/utils/signIn/signInTutor/listQuestionsForTutorSignIn";
import { useParams } from "next/navigation";
import React from "react";

interface Answer {
  id: number;
  title: string;
}

interface ComponentRenderProps {
  id: number;
  typeForm: string;
  question: string;
  description: string;
  placeholder: string;
  nextPage: string;
  answerArray: Answer[];
}

interface ComponentsList {
  [key: string]: React.ComponentType<ComponentRenderProps>;
}

const SignInTutorPage: React.FC = () => {
  const { typeForm } = useParams<{
    typeForm: string;
  }>();

  const ComponentsList: ComponentsList = {
    phone: PhoneInputForms,
    confirmation: ConfirmInputForm,
    fio: FioInputForms,
    subjects: SubjectsForms,
    // "price": ;
    locations: LocationForms,
    // "photo": ;
    // "email": ;
  };

  const ComponentRender = ComponentsList[typeForm];

  // Находим объект в массиве форм для регистрации репетитора
  const questionObject = listQuestionsForTutorSignIn.find(
    (item) => item.typeForm === typeForm
  );
  // Идентификатор формы
  const id = questionObject?.id || 0;
  // Заголовок формы
  const question = questionObject?.question || "";
  // Описание формы
  const description = questionObject?.description || "";
  // Плейсхолдер формы для полей ввода
  const placeholder = questionObject?.placeholder || "";
  // Путь на следующий шаг
  const nextPage = questionObject?.nextPage || "";
  const answerArray = questionObject?.answers || [];

  return (
    <>
      {ComponentRender ? (
        <ComponentRender
          id={id}
          typeForm={typeForm}
          question={question}
          description={description}
          placeholder={placeholder}
          nextPage={nextPage}
          answerArray={answerArray}
        />
      ) : null}
    </>
  );
};

export default SignInTutorPage;
