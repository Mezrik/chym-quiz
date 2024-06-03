import { z } from "zod";

const FormSchema = z.object({
  quizId: z.string().refine(async (id) => {
    // verify that ID exists in database
    return true;
  }),
});

export default function Page() {
  return <div className="box"></div>;
}
