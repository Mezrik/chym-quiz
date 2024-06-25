import { FC, useMemo } from "react";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { shuffle } from "@/utils/quiz-setup";

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
  imageUrl?: string | null;
}> = ({ text, id, answers, onAnswer, readOnly, defaultValue, imageUrl }) => {
  const answersShuffled = useMemo(() => {
    return shuffle(answers);
  }, [answers]);

  return (
    <div className="box">
      <h2 className="text-lg font-semibold mb-4">{text}</h2>
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={text}
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: "100%", height: "auto" }}
        />
      )}
      <RadioGroup
        onValueChange={(id) => onAnswer?.(parseInt(id, 10))}
        disabled={readOnly}
        defaultValue={`${defaultValue}`}
      >
        {answersShuffled.map((answer) => (
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
