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

  if (!results || resultsLoading) return <div>Nacitam...</div>;
  if ("error" in results) return <div>{results.error.message}</div>;

  return (
    <div className="box col-span-12">{JSON.stringify(results, null, 2)}</div>
  );
}
