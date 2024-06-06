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
      `start, end, quiz_instance(seconds_per_question, quiz_set(quiz_question(count)))`
    )
    .eq("id", quizPassId)
    .single();

  if (error) return { error: { message: error.message } } as ServerError;

  if (data.start || data.end)
    return {
      error: { message: "Quiz already started or ended" },
    } as ServerError;

  const questionsCount =
    data?.quiz_instance?.quiz_set
      .flatMap(({ quiz_question }) => quiz_question)
      .map(({ count }) => count)
      .reduce((acc, val) => acc + val, 0) ?? 0;

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

  const insertResults = async (payload: Record<string, number>) => {
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
  };

  channel
    .on("broadcast", { event: "submit" }, async ({ payload }) => {
      setEnd();

      insertResults(payload);

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
        }
      }, 1000);
    });

  return roomId;
};

export const hasQuizPassEnded = async ({
  quizPassId,
}: {
  quizPassId: string;
}) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("quiz_instance_pass")
    .select("end")
    .eq("id", quizPassId)
    .single();

  if (error) return { error: { message: error.message } } as ServerError;

  return !!data?.end;
};

export const getQuizPassResults = async ({
  quizPassId,
}: {
  quizPassId: string;
}) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("quiz_instance_pass")
    .select(
      `
      id, 
      passer_name, 
      start, 
      end, 
      quiz_instance_id, 
      quiz_instance_pass_answer(
        id, 
        quiz_question(type, quiz_set(id)), 
        quiz_question_answer(id, text, is_correct)
      )`
    )
    .eq("id", quizPassId)
    .single();

  if (error) return { error: { message: error.message } } as ServerError;

  if (data?.quiz_instance_id === null)
    return {
      error: { message: "Quiz pass does not have assigned instance" },
    } as ServerError;

  const quizInstance = await supabase
    .from("quiz_instance")
    .select(`seconds_per_question ,quiz_set(id, name, quiz_question(id, type))`)
    .eq("id", data.quiz_instance_id)
    .single();

  if (quizInstance.error)
    return { error: { message: quizInstance.error.message } } as ServerError;

  const setsCorrectAnwers: Record<number, number> = {};
  const typeCorrectAnswers: Partial<
    Record<Database["public"]["Enums"]["chart_type"], number>
  > = {};

  const correctAnswers = data.quiz_instance_pass_answer.filter(
    ({ quiz_question_answer, quiz_question }) => {
      if (!quiz_question_answer?.is_correct) return false;

      const quizSetId = quiz_question?.quiz_set[0].id;

      if (quizSetId) {
        if (!setsCorrectAnwers[quizSetId]) {
          setsCorrectAnwers[quizSetId] = 0;
        }
        setsCorrectAnwers[quizSetId] += 1;
      }

      const type = quiz_question?.type;
      if (type) {
        if (!typeCorrectAnswers[type]) {
          typeCorrectAnswers[type] = 0;
        }
        typeCorrectAnswers[type]! += 1;
      }

      return quiz_question_answer?.is_correct;
    }
  );

  const questionCounts = quizInstance.data.quiz_set.reduce<{
    setsQuestions: Record<number, { count: number; name: string }>;
    typeQuestions: Partial<
      Record<Database["public"]["Enums"]["chart_type"], number>
    >;
    total: number;
  }>(
    (acc, { quiz_question, name, id }) => {
      return {
        total: acc.total + quiz_question.length,
        setsQuestions: {
          ...acc.setsQuestions,
          [id]: {
            count: quiz_question.length,
            name: name ?? "",
          },
        },
        typeQuestions: quiz_question.reduce(
          (questions, { type }) => ({
            ...questions,
            [type]: (questions[type] || 0) + 1,
          }),
          acc.typeQuestions
        ),
      };
    },
    { setsQuestions: {}, typeQuestions: {}, total: 0 }
  );

  const takenTime =
    data.end && data.start
      ? (new Date(data.end).getTime() - new Date(data.start).getTime()) / 1000
      : null;

  return {
    filledIn: data.end,
    numberOfQuestions: questionCounts.total,
    maxTime: quizInstance.data.seconds_per_question * questionCounts.total,
    takenTime,
    totalCorrectPercentage:
      (correctAnswers.length / questionCounts.total) * 100,
    setsCorrectPercentage: Object.entries(questionCounts.setsQuestions).reduce(
      (acc, [key, value]) => {
        return {
          ...acc,
          [key]: {
            percentage:
              ((setsCorrectAnwers[key as unknown as number] ?? 0) /
                value.count) *
              100,
            name: value.name,
          },
        };
      },
      {} as Record<number, { percentage: number; name: string }>
    ),
    typesCorrectPercentage: Object.entries(questionCounts.typeQuestions).reduce(
      (acc, [key, value]) => {
        return {
          ...acc,
          [key]:
            ((typeCorrectAnswers[
              key as Database["public"]["Enums"]["chart_type"]
            ] ?? 0) /
              value) *
            100,
        };
      },
      {} as Partial<Record<Database["public"]["Enums"]["chart_type"], number>>
    ),
  };
};
