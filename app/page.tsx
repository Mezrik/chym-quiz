import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function Home() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data } = await supabase.from("quiz-set").select();

  return (
    <div>
      <h1>Quiz Sets</h1>
      <ul>
        {data?.map((quizSet) => (
          <li key={quizSet.id}>
            <h2>{quizSet.name}</h2>
          </li>
        ))}
      </ul>
    </div>
  );
}
