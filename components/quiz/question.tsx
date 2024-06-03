import { FC } from "react";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type QuestionAnswer = Pick<
  Database["public"]["Tables"]["quiz_question_answer"]["Row"],
  "id" | "text"
>;

export const Question: FC<{
  text: string;
  id: number;
  answers: QuestionAnswer[];
  onAnswer: (answerId: number) => void;
}> = ({ text, id, answers, onAnswer }) => {
  return (
    <div className="box">
      <h2 className="text-lg font-semibold mb-4">{text}</h2>
      <RadioGroup onValueChange={(id) => onAnswer(parseInt(id, 10))}>
        {answers.map((answer) => (
          <div
            className="flex items-center space-x-2"
            key={`answer-${answer.id}`}
          >
            <RadioGroupItem value={answer.id + ""} id={`${id}-${answer.id}`} />
            <Label htmlFor={`${id}-${answer.id}`}>{answer.text}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};
