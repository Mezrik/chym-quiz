"use client";

import { getQuizPassResults } from "@/actions/quiz-pass";
import { useQuery } from "@tanstack/react-query";

export default function Page({
  params: { quizPassId },
}: {
  params: { quizPassId: string };
}) {
  const { data: results, isLoading: resultsLoading } = useQuery({
    queryKey: ["quizPassResults", quizPassId],
    queryFn: () => getQuizPassResults({ quizPassId }),
  });

  console.log(results);

  return <div className="box"></div>;
}
