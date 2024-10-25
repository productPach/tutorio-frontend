"use client";

import { useEffect } from "react";

const TutorOrders: React.FC = () => {
  useEffect(() => {
    localStorage.removeItem("confirm-code");
    localStorage.removeItem("currentMatch");
    localStorage.removeItem("origin-phone");
    localStorage.removeItem("confirm-time");
  }, []);
  return <></>;
};

export default TutorOrders;
