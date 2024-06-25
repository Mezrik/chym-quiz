"use client";
import { getQuizResults } from "@/actions/quiz-instance";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { timeFormat } from "@/utils/time";
import { getChartTypeCaption } from "@/utils/quiz-setup";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page({
  params: { quizId },
}: {
  params: { quizId: string };
}) {
  const { data: results, isLoading: resultsLoading } = useQuery({
    queryKey: ["quizResults", quizId],
    queryFn: () => getQuizResults({ quizId }),
  });

  if (!results || resultsLoading)
    return (
      <div className="col-span-12 space-y-4">
        <h1 className="text-xl font-bold">Kód pro studenty: {quizId}</h1>
        <Skeleton className="w-full h-[170px]" />
        <Skeleton className="w-full h-[170px]" />
        <Skeleton className="w-full h-[170px]" />
        <Skeleton className="w-full h-[170px]" />
      </div>
    );

  if ("error" in results) return <div>{results?.error.message ?? "Error"}</div>;

  return (
    <div className="col-span-12 space-y-4">
      <h1 className="text-xl font-bold">Kód pro studenty: {quizId}</h1>

      <div className="box space-y-3">
        <h3 className="text-lg font-light uppercase text-gray-400">
          Informace o skupině
        </h3>
        <p>
          Datum vytvoření testu:{" "}
          {
            <span className="text-green-500">
              {format(new Date(results.createdAt), "dd.MM.yyyy")}
            </span>
          }
        </p>
        <p>
          Počet otázek:{" "}
          {
            <span className="text-green-500">
              {results.questionCounts.total}
            </span>
          }
        </p>
        <p>
          Maximální čas na test:{" "}
          {
            <span className="text-green-500">
              {timeFormat(results.totalTime)}
            </span>
          }
        </p>

        <p className="pt-4">
          Počet vyplnění:{" "}
          {<span className="text-green-500">{results.filledInTimes}</span>}
        </p>
        <p>
          Průměrný čas vyplnění:{" "}
          {
            <span className="text-green-500">
              {timeFormat(results.averageTimeTaken)}
            </span>
          }
        </p>
      </div>

      <div className="box space-y-3">
        <div className="space-y-2">
          <h3 className="text-lg font-light uppercase text-gray-400">
            Celkově
          </h3>
          <p>
            Průměrná úspěšnost:{" "}
            {
              <span className="text-green-500">
                {Math.round(results.averageSuccessRate ?? 0)}%
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
          {Object.entries(results.averageSetSuccessRate ?? 0).map(
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
          {Object.entries(results.averageTypeSuccessRate ?? 0).map(
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

      <div className="box space-y-2">
        <h3 className="text-lg font-light uppercase text-gray-400">
          Průměr za jednotlivce
        </h3>
        <div className="space-y-2">
          {results.individualResults.map(
            ({ id, passer_name, total_correct_percentage }) => (
              <p key={id}>
                <span>{`${passer_name}: `}</span>
                <span className="text-green-500">
                  {Math.round(total_correct_percentage ?? 0)}%
                </span>
              </p>
            )
          )}
        </div>
      </div>
    </div>
  );
}
