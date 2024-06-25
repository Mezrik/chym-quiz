"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/client";
import debounce from "debounce";
import { useRouter } from "next/navigation";

const asyncValidateQuizId = debounce(async (quizId: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("quiz_instance")
    .select("*")
    .eq("id", quizId)
    .single();
  return !!error || !data;
}, 500);

const FormSchema = z
  .object({
    quizId: z.string().uuid({ message: "Neplatný kód" }),
    name: z.string().min(1, { message: "Jméno je povinné" }),
  })
  .superRefine(async (d, ctx) => {
    if (await asyncValidateQuizId(d.quizId)) {
      ctx.addIssue({
        path: ["quizId"],
        code: z.ZodIssueCode.custom,
        message: "Test se zadaným kódem neexistuje",
      });
    }
  });

export default function Page() {
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema, { async: true }, { mode: "async" }),
    defaultValues: {
      quizId: "",
      name: "",
    },
    mode: "onBlur",
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) =>
    router.push(`/quiz/${data.quizId}?name=${data.name}`);

  return (
    <div className="col-span-12">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <fieldset className="flex gap-4 flex-col md:flex-row">
            <FormField
              control={form.control}
              name="quizId"
              render={({ field }) => (
                <FormItem className="box grow">
                  <FormLabel>Kód testu</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Zadejte kód testu"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormDescription>
                    Zadejte kód testu, který jste dostali od lektora
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="box grow">
                  <FormLabel>Jméno</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Zadejte vaše jméno"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormDescription>
                    Zadejte jméno, které uvidí lektor
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </fieldset>
          <Button type="submit">Pokračovat</Button>
        </form>
      </Form>
    </div>
  );
}
