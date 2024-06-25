"use client";

import { getQuizPassResults } from "@/actions/quiz-pass";
import { Question } from "@/components/quiz/question";
import { Skeleton } from "@/components/ui/skeleton";
import { getChartTypeCaption } from "@/utils/quiz-setup";
import { timeFormat } from "@/utils/time";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

export default function Page({
  params: { quizPassId },
}: {
  params: { quizPassId: string };
}) {
  const { data: results, isLoading: resultsLoading } = useQuery({
    queryKey: ["quizPassResults", quizPassId],
    queryFn: () => getQuizPassResults({ quizPassId }),
  });

  if (!results || resultsLoading)
    return (
      <div className="col-span-12 space-y-4">
        <h1 className="text-xl font-bold">Výsledky uživatele</h1>
        <Skeleton className="w-full h-[170px]" />
        <Skeleton className="w-full h-[170px]" />
        <Skeleton className="w-full h-[170px]" />
        <Skeleton className="w-full h-[170px]" />
      </div>
    );
  if ("error" in results) return <div>{results.error.message}</div>;

  return (
    <div className="col-span-12 space-y-4">
      <h1 className="text-xl font-bold">Výsledky uživatele</h1>

      <div className="box space-y-3">
        <h3 className="text-lg font-light uppercase text-gray-400">
          Informace
        </h3>
        {results.filledIn && (
          <p>
            Datum vyplnění testu:{" "}
            {
              <span className="text-green-500">
                {format(new Date(results.filledIn), "dd.MM.yyyy")}
              </span>
            }
          </p>
        )}
        <p>
          Počet otázek:{" "}
          {<span className="text-green-500">{results.numberOfQuestions}</span>}
        </p>
        <p>
          Maximální čas na test:{" "}
          {
            <span className="text-green-500">
              {timeFormat(results.maxTime)}
            </span>
          }
        </p>
        {results.takenTime && (
          <p>
            Čas vyplnění:{" "}
            {
              <span className="text-green-500">
                {timeFormat(results.takenTime)}
              </span>
            }
          </p>
        )}
      </div>
      <div className="box space-y-3">
        <div className="space-y-2">
          <h3 className="text-lg font-light uppercase text-gray-400">
            Celkově
          </h3>
          <p>
            Úspěšnost:{" "}
            {
              <span className="text-green-500">
                {Math.round(results.totalCorrectPercentage ?? 0)}%
              </span>
            }
          </p>
        </div>
      </div>
      <div className="flex gap-4">
        <div className="box flex-grow space-y-2">
          <h3 className="text-lg font-light uppercase text-gray-400">
            Průměr za okruhy{" "}
          </h3>
          {Object.entries(results.setsCorrectPercentage ?? 0).map(
            ([setId, { percentage, name }]) => (
              <p key={setId}>
                <span>{`${name}: `}</span>
                <span className="text-green-500">
                  {Math.round(percentage)}%
                </span>
              </p>
            )
          )}
        </div>
        <div className="box flex-grow space-y-2">
          <h3 className="text-lg font-light uppercase text-gray-400">
            Průměr za jednotlivé grafy{" "}
          </h3>
          {Object.entries(results.typesCorrectPercentage ?? 0).map(
            ([type, percentage]) => (
              <p key={type}>
                <span>{`${getChartTypeCaption(type)}: `}</span>
                <span className="text-green-500">
                  {Math.round(percentage)}%
                </span>
              </p>
            )
          )}
        </div>
      </div>
      {results.questions?.map((q) => (
        <Question
          key={q.id}
          id={q.id}
          text={q?.text}
          answers={q?.quiz_question_answer ?? []}
          defaultValue={q.userAnwer}
          readOnly
          imageUrl={q?.image_url}
        />
      ))}
    </div>
  );
}
