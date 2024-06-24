"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";

import { SetupForm } from "@/components/quiz/setup/setup-form";
import { getQuizSets } from "@/actions/quiz-set";
import { insertNewQuizInstance } from "@/actions/quiz-instance";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data: quizSets, isLoading: quizSetsLoading } = useQuery({
    queryKey: ["quizSets"],
    queryFn: () => getQuizSets(),
  });

  const mutation = useMutation({
    mutationFn: insertNewQuizInstance,
  });

  return (
    <section className="col-span-12">
      <SetupForm
        handleSubmit={async ({
          quizSets,
          timeLimit,
          email,
          withoutUserResults,
          selfTest,
        }) => {
          const data = await mutation.mutateAsync({
            quizSetIds: quizSets,
            timeLimit,
            email,
            showResults: !withoutUserResults,
            selfTest,
          });

          if ("error" in data) return;

          if (selfTest) router.push(`/quiz/${data[0].id}?name="self"`);
          else router.push(`/quiz/results/total/${data[0].id}`);
        }}
        quizSets={quizSets && "error" in quizSets ? [] : quizSets ?? []}
        quizSetsLoading={quizSetsLoading}
        selfTest={searchParams.get("selfTest") === "true"}
      />
    </section>
  );
}
