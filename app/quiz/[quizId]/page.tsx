"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";

import { getQuizReadData } from "@/actions/quiz-instance";
import { timeFormat } from "@/utils/time";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { initializeQuiz } from "@/actions/quiz-pass";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page({ params }: { params: { quizId: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { quizId } = params;

  const { data: quiz, isLoading: quizLoading } = useQuery({
    queryKey: ["quizReadData", quizId],
    queryFn: () => getQuizReadData({ quizId }),
  });

  const { mutateAsync } = useMutation({
    mutationFn: (passer_name: string) =>
      initializeQuiz({ quizId, passer_name }),
  });

  if (!quiz || quizLoading)
    return (
      <div className="flex flex-col space-y-6">
        <Skeleton className="w-full h-[62px]" />
        <Skeleton className="w-[600px] h-6" />
        <Skeleton className="w-[141px] h-11" />
      </div>
    );

  if ("error" in quiz) return <h1>Chyba: {quiz.error.message}</h1>;

  if (!searchParams.get("name")) {
    return (
      <div className="space-y-2">
        <h1>Chyba: není definováno jméno uživatele</h1>
        <Button onClick={() => router.replace("/")}>Zpět</Button>
      </div>
    );
  }

  const questionsCount = quiz.questionsCount ?? 0;
  const totalTime = questionsCount * (quiz.seconds_per_question ?? 0);

  const handleStartQuiz = async () => {
    const data = await mutateAsync(searchParams.get("name")!);

    // TODO: Error handling
    if ("error" in data) return;

    router.replace(`/quiz/${quizId}/${data[0].id}`);
  };

  return (
    <div className="space-y-6">
      <Alert>
        <AlertDescription className="text-lg">
          Test obsahuje{" "}
          {
            <span className="text-orange-500 font-bold">
              {questionsCount} otázek
            </span>
          }{" "}
          a na jeho vyplnění máte maximálně{" "}
          {
            <span className="text-orange-500 font-bold">
              {timeFormat(totalTime)}
            </span>
          }
          .
        </AlertDescription>
      </Alert>
      <div className="space-y-4">
        <p>
          V testu se správné odpovědi vybírají z více možností a vždy je pouze
          jedna správná.
        </p>
      </div>
      <Button size="lg" onClick={handleStartQuiz}>
        Spustit test
      </Button>
    </div>
  );
}
