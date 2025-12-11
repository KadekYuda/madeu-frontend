"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, Suspense } from "react";
import ForgetPass from "./ForgotPass";

function ForgotPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const verified = searchParams.get("verified");
  const email = searchParams.get("email");

  useEffect(() => {
    if (verified && !email) {
      router.replace("/auth/forgot-password");
    }
  }, [verified, email, router]);

  return <ForgetPass />;
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ForgotPasswordContent />
    </Suspense>
  );
}
