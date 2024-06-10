"use client";
import { InputForms } from '@/components/Match/InputForms/InputForms';
import { RadioListForms } from '@/components/Match/RadioListForms/RadioListForms';
import { listQuestionsAnswers } from '@/utils/listQuestionsAnswers';
import { useParams } from 'next/navigation';
import React from 'react';

interface Answer {
  id: number;
  title: string;
  nextPage: string;
}

interface ComponentRenderProps {
  question: string;
  answerArray: Answer[];
}

interface ComponentsList {
  [key: string]: React.ComponentType<ComponentRenderProps>;
}

const MatchPage: React.FC = () => {
  const { typeForm, componentRoute } = useParams<{typeForm: string, componentRoute: string}>();

  const ComponentsList: ComponentsList = {
    "goal": RadioListForms,
    "class": RadioListForms,
    "student-type": RadioListForms,
    "student-course": RadioListForms,
    "deadline": RadioListForms,
    "student-level": RadioListForms,
    "student-years": InputForms,
  }

  const ComponentRender = ComponentsList[typeForm];

  const questionObject = listQuestionsAnswers.find(item => item.typeForm === typeForm);
  const question = questionObject?.question || '';
  const answerArray = questionObject?.page.find(page => page.type === componentRoute)?.answers || [];

  return (
        <>
          {ComponentRender ? <ComponentRender question={question} answerArray={answerArray} /> : null}
        </>
  );
};

export default MatchPage;