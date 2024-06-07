import { FC } from "react";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

type QuestionAnswer = Pick<
  Database["public"]["Tables"]["quiz_question_answer"]["Row"],
  "id" | "text"
> & { is_correct?: boolean };

export const Question: FC<{
  text: string;
  id: number;
  answers: QuestionAnswer[];
  onAnswer?: (answerId: number) => void;
  readOnly?: boolean;
  defaultValue?: number | null;
  correctValue?: number | null;
}> = ({
  text,
  id,
  answers,
  onAnswer,
  readOnly,
  defaultValue,
  correctValue,
}) => {
  return (
    <div className="box">
      <h2 className="text-lg font-semibold mb-4">{text}</h2>
      <RadioGroup
        onValueChange={(id) => onAnswer?.(parseInt(id, 10))}
        disabled={readOnly}
        defaultValue={`${defaultValue}`}
      >
        {answers.map((answer) => (
          <div
            className="flex items-center space-x-2"
            key={`answer-${answer.id}`}
          >
            <RadioGroupItem value={answer.id + ""} id={`${id}-${answer.id}`} />
            <Label
              htmlFor={`${id}-${answer.id}`}
              className={cn(answer.is_correct ? "text-green-500" : "")}
            >
              {answer.text}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};
