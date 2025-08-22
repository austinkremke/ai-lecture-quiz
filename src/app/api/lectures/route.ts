import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { transcribeBuffer } from "@/lib/stt";
import { summarizeTranscript, generateQuiz } from "@/lib/llm";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file") as File | null;
  const title = (form.get("title") as string | null) ?? "Untitled Lecture";
  const difficulty = ((form.get("difficulty") as string | null) ?? "medium") as "easy"|"medium"|"hard";
  const numQuestions = Number((form.get("numQuestions") as string | null) ?? "8");

  if (!file) return new Response(JSON.stringify({ error: "Missing file" }), { status: 400 });

  const buf = Buffer.from(await file.arrayBuffer());
  const mime = file.type || "audio/webm";

  const lecture = await prisma.lecture.create({ data: { title, status: "transcribing" } });

  try {
    const transcript = await transcribeBuffer(buf, mime);
    await prisma.lecture.update({ where: { id: lecture.id }, data: { transcriptJson: transcript, status: "summarizing" } });

    const summaryMd = await summarizeTranscript(transcript.segments);
    await prisma.lecture.update({ where: { id: lecture.id }, data: { summaryMd, status: "quizzing" } });

    const quizJson = await generateQuiz(transcript.segments, difficulty, numQuestions);
    const quiz = await prisma.quiz.create({ data: { lectureId: lecture.id, difficulty, numQuestions, title } });
    await prisma.$transaction(quizJson.questions.map((q: any) => prisma.question.create({
      data: { 
        quizId: quiz.id, 
        prompt: q.prompt, 
        options: q.options, 
        correctIndex: q.correct_index, 
        rationale: q.rationale || null, 
        sources: q.sources || null 
      }
    })));

    await prisma.lecture.update({ where: { id: lecture.id }, data: { status: "ready" } });
    return new Response(JSON.stringify({ ok: true, lectureId: lecture.id, quizId: quiz.id }), { status: 200 });
  } catch (e: any) {
    await prisma.lecture.update({ where: { id: lecture.id }, data: { status: "error" } });
    return new Response(JSON.stringify({ error: e?.message || "processing failed" }), { status: 500 });
  }
}
