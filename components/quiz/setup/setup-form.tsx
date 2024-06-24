"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { timeFormat } from "@/utils/time";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ServerError, getQuizSets } from "@/actions/quiz-set";
import { Question } from "../question";

type QuizSets = Exclude<Awaited<ReturnType<typeof getQuizSets>>, ServerError>;

const FormSchema = z
  .object({
    quizSets: z
      .array(z.number())
      .nonempty({ message: "Vyberte alespoň jeden okruh" }),
    withoutTimeLimit: z.boolean(),
    withoutUserResults: z.boolean(),
    timeLimit: z
      .union([
        z.coerce
          .number({
            required_error: "Časový limit je povinný",
            invalid_type_error: "Časový limit musí být číslo",
          })
          .min(1, { message: "Časový limit musí být větší než 0" }),
        z.null(),
      ])
      .optional(),
    email: z.string().email({ message: "Nesprávný email" }),
  })
  .superRefine((data, ctx) => {
    if (!data.withoutTimeLimit && data.timeLimit === null) {
      ctx.addIssue({
        path: ["timeLimit"],
        code: z.ZodIssueCode.custom,
        message:
          "Časový limit je povinný, pokud 'Bez časového limitu' není zvoleno",
      });
    }
  });

export const SetupForm: React.FC<{
  quizSets: QuizSets;
  quizSetsLoading?: boolean;
  handleSubmit: (
    values: z.infer<typeof FormSchema> & { selfTest?: boolean }
  ) => void;
  selfTest?: boolean;
}> = ({ quizSets, handleSubmit, quizSetsLoading, selfTest }) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      quizSets: [],
      withoutTimeLimit: false,
      timeLimit: 30,
      email: "",
      withoutUserResults: false,
    },
  });

  const disableTimeLimit = form.watch("withoutTimeLimit", true);

  const onSubmit = (data: z.infer<typeof FormSchema>) =>
    handleSubmit({ ...data, selfTest });

  const questionsCount = quizSets
    .filter((set) => form.watch("quizSets", undefined)?.includes(set.id))
    .map((set) => set.quiz_set_question.length)
    .reduce((a, b) => a + b, 0);

  const totalTime = questionsCount * (form.watch("timeLimit") ?? 0);

  const selectedQuizSetsQuestions = quizSets
    .filter((set) => form.watch("quizSets", undefined)?.includes(set.id))
    .flatMap(({ quiz_set_question }) =>
      quiz_set_question.map(({ quiz_question }) => quiz_question)
    );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="quizSets"
          render={() => (
            <FormItem className="box">
              <div className="mb-4">
                <FormLabel className="text-base">Vyberte okruhy</FormLabel>
                <FormDescription>
                  okruhů lze vybrat libovolné množství
                </FormDescription>
              </div>
              {quizSets.map((set) => (
                <FormField
                  key={set.id}
                  control={form.control}
                  name="quizSets"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={set.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(set.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange(
                                    Array.from(
                                      new Set([...field.value, set.id])
                                    )
                                  )
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== set.id
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {set.name}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
              {quizSetsLoading &&
                new Array(8)
                  .fill(0)
                  .map((_, index) => (
                    <Skeleton
                      key={`skeleton-${index}`}
                      className="h-4 w-[250px]"
                    />
                  ))}
              <FormMessage />

              <div className="pt-2">Test bude mít {questionsCount} otázek</div>
            </FormItem>
          )}
        />
        <fieldset className="box space-y-5">
          <FormField
            disabled={disableTimeLimit}
            control={form.control}
            name="timeLimit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Časový limit</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Časový limit v sekundách"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormDescription>
                  Vyplňte časový limit na otázku v sekundách
                </FormDescription>
                {totalTime > 0 && !disableTimeLimit && (
                  <FormDescription>
                    Test bude celkově trvat{" "}
                    {
                      <span className="text-green-600 font-bold">
                        {timeFormat(totalTime)}
                      </span>
                    }
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="withoutTimeLimit"
            render={({ field }) => (
              <FormItem className="space-x-3 space-y-0 flex flex-row items-start">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Bez časového limitu</FormLabel>
                </div>
              </FormItem>
            )}
          />
        </fieldset>
        <fieldset className="box space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input
                    placeholder="email@email.cz"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormDescription>
                  Zadejte e-mail pokud chcete zaslat výsledky
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {!selfTest && (
            <FormField
              control={form.control}
              name="withoutUserResults"
              render={({ field }) => (
                <FormItem className="space-x-3 space-y-0 flex flex-row items-start">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Neukazovat podrobné výsledky uživatelům
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
          )}
        </fieldset>
        <div className="flex gap-2">
          <Button type="submit">Vytvořit test</Button>
          {!selfTest && (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant={"outline"}
                  disabled={selectedQuizSetsQuestions.length <= 0}
                >
                  Náhled otázek
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px] max-h-[80vh] flex flex-col">
                <DialogHeader>
                  <DialogTitle>Náhled otázek</DialogTitle>
                </DialogHeader>
                <div className="overflow-y-auto h-full">
                  <div className="flex flex-col gap-4 py-4">
                    {selectedQuizSetsQuestions?.map((q) =>
                      q ? (
                        <Question
                          key={q.id}
                          id={q.id}
                          text={q?.text}
                          answers={q?.quiz_question_answer ?? []}
                          readOnly
                          imageUrl={q?.image_url}
                        />
                      ) : null
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </form>
    </Form>
  );
};
