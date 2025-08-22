import { prisma } from "@/lib/db";
import QuizClient from "./QuizClient";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: { slug: string } }) {
  const quiz = await prisma.quiz.findFirst({ where: { publicSlug: params.slug, isPublished: true } });
  if (!quiz) return <div className="p-6">Quiz not found.</div>;
  const questions = await prisma.question.findMany({ where: { quizId: quiz.id } });
  
  // Transform the data to match QuizClient expectations
  const quizWithQuestions = {
    id: quiz.id,
    title: quiz.title,
    questions: questions.map(q => ({
      id: q.id,
      prompt: q.prompt,
      options: q.options as string[],
      correctIndex: q.correctIndex,
      rationale: q.rationale
    }))
  };
  
  return (
    <div className="max-w-[760px] mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-2">{quiz.title ?? "Quiz"}</h1>
      <p className="text-sm text-gray-600 mb-6">{questions.length} questions • Difficulty: {quiz.difficulty}</p>
      <QuizClient quiz={quizWithQuestions} slug={params.slug} />
    </div>
  );
}
