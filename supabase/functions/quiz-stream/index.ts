// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

import { createClient } from "https://esm.sh/@supabase/supabase-js";
import { corsHeaders } from "../_shared/cors.ts";

console.log("Hello from Functions!");

const msg = new TextEncoder().encode();

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: { ...corsHeaders },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    {
      global: { headers: { Authorization: req.headers.get("Authorization")! } },
    }
  );

  const requestPayload = await req.json();

  const { quizPassId } = requestPayload;

  const { data, error } = await supabase
    .from("quiz_instance_pass")
    .select(
      `start, end, quiz_instance(seconds_per_question, quiz_set(quiz_question(count)))`
    )
    .eq("id", quizPassId)
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: { message: error.message } }), {
      status: 500,
      "Content-Type": "application/json",
      headers: { ...corsHeaders },
    });
  }

  if (data.start || data.end) {
    return new Response(JSON.stringify({ error: { message: "started" } }), {
      status: 400,
      "Content-Type": "application/json",
      headers: { ...corsHeaders },
    });
  }

  const questionsCount =
    data?.quiz_instance?.quiz_set
      .flatMap(({ quiz_question }) => quiz_question)
      .map(({ count }) => count)
      .reduce((acc, val) => acc + val, 0) ?? 0;

  const totalTime =
    (data?.quiz_instance?.seconds_per_question ?? 0) * questionsCount;

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

  let timerId: number | undefined;
  const body = new ReadableStream({
    start(controller) {
      start = Date.now();
      const end = start + totalTime * 1000;

      timerId = setInterval(() => {
        if (Date.now() < end) {
          controller.enqueue(
            new TextEncoder().encode(
              JSON.stringify({
                event: "time-tick",
                payload: { timeRemaining: end - Date.now() },
              })
            )
          );
        } else {
          controller.enqueue(
            new TextEncoder().encode(JSON.stringify({ event: "time-end" }))
          );

          setEnd();

          timerId && clearInterval(timerId);
        }
      }, 1000);
    },
    cancel() {
      if (typeof timerId === "number") {
        clearInterval(timerId);
      }
    },
  });

  return new Response(body, {
    headers: {
      ...corsHeaders,
      "Content-Type": "text/event-stream",
    },
  });
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/quiz-stream' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
