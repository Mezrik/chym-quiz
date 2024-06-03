"use server";

import { createClient } from "@/utils/server";

type ServerError = {
  error: { message: string };
};

export const initializeQuiz = async ({
  quizId,
  passer_name,
}: {
  quizId: string;
  passer_name: string;
}) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("quiz_instance_pass")
    .insert({ passer_name, quiz_instance_id: quizId })
    .select();

  if (error) return { error: { message: error.message } } as ServerError;

  return data;
};

export const startQuiz = async ({ quizPassId }: { quizPassId: string }) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("quiz_instance_pass")
    .select(
      `start, end, quiz_instance(seconds_per_question, quiz_instance_question(count))`
    )
    .eq("id", quizPassId)
    .single();

  if (error) return { error: { message: error.message } } as ServerError;

  if (data.start || data.end)
    return {
      error: { message: "Quiz already started or ended" },
    } as ServerError;

  const questionsCount =
    data.quiz_instance?.quiz_instance_question?.[0].count ?? 0;

  const totalTime =
    (data?.quiz_instance?.seconds_per_question ?? 0) * questionsCount;

  const roomId = `quiz-pass-${quizPassId}`;
  const channel = supabase.channel(roomId);

  const startDate = new Date();
  let start = startDate.getTime();
  let interval: NodeJS.Timeout | null = null;

  const startResponse = await supabase
    .from("quiz_instance_pass")
    .update({ start: startDate.toISOString() })
    .eq("id", quizPassId);

  const setEnd = async () => {
    await supabase
      .from("quiz_instance_pass")
      .update({ end: new Date().toISOString() })
      .eq("id", quizPassId);
  };

  channel
    .on("broadcast", { event: "submit" }, async ({ payload }) => {
      setEnd();

      await supabase
        .from("quiz_instance_pass_answer")
        .insert(
          Object.entries<number>(payload).map(([key, value]) => ({
            quiz_question_id: parseInt(key, 10),
            quiz_instance_pass_id: quizPassId,
            quiz_question_answer_id: value,
          }))
        )
        .select();

      channel.unsubscribe();
      interval && clearInterval(interval);
    })
    .subscribe((status) => {
      // Wait for successful connection
      if (status !== "SUBSCRIBED") {
        return null;
      }

      start = Date.now();
      const end = start + totalTime * 1000;

      const tick = () =>
        channel.send({
          type: "broadcast",
          event: "time-tick",
          payload: { timeRemaining: end - Date.now() },
        });

      tick();
      interval = setInterval(() => {
        if (Date.now() < end) {
          tick();
        } else {
          channel.send({
            type: "broadcast",
            event: "time-end",
            payload: { message: "end" },
          });

          setEnd();

          interval && clearInterval(interval);
          channel.unsubscribe();
        }
      }, 1000);
    });

  return roomId;
};
