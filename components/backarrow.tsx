"use client"; // Needed if using Next.js App Router

import { useRouter } from "next/navigation";

const BackArrow = () => {
  const router = useRouter();

  return (
    <button onClick={() => router.push("/")} style={{ fontSize: "24px", cursor: "pointer" }} >
      ← Back
    </button>
  );
};

export default BackArrow;
