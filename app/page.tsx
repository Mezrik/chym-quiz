import { cookies } from "next/headers";

export default async function Home() {
  // const supabase = createServerComponentClient<Database>({ cookies });

  // const { data } = await supabase
  //   .from("quiz_set")
  //   .select(`*, quiz_question(*, quiz_question_answer(*))`);

  return (
    <div>
      <h1>Quiz Sets</h1>
    </div>
  );
}
