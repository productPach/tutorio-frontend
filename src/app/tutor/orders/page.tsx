"use client";

import { baseUrlPath } from "@/api/server/configApi";
import { useAppSelector } from "@/store/store";
import Image from "next/image";
import { useEffect } from "react";

const TutorOrders: React.FC = () => {
  const tutor = useAppSelector((state) => state.tutor.tutor);
  useEffect(() => {
    localStorage.removeItem("confirm-code");
    localStorage.removeItem("current-user");
    localStorage.removeItem("origin-phone");
    localStorage.removeItem("confirm-time");
    localStorage.removeItem("_cr-tripData");
  }, []);
  return (
    <>
      <Image
        src={`${baseUrlPath}${tutor?.avatarUrl}`}
        alt={`${tutor?.name}`}
        width={298}
        height={298}
        priority
      />
    </>
  );
};

export default TutorOrders;
