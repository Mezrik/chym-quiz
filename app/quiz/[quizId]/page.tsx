"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { getQuizReadData } from "@/actions/quiz-instance";
import { timeFormat } from "@/utils/time";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { initializeQuiz } from "@/actions/quiz-pass";

export default function Page({ params }: { params: { quizId: string } }) {
  const router = useRouter();
  const { quizId } = params;

  const { data: quiz, isLoading: quizLoading } = useQuery({
    queryKey: ["quizReadData", quizId],
    queryFn: () => getQuizReadData({ quizId }),
  });

  const { mutateAsync } = useMutation({
    mutationFn: (passer_name: string) =>
      initializeQuiz({ quizId, passer_name }),
  });

  if (!quiz || quizLoading) return <h1>Test se načítá</h1>;

  if ("error" in quiz) return <h1>Chyba: {quiz.error.message}</h1>;

  const questionsCount = quiz.questionsCount ?? 0;
  const totalTime = questionsCount * (quiz.seconds_per_question ?? 0);

  console.log(quiz);

  const handleStartQuiz = async () => {
    const data = await mutateAsync("test_name");

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
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin a lacus
          magna. Sed molestie purus dolor, at fringilla sem fringilla in.
          Vestibulum eu tincidunt nunc. Nulla facilisi. Nam efficitur libero
          hendrerit, ullamcorper diam eu, consectetur magna. Maecenas quis augue
          sem. Aenean imperdiet imperdiet vulputate. Vivamus mauris risus,
          rutrum porttitor auctor id, consectetur sed elit. Donec varius ligula
          nibh, ac dignissim diam ornare a. Aenean finibus nunc eget ante
          viverra blandit ornare sit amet nisi. Maecenas scelerisque nisl in
          tortor blandit tincidunt.
        </p>
        <p>
          Morbi leo dui, vehicula et urna eu, rutrum rutrum nulla. Nullam vel
          odio ut velit consectetur condimentum. Cras porta finibus tincidunt.
          Donec lectus dolor, tristique vel eros in, consequat finibus ex.
          Maecenas auctor scelerisque odio ac hendrerit. Vestibulum porta, elit
          blandit tristique placerat, mi mi bibendum nisi, et varius justo ipsum
          at neque. Integer scelerisque ut eros vitae auctor. Vivamus commodo
          mollis accumsan. Donec tincidunt massa nec neque vestibulum
          ullamcorper. Aenean in nunc lectus.
        </p>
      </div>
      <Button size="lg" onClick={handleStartQuiz}>
        Spustit test
      </Button>
    </div>
  );
}
