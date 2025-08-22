import { prisma } from "@/lib/db";

export async function POST(req: Request, { params }: { params: { slug: string } }) {
  const { choices, studentLabel } = await req.json();
  const quiz = await prisma.quiz.findFirst({ where: { publicSlug: params.slug, isPublished: true } });
  if (!quiz) return new Response("Not found", { status: 404 });
  const questions = await prisma.question.findMany({ where: { quizId: quiz.id }, orderBy: { id: "asc" } });

  if (!Array.isArray(choices) || choices.length !== questions.length) return new Response("Bad payload", { status: 400 });

  let correct = 0;
  const submission = await prisma.submission.create({ data: { quizId: quiz.id, studentLabel: studentLabel ?? null } });
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const chosen = choices[i];
    const isCorrect = chosen === q.correctIndex;
    if (isCorrect) correct++;
    await prisma.answer.create({ data: { submissionId: submission.id, questionId: q.id, chosenIndex: chosen, isCorrect } });
  }
  await prisma.submission.update({ where: { id: submission.id }, data: { submittedAt: new Date() } });
  return new Response(JSON.stringify({ score: correct, total: questions.length }), { status: 200 });
}
