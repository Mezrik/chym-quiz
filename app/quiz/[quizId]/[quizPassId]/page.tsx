"use client";

import { useQuery } from "@tanstack/react-query";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

import { getQuizReadDataFull } from "@/actions/quiz-instance";
import { Question } from "@/components/quiz/question";
import { createClient } from "@/utils/client";
import { useEffect, useRef, useState } from "react";
import { startQuiz, hasQuizPassEnded } from "@/actions/quiz-pass";
import { Progress } from "@/components/ui/progress";
import { timeDigital } from "@/utils/time";
import { Button } from "@/components/ui/button";

export default function Page({
  params,
}: {
  params: { quizPassId: string; quizId: string };
}) {
  const router = useRouter();
  const { quizPassId, quizId } = params;

  const readOnly = quizPassId === "read-only";

  const [timeRemaining, setTimeRemaining] = useState(Number.MAX_SAFE_INTEGER);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const { data: quiz, isLoading: quizLoading } = useQuery({
    queryKey: ["quizReadDataFull", quizId],
    queryFn: () => getQuizReadDataFull({ quizId }),
  });

  const { data: ended, isLoading: endedLoading } = useQuery({
    queryKey: ["hasQuizPassEnded", quizPassId],
    queryFn: () => hasQuizPassEnded({ quizPassId }),
  });

  const roomId = useRef(`quiz-pass-${quizPassId}`);

  const goToResults = () => {
    router.replace(`/quiz/${quizId}/results/${quizPassId}`);
  };

  const trackTime = (time: number) => {
    setTimeRemaining(time);
  };

  const handleSetAnswer = (questionId: number) => (answer: number) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleSubmit = () => {
    const supabase = createClient();
    const channel = supabase.channel(roomId.current);

    channel.send({
      type: "broadcast",
      event: "submit",
      payload: answers,
    });

    supabase.removeChannel(channel);
    setTimeRemaining(0);
  };

  useEffect(() => {
    if (timeRemaining <= 0) router.replace(`/quiz/results/${quizPassId}`);
  }, [quizId, quizPassId, router, timeRemaining]);

  useEffect(() => {
    if (!quiz || "error" in quiz || quizPassId === "read-only") return;
    const supabase = createClient();

    let channel: RealtimeChannel;

    const start = async () => {
      await startQuiz({ quizPassId });

      channel = supabase.channel(roomId.current);

      channel
        .on("broadcast", { event: "time-tick" }, ({ payload }) =>
          trackTime(payload.timeRemaining)
        )
        .on("broadcast", { event: "time-end" }, (payload) => {
          setTimeRemaining(0);

          channel.send({
            type: "broadcast",
            event: "submit",
            payload: answers,
          });

          supabase.removeChannel(channel);
        })
        .subscribe();
    };

    start();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [quiz, quizPassId, answers]);

  if (!quiz || quizLoading || endedLoading || ended)
    return <h1>Test se načítá</h1>;

  if ("error" in quiz) return <h1>Chyba: {quiz.error.message}</h1>;

  const questionsCount = quiz.questions?.length ?? 0;
  const totalTime = questionsCount * (quiz.seconds_per_question ?? 0);

  return (
    <div>
      {!readOnly && (
        <div className="flex gap-4 items-center">
          <Progress value={(timeRemaining / (totalTime * 1000)) * 100} />
          <div>{timeDigital(Math.round(timeRemaining / 1000))}</div>
        </div>
      )}
      {quiz.questions?.map((q) =>
        q ? (
          <Question
            key={q.id}
            id={q.id}
            text={q?.text}
            answers={q?.quiz_question_answer}
            onAnswer={handleSetAnswer(q.id)}
            readOnly={readOnly}
          />
        ) : null
      )}
      {!readOnly && (
        <Button type="button" onClick={handleSubmit}>
          Odevzdat
        </Button>
      )}
    </div>
  );
}
