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
      seconds_per_question: timeLimit,
      self_test: selfTest,
      show_results: showResults,
    })
    .select();

  if (error) return { error: { message: error.message } } as ServerError;

  // need to pick questions from the selected quiz sets and insert them into the quiz_instance_question table

  const quizSets = await supabase
    .from("quiz_set")
    .select(`*, quiz_question(*)`)
    .in("id", quizSetIds);

  if (quizSets.error)
    return { error: { message: quizSets.error.message } } as ServerError;

  console.log(quizSets.data);
  const quizSetQuestions = pickRandomQuestions(
    quizSets.data.map((quizSet) => quizSet.quiz_question.map((q) => q.id))
  );

  const { error: quizInstanceError } = await supabase
    .from("quiz_instance_question")
    .insert(
      quizSetQuestions.map((questionId) => ({
        quiz_instance_id: data[0].id,
        quiz_question_id: questionId,
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
      `id, seconds_per_question, self_test, show_results, quiz_instance_question(count)`
    )
    .eq("id", quizId)
    .single();

  if (error) return { error: { message: error.message } } as ServerError;

  return data;
};

export const getQuizReadDataFull = async ({ quizId }: { quizId: string }) => {
  const supabase = createClient();

  const { error, data } = await supabase
    .from("quiz_instance")
    .select(
      `id, seconds_per_question, self_test, show_results, quiz_instance_question(id, quiz_question(id, text, quiz_question_answer(id, text)))`
    )
    .eq("id", quizId)
    .single();

  if (error) return { error: { message: error.message } } as ServerError;

  return data;
};
