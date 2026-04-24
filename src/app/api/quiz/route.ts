import { supabase } from "@/lib/supabase";
import { getQuizQuestions, SECRET_PASSPHRASE } from "@/lib/quiz";

export const dynamic = "force-dynamic";

export async function GET() {
  const questions = await getQuizQuestions();

  const clientQuestions = questions.map((q) => ({
    id: q.id,
    question: q.question,
    image: q.image,
    options: q.options,
  }));

  return Response.json({ questions: clientQuestions });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim().slice(0, 20) : "";
  const answers = body?.answers;

  const questions = await getQuizQuestions();

  if (!name || !Array.isArray(answers) || answers.length !== questions.length) {
    return Response.json({ error: "Invalid submission" }, { status: 400 });
  }

  let correctCount = 0;
  for (let i = 0; i < questions.length; i++) {
    if (answers[i] === questions[i].answer) {
      correctCount++;
    }
  }

  const perfect = correctCount === questions.length;

  await supabase.from("quiz_answers").insert({
    name,
    score: correctCount,
    correct: perfect,
  });

  return Response.json({
    score: correctCount,
    total: questions.length,
    perfect,
    passphrase: perfect ? SECRET_PASSPHRASE : null,
  });
}
