"use client";
import { RadioListForms } from '@/components/Match/RadioListForms/RadioListForms';
import { useParams } from 'next/navigation';

const MatchPage = () => {
  const params = useParams();
  const id = params.id;

  return (
    <div>
      <h1>Match ID: {id}</h1>
      {/* <RadioListForms id={id} /> */}
    </div>
  );
};

export default MatchPage;