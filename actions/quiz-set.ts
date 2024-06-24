"use server";

import { createClient } from "@/utils/server";

export type ServerError = {
  error: { message: string };
};

export const getQuizSets = async () => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("quiz_set")
    .select(`*, quiz_set_question(quiz_question(*, quiz_question_answer(*)))`);

  if (error) return { error: { message: error.message } } as ServerError;

  return data;
};
