"use server";

import { createClient } from "@/utils/server";
import { pickRandomQuestions } from "@/utils/quiz-setup";

type ServerError = {
  error: { message: string };
};

export const insertNewQuizInstance = async ({
  quizSetIds,
  email,
  timeLimit,
  selfTest,
  showResults,
}: {
  quizSetIds: number[];
  email?: string | null;
  timeLimit?: number | null;
  selfTest?: boolean;
  showResults?: boolean;
}) => {
  const supabase = createClient();

  const { error, data } = await supabase
    .from("quiz_instance")
    .insert({
      author_email: email ?? "",
      seconds_per_question: timeLimit ?? 0,
      self_test: selfTest,
      show_results: showResults,
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

  return data;
};

export const getQuizReadData = async ({ quizId }: { quizId: string }) => {
  const supabase = createClient();

  const { error, data } = await supabase
    .from("quiz_instance")
    .select(
      `id, seconds_per_question, self_test, show_results, quiz_set(quiz_question(count))`
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
      `id, seconds_per_question, self_test, show_results, quiz_set(quiz_question(id, text, quiz_question_answer(id, text)))`
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
