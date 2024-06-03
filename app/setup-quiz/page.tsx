"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { SetupForm } from "@/components/quiz/setup/setup-form";
import { getQuizSets } from "@/actions/quiz-set";
import { insertNewQuizInstance } from "@/actions/quiz-instance";

export default function SetupQuiz() {
  const router = useRouter();

  const { data: quizSets, isLoading: quizSetsLoading } = useQuery({
    queryKey: ["quizSets"],
    queryFn: () => getQuizSets(),
  });

  console.log(quizSets);

  const mutation = useMutation({
    mutationFn: insertNewQuizInstance,
  });

  return (
    <section className="col-span-12">
      <SetupForm
        handleSubmit={({ quizSets, timeLimit, email }) => {
          mutation.mutate({ quizSetIds: quizSets, timeLimit, email });
          router.push("/");
        }}
        quizSets={quizSets && "error" in quizSets ? [] : quizSets ?? []}
        quizSetsLoading={quizSetsLoading}
      />
    </section>
  );
}
