import VerifyEmailPage from "@/components/VerifyEmail/VerifyEmail";
import React, { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailPage />
    </Suspense>
  );
}
