"use server";

import { createClient } from "@/utils/server";
import { Resend } from "resend";
import { CodeMailTemplate } from "@/components/email/code-mail-template";
import { headers } from "next/headers";

type ServerError = {
  error: { message: string };
};

const resend = new Resend(process.env.RESEND_API_KEY);

export const insertNewQuizInstance = async ({
  quizSetIds,
  email,
  timeLimit,
  selfTest,
  showResults,
  withoutTimeLimit,
}: {
  quizSetIds: number[];
  email?: string | null;
  timeLimit?: number | null;
  selfTest?: boolean;
  showResults?: boolean;
  withoutTimeLimit?: boolean;
}) => {
  const supabase = createClient();

  const { error, data } = await supabase
    .from("quiz_instance")
    .insert({
      author_email: email ?? "",
      seconds_per_question: timeLimit ?? 0,
      self_test: selfTest,
      show_results: showResults,
      without_time_limit: withoutTimeLimit,
    })
    .select();

  if (error) return { error: { message: error.message } } as ServerError;

  const { error: quizInstanceError } = await supabase
    .from("quiz_instance_set")
    .insert(
      quizSetIds.map((quizSetId) => ({
        quiz_instance_id: data[0].id,
        quiz_set_id: quizSetId,
      }))
    );

  if (quizInstanceError)
    return { error: { message: quizInstanceError.message } } as ServerError;

  const headersList = headers();
  const quizUrl = `https://${headersList.get("host")}/quiz/results/total/${
    data[0].id
  }`;

  if (email) {
    await resend.emails.send({
      from: "Test vizualizační gramotnosti <info@test-vizualizacni-gramotnosti.xyz>",
      to: email,
      subject: "Nový kvíz!",
      react: CodeMailTemplate({ code: data[0].id, quizUrl: quizUrl ?? "" }),
      text: `Kód pro studenty: ${data[0].id}, Výsledky jsou dostupné zde: ${quizUrl}`,
    });
  }

  return data;
};

export const getQuizReadData = async ({ quizId }: { quizId: string }) => {
  const supabase = createClient();

  const { error, data } = await supabase
    .from("quiz_instance")
    .select(
      `id, seconds_per_question, self_test, show_results, without_time_limit, quiz_set(quiz_question(count))`
    )
    .eq("id", quizId)
    .single();

  const questionsCount = data?.quiz_set?.reduce(
    (acc, { quiz_question }) => acc + quiz_question[0].count,
    0
  );

  if (error) return { error: { message: error.message } } as ServerError;

  return { ...data, questionsCount };
};

export const getQuizReadDataFull = async ({ quizId }: { quizId: string }) => {
  const supabase = createClient();

  const { error, data } = await supabase
    .from("quiz_instance")
    .select(
      `id, seconds_per_question, self_test, without_time_limit, show_results, quiz_set(quiz_question(id, text, image_url, quiz_question_answer(id, text)))`
    )
    .eq("id", quizId)
    .single();

  const questions = data?.quiz_set.flatMap(
    ({ quiz_question }) => quiz_question
  );

  if (error) return { error: { message: error.message } } as ServerError;

  const { quiz_set: _, ...rest } = data;
  return { ...rest, questions };
};

export const getQuizResults = async ({ quizId }: { quizId: string }) => {
  const supabase = createClient();

  const { error, data } = await supabase
    .from("quiz_instance")
    .select(
      `id, 
      created_at,
      seconds_per_question,
      quiz_instance_pass(
        id, 
        passer_name, 
        sets_correct_percentage, 
        types_correct_percentage, 
        total_correct_percentage, 
        taken_time
      ),
      quiz_set(
        id, 
        name, 
        quiz_question(
          id, 
          text, 
          type,
          quiz_question_answer(id, text, is_correct)
        )
      )`
    )
    .eq("id", quizId)
    .single();

  if (error) return { error: { message: error.message } } as ServerError;

  const filledInTimes = data?.quiz_instance_pass.length ?? 0;
  const questionCounts = data.quiz_set.reduce<{
    total: number;
  }>(
    (acc, { quiz_question }) => {
      return {
        total: acc.total + quiz_question.length,
      };
    },
    { total: 0 }
  );

  const totalTime = (data.seconds_per_question ?? 0) * questionCounts.total;
  const averageTimeTaken =
    filledInTimes > 0
      ? data.quiz_instance_pass.reduce(
          (acc, { taken_time }) => acc + (taken_time ?? 0),
          0
        ) / filledInTimes
      : 0;

  const averageSuccessRate =
    filledInTimes > 0
      ? data.quiz_instance_pass.reduce(
          (acc, { total_correct_percentage }) =>
            acc + (total_correct_percentage ?? 0),
          0
        ) / filledInTimes
      : 0;

  const averageSetSuccessRate: Record<
    string,
    { percentage: number; name: string }
  > = {};

  data.quiz_instance_pass?.forEach(({ sets_correct_percentage }) => {
    Object.entries(sets_correct_percentage ?? {}).forEach(
      ([setId, { percentage, name }]) => {
        averageSetSuccessRate[setId] = {
          name,
          percentage:
            (averageSetSuccessRate[setId]?.percentage ?? 0) + percentage,
        };
      }
    );
  });

  Object.entries(averageSetSuccessRate).forEach(
    ([setId, { name, percentage }]) => {
      averageSetSuccessRate[setId] = {
        name,
        percentage: percentage / filledInTimes,
      };
    }
  );

  const averageTypeSuccessRate: Record<string, number> = {};

  data.quiz_instance_pass?.forEach(({ types_correct_percentage }) => {
    Object.entries(types_correct_percentage ?? {}).forEach(
      ([typeId, percentage]) => {
        averageTypeSuccessRate[typeId] =
          (averageTypeSuccessRate[typeId] ?? 0) + percentage;
      }
    );
  });

  Object.entries(averageTypeSuccessRate).forEach(([typeId, percentage]) => {
    averageTypeSuccessRate[typeId] = percentage / filledInTimes;
  });

  const individualResults = data?.quiz_instance_pass.map(
    ({ id, passer_name, total_correct_percentage }) => {
      return {
        id,
        passer_name,
        total_correct_percentage,
      };
    }
  );

  return {
    createdAt: data.created_at,
    filledInTimes,
    questionCounts,
    totalTime,
    averageTimeTaken,
    averageSuccessRate,
    averageSetSuccessRate,
    averageTypeSuccessRate,
    individualResults,
  };
};
