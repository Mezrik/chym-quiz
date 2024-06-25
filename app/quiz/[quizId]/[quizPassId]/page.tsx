"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { getQuizReadDataFull } from "@/actions/quiz-instance";
import { Question } from "@/components/quiz/question";
import { createClient } from "@/utils/client";
import { useCallback, useEffect, useRef, useState } from "react";
import { hasQuizPassEnded, submitQuiz } from "@/actions/quiz-pass";
import { Progress } from "@/components/ui/progress";
import { timeDigital } from "@/utils/time";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

export default function Page({
  params,
}: {
  params: { quizPassId: string; quizId: string };
}) {
  const router = useRouter();
  const { quizPassId, quizId } = params;

  const readOnly = quizPassId === "read-only";

  const [hasError, setHasError] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(Number.MAX_SAFE_INTEGER);
  const [warning, setWarning] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const { data: quiz, isLoading: quizLoading } = useQuery({
    queryKey: ["quizReadDataFull", quizId],
    queryFn: () => getQuizReadDataFull({ quizId }),
  });

  const { data: ended, isLoading: endedLoading } = useQuery({
    queryKey: ["hasQuizPassEnded", quizPassId],
    queryFn: () => hasQuizPassEnded({ quizPassId }),
  });

  const { mutateAsync: submitQuizMutate } = useMutation({
    mutationFn: () => submitQuiz({ quizPassId, answers }),
  });

  const trackTime = (time: number) => {
    setTimeRemaining(time);
  };

  const handleSetAnswer = (questionId: number) => (answer: number) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleSubmit = useCallback(
    (bypassWarning = false) => {
      if (
        !bypassWarning &&
        !warning &&
        quiz &&
        !("error" in quiz) &&
        Object.entries(answers).length != quiz?.questions?.length
      ) {
        setWarning(true);
        return;
      }

      submitQuizMutate().then(() =>
        router.replace(`/quiz/results/${quizPassId}`)
      );
    },
    [answers, warning, quiz, quizPassId, router, submitQuizMutate]
  );

  useEffect(() => {
    if (!quiz || "error" in quiz || quiz.without_time_limit) return;

    if (timeRemaining <= 0) handleSubmit(true);
  }, [handleSubmit, quiz, quizId, quizPassId, router, timeRemaining]);

  useEffect(() => {
    if (!quiz || "error" in quiz || quizPassId === "read-only") return;
    const supabase = createClient();

    const start = async () => {
      const { data, error } = await supabase.functions.invoke("quiz-stream", {
        body: { quizPassId },
      });

      if (error) {
        setHasError(true);
        return;
      }

      const reader = data.body.getReader();

      reader.read().then(function pump({ done, value }: any) {
        if (done) {
          return;
        }

        const text = new TextDecoder().decode(value);
        let data;
        try {
          data = JSON.parse(text);
        } catch (error) {
          data = {};
        }

        if (data.event === "time-tick") {
          trackTime(data.payload.timeRemaining);
        } else if (data.event === "time-end") {
          setTimeRemaining(0);
        }

        // Read some more, and call this function again
        return reader.read().then(pump);
      });
    };

    start();
  }, [quiz, quizPassId]);

  if (!quiz || quizLoading || endedLoading || ended)
    return (
      <div className="flex flex-col">
        <Skeleton className="h-4 w-full" />
        <div className="mt-6 flex flex-col space-y-4">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full " />
          <Skeleton className="h-96 w-full " />
        </div>
      </div>
    );

  if ("error" in quiz) return <h1>Chyba: {quiz.error.message}</h1>;

  const questionsCount = quiz.questions?.length ?? 0;
  const totalTime = questionsCount * (quiz.seconds_per_question ?? 0);

  return (
    <div className="flex flex-col">
      {hasError && (
        <div className="flex gap-4">
          <h1 className="text-xl font-bold">Nastala chyba</h1>
          <Button type="button" onClick={() => router.replace("/")}>
            Domů
          </Button>
        </div>
      )}
      {!readOnly && !quiz.without_time_limit && (
        <div className="flex gap-4 items-center sticky top-0 bg-white/70">
          {Number.MAX_SAFE_INTEGER === timeRemaining ? (
            <>
              <Skeleton className="h-4 w-full" />
            </>
          ) : (
            <>
              <Progress value={(timeRemaining / (totalTime * 1000)) * 100} />
              <div>{timeDigital(Math.round(timeRemaining / 1000))}</div>
            </>
          )}
        </div>
      )}
      <div className="space-y-4 mt-6">
        {quiz.questions?.map((q) =>
          q ? (
            <Question
              key={q.id}
              id={q.id}
              text={q?.text}
              answers={q?.quiz_question_answer}
              onAnswer={handleSetAnswer(q.id)}
              readOnly={readOnly}
              imageUrl={q.image_url}
            />
          ) : null
        )}
      </div>
      {!readOnly && (
        <Button
          type="button"
          onClick={() => handleSubmit()}
          className="mt-8 ml-auto"
        >
          Odevzdat
        </Button>
      )}

      <Dialog open={warning} onOpenChange={setWarning}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Opravdu chcete pokračovat?</DialogTitle>
            <DialogDescription>
              Nemáte vyplněné všechny otázky
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button type="button" onClick={() => handleSubmit()}>
              Pokračovat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
