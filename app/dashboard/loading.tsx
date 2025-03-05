"use client";
import { Suspense } from "react";

export default function LoadingPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <p>Loading...</p> {/* This will be shown while `page.tsx` is suspended */}
    </Suspense>
  );
}
