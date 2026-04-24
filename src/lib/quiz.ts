import { supabase } from "./supabase";

export type QuizQuestion = {
  id: number;
  question: string;
  image: string | null;
  options: string[];
  answer: number;
  sort_order: number;
};

export const SECRET_PASSPHRASE = "천사의 날개";

export async function getQuizQuestions(): Promise<QuizQuestion[]> {
  const { data } = await supabase
    .from("quiz_questions")
    .select("id, question, image, options, answer, sort_order")
    .order("sort_order", { ascending: true });

  return (data ?? []).map((row) => ({
    id: row.id,
    question: row.question,
    image: row.image,
    options: typeof row.options === "string" ? JSON.parse(row.options) : row.options,
    answer: row.answer,
    sort_order: row.sort_order,
  }));
}
